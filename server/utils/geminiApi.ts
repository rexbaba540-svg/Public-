import { GoogleGenAI } from "@google/genai";

interface GeminiClient {
  apiKey: string;
  client: GoogleGenAI;
  isRateLimited: boolean;
  rateLimitResetTime: number;
}

const geminiClients: GeminiClient[] = [];

// Initialize Gemini clients from environment variables
const initializeClients = () => {
  geminiClients.length = 0; // Clear existing
  const keys = new Set<string>();

  // Check for comma-separated keys
  const multiKeys = process.env.GEMINI_API_KEYS || process.env.VITE_GEMINI_API_KEYS;
  if (multiKeys) {
    multiKeys.split(',').forEach(key => {
      const trimmedKey = key.trim();
      if (trimmedKey) keys.add(trimmedKey);
    });
  }

  // Check for single key
  const singleKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (singleKey) keys.add(singleKey);

  // Check for numbered keys
  for (let i = 1; i <= 20; i++) {
    const apiKey = process.env[`GEMINI_API_KEY_${i}`] || process.env[`VITE_GEMINI_API_KEY_${i}`];
    if (apiKey) keys.add(apiKey);
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
    console.error("CRITICAL: No Gemini API keys configured. Project generation will fail.");
    console.error("Please set GEMINI_API_KEY or GEMINI_API_KEYS in your Netlify environment variables.");
  } else {
    console.log(`Initialized ${geminiClients.length} Gemini API clients.`);
  }
};

// Initialize on load
initializeClients();

export const hasKeys = () => geminiClients.length > 0;

export async function* generateContentStreamWithRetries(params: any): AsyncGenerator<any> {
  if (geminiClients.length === 0) initializeClients();

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
      console.log(`[Gemini] Calling generateContentStream with model: ${params.model || 'default'}`);
      
      // Ensure contents is in the correct format for the SDK
      const formattedParams = {
        model: params.model || 'gemini-3-flash-preview',
        contents: typeof params.contents === 'string' ? { parts: [{ text: params.contents }] } : params.contents,
        config: params.config
      };

      console.log("[Gemini] Formatted Params:", JSON.stringify({
        model: formattedParams.model,
        contentsType: typeof formattedParams.contents,
        isContentsArray: Array.isArray(formattedParams.contents),
        config: formattedParams.config
      }));

      if (!formattedParams.contents) {
        console.error("[Gemini] CRITICAL: contents is missing in formattedParams", params);
        throw new Error("Gemini contents is missing");
      }

      const stream = await client.client.models.generateContentStream(formattedParams);
      for await (const chunk of stream) {
        yield chunk;
      }
      return; // Success
    } catch (error: any) {
      console.error(`Gemini Streaming API call failed with key ending in ...${client.apiKey.slice(-4)}:`, error.message);
      
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

  throw lastError || new Error("All Gemini API keys failed for streaming.");
}

export async function generateContentWithRetries(params: any): Promise<any> {
  let fullText = "";
  let lastChunk: any = null;
  
  for await (const chunk of generateContentStreamWithRetries(params)) {
    fullText += chunk.text || "";
    lastChunk = chunk;
  }
  
  if (!lastChunk) throw new Error("No content generated");
  
  // Return something that looks like the original response object
  return {
    ...lastChunk,
    text: fullText
  };
}

