/**
 * Internal HTTP layer built on the native `fetch` API (Node >= 20).
 * Replaces the previous axios transport while preserving the request-config
 * shape and error surface the SDK exposed.
 */

/**
 * Subset of the axios request config that the SDK actually uses. Kept as a
 * drop-in replacement for the previous `AxiosRequestConfig` dependency.
 */
export interface RequestConfig {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  url?: string;
  baseURL?: string;
  headers?: Record<string, string>;
  params?: Record<string, any>;
  data?: any;
}

/**
 * Error thrown for non-2xx responses. Mirrors the parts of `AxiosError`
 * consumers commonly rely on (`error.response.status`, `error.response.data`).
 */
export class HttpError extends Error {
  readonly response: {
    status: number;
    statusText: string;
    data: any;
    headers: Record<string, string>;
  };

  constructor(
    message: string,
    response: {
      status: number;
      statusText: string;
      data: any;
      headers: Record<string, string>;
    }
  ) {
    super(message);
    this.name = "HttpError";
    this.response = response;
  }
}

/**
 * Build an absolute URL from a base, path and query params. Params that are
 * `undefined` or `null` are omitted (matching axios behaviour).
 */
export function buildUrl(
  baseURL: string,
  path: string = "",
  params?: Record<string, any>
): string {
  const url = new URL(`${baseURL}${path}`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null) continue;
      url.searchParams.append(key, String(value));
    }
  }
  return url.toString();
}

/**
 * Parse a fetch Response body as JSON, tolerating empty bodies. Falls back to
 * raw text when the payload is not valid JSON.
 */
async function parseBody(response: Response): Promise<any> {
  const text = await response.text();
  if (!text) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

/**
 * Perform a request and return the parsed response body (the equivalent of
 * axios's `response.data`). Throws {@link HttpError} on non-2xx responses.
 */
export async function request(config: RequestConfig): Promise<any> {
  const url = buildUrl(config.baseURL ?? "", config.url ?? "", config.params);

  const init: RequestInit = {
    method: config.method ?? "GET",
    headers: config.headers,
  };
  if (config.data !== undefined) {
    init.body =
      typeof config.data === "string"
        ? config.data
        : JSON.stringify(config.data);
  }

  const response = await fetch(url, init);
  const data = await parseBody(response);

  if (!response.ok) {
    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });
    throw new HttpError(
      `Request failed with status code ${response.status}`,
      {
        status: response.status,
        statusText: response.statusText,
        data,
        headers,
      }
    );
  }

  return data;
}
