import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

/**
 * Fetches a list of items on mount, handles AbortController cleanup,
 * and manages the loading state — eliminating the repeated boilerplate
 * across all list pages.
 */
export function useListData<T>(
  fetcher: (signal: AbortSignal) => Promise<T[]>,
): { data: T[]; isLoading: boolean; setData: Dispatch<SetStateAction<T[]>> } {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    fetcher(controller.signal).then((res) => {
      if (Array.isArray(res)) setData(res);
      setIsLoading(false);
    });
    return () => controller.abort();
    // fetcher is intentionally excluded — callers should pass a stable reference
    // (inline arrow is fine because useEffect runs once on mount)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, isLoading, setData };
}
