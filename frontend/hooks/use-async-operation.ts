import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';

type AsyncFunction<T extends any[], R> = (...args: T) => Promise<R>;

interface UseAsyncOperationOptions {
  loadingMessage?: string;
  successMessage?: string;
  errorMessage?: string;
  showToast?: boolean;
  onSuccess?: (result: any) => void;
  onError?: (error: Error) => void;
  onFinally?: () => void;
}

export function useAsyncOperation<T extends any[], R>(
  asyncFunction: AsyncFunction<T, R>,
  options: UseAsyncOperationOptions = {}
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<R | null>(null);

  const execute = useCallback(async (...args: T) => {
    setIsLoading(true);
    setError(null);
    
    if (options.showToast && options.loadingMessage) {
      toast.info(options.loadingMessage);
    }

    try {
      const result = await asyncFunction(...args);
      setData(result);
      
      if (options.showToast && options.successMessage) {
        toast.success(options.successMessage);
      }
      
      if (options.onSuccess) {
        options.onSuccess(result);
      }
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      
      const errorMessage = options.errorMessage || error.message || 'An error occurred';
      if (options.showToast) {
        toast.error(errorMessage);
      }
      
      if (options.onError) {
        options.onError(error);
      }
      
      throw error;
    } finally {
      setIsLoading(false);
      
      if (options.onFinally) {
        options.onFinally();
      }
    }
  }, [asyncFunction, options]);

  return {
    execute,
    isLoading,
    error,
    data,
  };
}
