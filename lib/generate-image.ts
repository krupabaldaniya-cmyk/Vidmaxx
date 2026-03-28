import { fetchWithRetry } from "./fetch-utils";

export async function generateImage(prompt: string): Promise<Buffer> {
  const accountId = process.env.CF_ACCOUNT_ID;
  const apiToken = process.env.CF_API_TOKEN;

  if (!accountId || !apiToken) {
    throw new Error("Missing CF_ACCOUNT_ID or CF_API_TOKEN in environment");
  }

    const response = await fetchWithRetry(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/stabilityai/stable-diffusion-xl-base-1.0`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
        timeoutMs: 60000,
        maxRetries: 5,
        baseDelayMs: 3000,
      }
    );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Cloudflare Workers AI error: ${response.status} — ${errorText}`);
  }

  // Returns raw PNG bytes as Buffer — NOT a Blob
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}