// provider.ts

import axios from "axios";
import { handleResponse, handleError } from "./response";
import { BASE_URL } from "../api";

const getToken = () => localStorage.getItem("CRM-token");

// ── Cache ──────────────────────────────────────────────────────────────────────

type CacheEntry = { data: unknown; expiresAt: number };

/** In-memory TTL cache keyed by request fingerprint. */
const cache = new Map<string, CacheEntry>();

/** In-flight promises — prevents duplicate concurrent requests for the same key. */
const inFlight = new Map<string, Promise<unknown>>();

/**
 * TTL (ms) per resource name.
 * Only resources listed here (or their sub-paths, where noted) are cached.
 */
const CACHE_TTL: Record<string, number> = {
  "dashboard/stats":  5 * 60_000, // 5 min  — aggregated stats
  users:              3 * 60_000, // 3 min  — user list
  contacts:           2 * 60_000, // 2 min  — contact list
  tickets:            2 * 60_000, // 2 min  — ticket list
  projects:           5 * 60_000, // 5 min  — project list + board data
  "email-templates":  5 * 60_000, // 5 min  — template list
  "email-groups":     5 * 60_000, // 5 min  — email group list
  deals:              2 * 60_000, // 2 min  — pipeline deals
};

/** Returns the TTL for a resource, or undefined if it should not be cached. */
function ttlFor(resource: string): number | undefined {
  if (CACHE_TTL[resource] !== undefined) return CACHE_TTL[resource];
  // Cache project sub-paths (e.g. "projects/abc/board") under the projects TTL.
  // Intentionally excludes contacts sub-paths (notes) — those should always be fresh.
  if (resource.startsWith("projects/")) return CACHE_TTL["projects"];
  return undefined;
}

function readCache(key: string): unknown | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) { cache.delete(key); return null; }
  return entry.data;
}

function writeCache(resource: string, key: string, data: unknown): void {
  const ttl = ttlFor(resource);
  if (ttl) cache.set(key, { data, expiresAt: Date.now() + ttl });
}

/**
 * Clears all cached entries for a resource (called automatically after mutations).
 * Also exported so components can force-invalidate (e.g. after CSV import).
 */
export function invalidateCache(resource: string): void {
  const base = resource.split("/")[0];
  for (const key of cache.keys()) {
    if (key.startsWith(base + ":")) cache.delete(key);
  }
  for (const key of inFlight.keys()) {
    if (key.startsWith(base + ":")) inFlight.delete(key);
  }
}

/** Wraps a fetch promise with in-flight deduplication and cache write-back. */
async function cachedGet(
  resource: string,
  cacheKey: string,
  fetcher: () => Promise<unknown>,
): Promise<unknown> {
  const cached = readCache(cacheKey);
  if (cached !== null) return cached;

  // Deduplicate concurrent requests for the same key
  const existing = inFlight.get(cacheKey);
  if (existing) return existing;

  const promise = fetcher().then((data) => {
    writeCache(resource, cacheKey, data);
    inFlight.delete(cacheKey);
    return data;
  }).catch((err) => {
    inFlight.delete(cacheKey);
    throw err;
  });

  inFlight.set(cacheKey, promise);
  return promise;
}

// ── GET methods ────────────────────────────────────────────────────────────────

const getAll = async (resource: string, signal: AbortSignal, isAuthorized = false) => {
  const headers = isAuthorized ? { "auth-token": getToken() } : {};
  const cKey = `${resource}:all`;

  if (isAuthorized && ttlFor(resource) !== undefined) {
    try {
      return await cachedGet(resource, cKey, async () => {
        const response = await axios.get(`${BASE_URL}/${resource}`, { signal, headers });
        return handleResponse(response);
      });
    } catch (error) {
      return handleError(error);
    }
  }

  try {
    const response = await axios.get(`${BASE_URL}/${resource}`, { signal, headers });
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

const getSingle = async (
  resource: string,
  id: string,
  signal: AbortSignal,
  additionalParam = "",
  isAuthorized = false,
) => {
  const headers = isAuthorized ? { "auth-token": getToken() } : {};
  const cKey = `${resource}:${additionalParam}:${id}`;

  const fetchIt = async () => {
    let response;
    if (additionalParam === "") {
      response = await axios.get(`${BASE_URL}/${resource}/${id}`, { signal, headers });
    } else {
      response = await axios.get(`${BASE_URL}/${resource}/${additionalParam}/${id}`, { signal, headers });
    }
    return handleResponse(response);
  };

  if (isAuthorized && ttlFor(resource) !== undefined) {
    try {
      return await cachedGet(resource, cKey, fetchIt);
    } catch (error) {
      return handleError(error);
    }
  }

  try {
    return await fetchIt();
  } catch (error) {
    return handleError(error);
  }
};

const getByParams = async (
  resource: string,
  signal: AbortSignal,
  params: Record<string, unknown>,
  additionalParam = "",
  isAuthorized = false,
) => {
  const headers = isAuthorized ? { "auth-token": getToken() } : {};
  // Stable key from sorted params
  const paramStr = Object.keys(params).sort().map((k) => `${k}=${params[k]}`).join("&");
  const cKey = `${resource}:${additionalParam}:?${paramStr}`;

  const fetchIt = async () => {
    let response;
    if (additionalParam === "") {
      response = await axios.get(`${BASE_URL}/${resource}`, { signal, headers, params });
    } else {
      response = await axios.get(`${BASE_URL}/${resource}/${additionalParam}`, { signal, headers, params });
    }
    return handleResponse(response);
  };

  if (isAuthorized && ttlFor(resource) !== undefined) {
    try {
      return await cachedGet(resource, cKey, fetchIt);
    } catch (error) {
      return handleError(error);
    }
  }

  try {
    return await fetchIt();
  } catch (error) {
    return handleError(error);
  }
};

// ── Mutation methods (all invalidate the resource cache) ───────────────────────

const post = async (
  resource: string,
  model: object,
  additionalParam = "",
  isAuthorized = false,
) => {
  const headers = isAuthorized ? { "auth-token": getToken() } : {};

  try {
    let response;
    if (additionalParam === "") {
      response = await axios.post(`${BASE_URL}/${resource}`, model, { headers });
    } else {
      response = await axios.post(`${BASE_URL}/${resource}/${additionalParam}`, model, { headers });
    }
    invalidateCache(resource);
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

const postFormData = async (
  resource: string,
  model: FormData,
  additionalParam = "",
  isAuthorized = false,
) => {
  const headers = isAuthorized
    ? { "Content-Type": "multipart/form-data", "auth-token": `${getToken()}` }
    : { "Content-Type": "multipart/form-data" };

  try {
    let response;
    if (additionalParam === "") {
      response = await axios.post(`${BASE_URL}/${resource}`, model, { headers });
    } else {
      response = await axios.post(`${BASE_URL}/${resource}/${additionalParam}`, model, { headers });
    }
    invalidateCache(resource);
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

const put = async (resource: string, model: object, additionalParams: string, isAuthorized = false) => {
  const headers = isAuthorized ? { "auth-token": getToken() } : {};

  try {
    let response;
    if (additionalParams === "") {
      response = await axios.put(`${BASE_URL}/${resource}`, model, { headers });
    } else {
      response = await axios.put(`${BASE_URL}/${resource}/${additionalParams}`, model, { headers });
    }
    invalidateCache(resource);
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

const putById = async (resource: string, id: string, model: object, signal: AbortSignal, isAuthorized = false) => {
  const headers = isAuthorized ? { "auth-token": getToken() } : {};
  try {
    const response = await axios.put(`${BASE_URL}/${resource}/${id}`, model, { signal, headers });
    invalidateCache(resource);
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

const putFormData = async (
  resource: string,
  model: FormData,
  additionalParam = "",
  isAuthorized = false,
) => {
  const headers = isAuthorized
    ? { "Content-Type": "multipart/form-data", "auth-token": `${getToken()}` }
    : { "Content-Type": "multipart/form-data" };

  try {
    let response;
    if (additionalParam === "") {
      response = await axios.put(`${BASE_URL}/${resource}`, model, { headers });
    } else {
      response = await axios.put(`${BASE_URL}/${resource}/${additionalParam}`, model, { headers });
    }
    invalidateCache(resource);
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

const patch = async (resource: string, model: object, signal: AbortSignal, isAuthorized = false) => {
  const headers = isAuthorized ? { "auth-token": getToken() } : { "auth-token": getToken() };
  try {
    const response = await axios.patch(`${BASE_URL}/${resource}`, model, { signal, headers });
    invalidateCache(resource);
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

const patchByParams = async (
  resource: string,
  additionalParams: string,
  queryParams: string,
  isAuthorized = false,
) => {
  const headers = isAuthorized ? { "auth-token": getToken() } : {};

  try {
    const request = axios.create({
      method: "PATCH",
      baseURL: `${BASE_URL}/${resource}/${additionalParams}?${queryParams}`,
      headers: headers,
    });
    const response = await request.patch("");
    invalidateCache(resource);
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

const remove = async (resource: string, id: string, additionalParams: string, isAuthorized = false) => {
  const headers = isAuthorized ? { "auth-token": getToken() } : {};

  try {
    let response;
    if (additionalParams === "") {
      response = await axios.delete(`${BASE_URL}/${resource}/${id}`, { headers });
    } else {
      response = await axios.delete(`${BASE_URL}/${resource}/${additionalParams}/${id}`, { headers });
    }
    invalidateCache(resource);
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

export const apiProvider = {
  getAll,
  getSingle,
  getByParams,
  post,
  postFormData,
  put,
  putById,
  putFormData,
  patch,
  patchByParams,
  remove,
};
