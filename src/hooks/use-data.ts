import useSWR from 'swr';

// This is a generic fetcher function that can be used by SWR.
// It assumes the API will return JSON with a `success` flag and a `data` property.
const fetcher = async (url: string) => {
  const res = await fetch(url);

  if (!res.ok) {
    const error: any = new Error('An error occurred while fetching the data.');
    // Attach extra info to the error object.
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }

  const json = await res.json();
  if (!json.success) {
    const error: any = new Error(json.error || 'API returned an error.');
    error.info = json;
    throw error;
  }

  return json.data;
};

/**
 * A generic data fetching hook using SWR.
 * @param endpoint The API endpoint to fetch data from (e.g., '/api/parents/children'). If null, the request will not be made.
 * @returns {data, isLoading, isError, mutate}
 */
export function useData<T>(endpoint: string | null) {
  // SWR will not fetch if the key (endpoint) is null.
  // This is useful for conditional fetching.
  const { data, error, isLoading, mutate } = useSWR<T>(endpoint, fetcher, {
    shouldRetryOnError: false, // Optional: configure SWR behavior
  });

  return {
    data,
    isLoading,
    isError: error,
    mutate,
  };
}
