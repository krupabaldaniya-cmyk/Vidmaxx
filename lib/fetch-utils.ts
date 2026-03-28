export interface FetchWithRetryOptions extends RequestInit {
  timeoutMs?: number;     // per-attempt timeout (default: 30000ms)
  maxRetries?: number;    // total attempts (default: 5)
  baseDelayMs?: number;   // base delay for exponential backoff (default: 2000ms)
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Fetch with exponential backoff retry.
 * Retries on network errors (ECONNRESET, ETIMEDOUT, ConnectTimeoutError)
 * AND on 5xx server errors.
 * Uses AbortController for per-attempt timeout.
 */
export async function fetchWithRetry(
  url: string,
  options: FetchWithRetryOptions = {}
): Promise<Response> {
  const {
    timeoutMs   = parseInt(process.env.FETCH_TIMEOUT_MS ?? "45000"),
    maxRetries  = parseInt(process.env.FETCH_MAX_RETRIES ?? "5"),
    baseDelayMs = 2000,
    ...fetchOptions
  } = options;

  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      console.log(`[fetch] Attempt ${attempt}/${maxRetries}: ${url}`);

      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });

      clearTimeout(timer);

      // Retry on server errors (502, 503, 504) but not on client errors (4xx)
      if (response.status >= 500 && response.status !== 501 && attempt < maxRetries) {
        const delay = baseDelayMs * Math.pow(2, attempt - 1) + Math.random() * 1000;
        console.warn(`[fetch] Server error ${response.status} on attempt ${attempt}. Retrying in ${Math.round(delay)}ms...`);
        await sleep(delay);
        continue;
      }

      return response;

    } catch (err: any) {
      clearTimeout(timer);
      lastError = err;

      const isNetworkError = (
        err?.code === "UND_ERR_CONNECT_TIMEOUT" ||
        err?.code === "ECONNRESET" ||
        err?.code === "ETIMEDOUT" ||
        err?.code === "ENOTFOUND" ||
        err?.name === "AbortError" ||
        err?.cause?.code === "UND_ERR_CONNECT_TIMEOUT" ||
        err?.cause?.code === "ECONNRESET" ||
        err?.message?.includes("fetch failed") ||
        err?.message?.includes("Connect Timeout")
      );

      if (isNetworkError && attempt < maxRetries) {
        const delay = baseDelayMs * Math.pow(2, attempt - 1) + Math.random() * 1000;
        console.warn(
          `[fetch] Network error on attempt ${attempt}/${maxRetries} for ${url}. ` +
          `Retrying in ${Math.round(delay)}ms... Error: ${err?.cause?.code ?? err?.message}`
        );
        await sleep(delay);
        continue;
      }

      // Non-network error or max retries reached — throw immediately
      throw err;
    }
  }

  throw lastError;
}

/**
 * A generic retry wrapper for any asynchronous function.
 * Especially useful for Supabase Storage uploads and other non-fetch operations.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetriesParam?: number,
  initialDelay?: number
): Promise<T> {
  const maxRetries = maxRetriesParam ?? parseInt(process.env.FETCH_MAX_RETRIES ?? "5");
  const baseDelayMs = initialDelay ?? 2000;
  let lastError: any;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 1) {
        const delay = baseDelayMs * Math.pow(2, attempt - 2) + Math.random() * 1000;
        console.log(`[retry-helper] Attempt ${attempt}/${maxRetries}. Waiting ${Math.round(delay)}ms...`);
        await sleep(delay);
      }

      return await fn();
    } catch (error: any) {
      lastError = error;

      const isRetryableError = 
        error.message?.includes("ECONNRESET") || 
        error.message?.includes("ETIMEDOUT") ||
        error.message?.includes("Connect Timeout") ||
        error.message?.includes("fetch failed") ||
        error.message?.includes("terminated") ||
        error.code === "ECONNRESET" ||
        error.code === "ETIMEDOUT" ||
        error.code === "UND_ERR_CONNECT_TIMEOUT";

      if (isRetryableError && attempt < maxRetries) {
        console.warn(`[retry-helper] Network error (${error.message || error.code}). Retrying...`);
        continue;
      }

      throw error;
    }
  }

  throw lastError;
}
