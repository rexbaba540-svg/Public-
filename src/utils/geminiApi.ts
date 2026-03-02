import { clientFetch } from "./api";
import { GoogleGenAI } from "@google/genai";

interface GeminiClient {
  apiKey: string;
  client: GoogleGenAI;
  isRateLimited: boolean;
  rateLimitResetTime: number;
}

const geminiClients: GeminiClient[] = [];
let isInitializing = false;
let initializationPromise: Promise<void> | null = null;

// Initialize Gemini clients
const initializeClients = async () => {
  // If we are already initializing, return the existing promise
  if (isInitializing) return initializationPromise;
  
  // If we already have clients, we don't need to initialize again unless forced (not implemented here)
  if (geminiClients.length > 0) return Promise.resolve();

  isInitializing = true;

  initializationPromise = (async () => {
    geminiClients.length = 0; // Clear existing
    const keys = new Set<string>();

    // 1. Try Client-Side Baked-in Keys
    if (typeof window !== 'undefined') {
      // @ts-ignore
      const allKeys = import.meta.env.VITE_ALL_GEMINI_KEYS as string[];
      if (Array.isArray(allKeys)) {
        allKeys.forEach(k => keys.add(k));
      }
      const singleKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (singleKey) keys.add(singleKey);
    } 
    
    // 2. Try Server-Side Keys (Node.js environment)
    if (typeof process !== 'undefined' && process.env) {
      const multiKeys = process.env.GEMINI_API_KEYS || process.env.VITE_GEMINI_API_KEYS;
      if (multiKeys) {
        multiKeys.split(',').forEach(key => {
          if (key.trim()) keys.add(key.trim());
        });
      }
      const singleKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
      if (singleKey) keys.add(singleKey);
      for (let i = 1; i <= 20; i++) {
        const apiKey = process.env[`GEMINI_API_KEY_${i}`] || process.env[`VITE_GEMINI_API_KEY_${i}`];
        if (apiKey) keys.add(apiKey);
      }
    }

    // 3. If no keys found yet (Client-side runtime), fetch from backend
    if (keys.size === 0 && typeof window !== 'undefined') {
      try {
        console.log("Fetching Gemini keys from backend...");
        const response = await clientFetch('/api/gemini/keys');
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data.keys)) {
            data.keys.forEach((k: string) => keys.add(k));
            console.log(`Fetched ${data.keys.length} keys from backend.`);
          }
        } else {
          console.warn("Failed to fetch keys from backend:", response.statusText);
        }
      } catch (error) {
        console.warn("Error fetching keys from backend:", error);
      }
    }

    keys.forEach(apiKey => {
      geminiClients.push({
        apiKey,
        client: new GoogleGenAI({ apiKey }),
        isRateLimited: false,
        rateLimitResetTime: 0
      });
    });

    if (geminiClients.length === 0) {
      console.warn("No Gemini API keys found. Client-side generation may fail.");
    } else {
      console.log(`Initialized ${geminiClients.length} Gemini API clients.`);
    }
    
    isInitializing = false;
  })();

  return initializationPromise;
};

// Initialize on load (fire and forget)
initializeClients();

export async function* generateContentStreamWithRetries(params: any): AsyncGenerator<any> {
  // Always ensure clients are initialized. If empty, try again (maybe user logged in now)
  if (geminiClients.length === 0) {
    await initializeClients();
  }

  // 1. Try Client-Side Rotation First
  if (geminiClients.length > 0) {
    const now = Date.now();
    geminiClients.forEach(client => {
      if (client.isRateLimited && now > client.rateLimitResetTime) {
        client.isRateLimited = false;
        client.rateLimitResetTime = 0;
      }
    });

    let availableClients = geminiClients.filter(client => !client.isRateLimited);
    if (availableClients.length === 0) availableClients = [...geminiClients];
    availableClients.sort(() => Math.random() - 0.5);

    let lastError: any = null;

    for (const client of availableClients) {
      try {
        const model = params.model || 'gemini-3-flash-preview';
        const stream = await client.client.models.generateContentStream({
          model: model,
          contents: params.contents,
          config: params.config
        });
        
        for await (const chunk of stream) {
          yield { text: chunk.text };
        }
        return; // Success
      } catch (error: any) {
        console.warn(`Gemini Client-side call failed with key ...${client.apiKey.slice(-4)}:`, error.message);
        
        const isRateLimit = error.status === 429 || 
                            error.status === 503 || 
                            (error.message && (
                              error.message.includes('429') || 
                              error.message.includes('RESOURCE_EXHAUSTED') || 
                              error.message.includes('quota') ||
                              error.message.includes('limit')
                            ));

        if (isRateLimit) {
          client.isRateLimited = true;
          client.rateLimitResetTime = Date.now() + 60000;
        } else {
          lastError = error;
        }
      }
    }
    console.warn("All client-side keys failed. Falling back to backend proxy.");
  }

  // 2. Fallback to Backend Proxy
  try {
    const response = await clientFetch('/api/gemini/generate', {
      method: 'POST',
      body: JSON.stringify({
        model: params.model,
        prompt: params.contents,
        config: params.config
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate content via backend');
    }

    const data = await response.json();
    yield { text: data.text };
  } catch (error: any) {
    console.error("Gemini API call failed via backend:", error.message);
    throw error;
  }
}

export async function generateContentWithRetries(params: any): Promise<any> {
  let fullText = "";
  let lastChunk: any = null;
  
  for await (const chunk of generateContentStreamWithRetries(params)) {
    fullText += chunk.text || "";
    lastChunk = chunk;
  }
  
  if (!lastChunk && !fullText) throw new Error("No content generated");
  
  return {
    text: fullText
  };
}
