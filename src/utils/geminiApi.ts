import { clientFetch } from "./api";

export async function* generateContentStreamWithRetries(params: any): AsyncGenerator<any> {
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
