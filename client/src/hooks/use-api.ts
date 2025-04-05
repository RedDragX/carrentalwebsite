import { apiRequest } from '@/lib/queryClient';
import { useState } from 'react';

interface ApiHookOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export function useApiRequest<T>() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = async (
    method: string,
    url: string,
    body?: any,
    options?: ApiHookOptions<T>
  ): Promise<T | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiRequest(method, url, body);
      const jsonData = await response.json() as T;
      
      setData(jsonData);
      options?.onSuccess?.(jsonData);
      return jsonData;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      options?.onError?.(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    execute,
    isLoading,
    error,
    data,
  };
}