import { clientFetch } from "./api";
import { GoogleGenAI } from "@google/genai";

// Initialize client-side Gemini instance if key is available
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export async function* generateContentStreamWithRetries(params: any): AsyncGenerator<any> {
  // Try client-side first if key is available (avoids backend timeouts)
  if (ai) {
    try {
      const model = params.model || 'gemini-3-flash-preview';
      const response = await ai.models.generateContentStream({
        model: model,
        contents: params.contents,
        config: params.config
      });

      for await (const chunk of response) {
        yield { text: chunk.text };
      }
      return;
    } catch (error: any) {
      console.warn("Client-side Gemini call failed, falling back to backend:", error.message);
      // Fallthrough to backend
    }
  }

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
    // Simulate a single chunk for now since we are not using real streaming over HTTP yet
    yield { text: data.text };
  } catch (error: any) {
    console.error("Gemini API call failed via backend:", error.message);
    throw error;
  }
}

export async function generateContentWithRetries(params: any): Promise<any> {
  // Try client-side first if key is available
  if (ai) {
    try {
      const model = params.model || 'gemini-3-flash-preview';
      const response = await ai.models.generateContent({
        model: model,
        contents: params.contents,
        config: params.config
      });
      return { text: response.text };
    } catch (error: any) {
      console.warn("Client-side Gemini call failed, falling back to backend:", error.message);
      // Fallthrough to backend
    }
  }

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

  return await response.json();
}
