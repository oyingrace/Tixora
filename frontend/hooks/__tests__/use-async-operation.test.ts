import { renderHook, act } from '@testing-library/react';
import { useAsyncOperation } from '../use-async-operation';
import { toast } from 'react-toastify';

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    info: jest.fn(),
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('useAsyncOperation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle successful async operation', async () => {
    const mockSuccess = 'Success!';
    const mockAsyncFn = jest.fn().mockResolvedValue(mockSuccess);
    
    const { result } = renderHook(() => 
      useAsyncOperation(mockAsyncFn, {
        loadingMessage: 'Loading...',
        successMessage: 'Success!',
        showToast: true,
      })
    );

    expect(result.current.isLoading).toBe(false);
    
    // Execute the async function
    let promise;
    await act(async () => {
      promise = result.current.execute('test');
      // Check loading state immediately after execution
      expect(result.current.isLoading).toBe(true);
      await promise;
    });

    // Verify the async function was called with correct arguments
    expect(mockAsyncFn).toHaveBeenCalledWith('test');
    
    // Check final state
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.data).toBe(mockSuccess);
    
    // Verify toast messages
    expect(toast.info).toHaveBeenCalledWith('Loading...');
    expect(toast.success).toHaveBeenCalledWith('Success!');
  });

  it('should handle failed async operation', async () => {
    const mockError = new Error('Something went wrong');
    const mockAsyncFn = jest.fn().mockRejectedValue(mockError);
    
    const { result } = renderHook(() => 
      useAsyncOperation(mockAsyncFn, {
        loadingMessage: 'Loading...',
        errorMessage: 'Failed!',
        showToast: true,
      })
    );

    // Execute the async function
    await act(async () => {
      try {
        await result.current.execute();
      } catch (error) {
        // Expected error
      }
    });

    // Verify the async function was called
    expect(mockAsyncFn).toHaveBeenCalled();
    
    // Check final state
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(mockError);
    expect(result.current.data).toBeNull();
    
    // Verify toast messages
    expect(toast.info).toHaveBeenCalledWith('Loading...');
    expect(toast.error).toHaveBeenCalledWith('Failed!');
  });

  it('should call onSuccess callback on success', async () => {
    const mockSuccess = 'Success!';
    const mockAsyncFn = jest.fn().mockResolvedValue(mockSuccess);
    const onSuccess = jest.fn();
    
    const { result } = renderHook(() => 
      useAsyncOperation(mockAsyncFn, {
        onSuccess,
      })
    );

    await act(async () => {
      await result.current.execute();
    });

    expect(onSuccess).toHaveBeenCalledWith(mockSuccess);
  });

  it('should call onError callback on failure', async () => {
    const mockError = new Error('Failed');
    const mockAsyncFn = jest.fn().mockRejectedValue(mockError);
    const onError = jest.fn();
    
    const { result } = renderHook(() => 
      useAsyncOperation(mockAsyncFn, {
        onError,
      })
    );

    await act(async () => {
      try {
        await result.current.execute();
      } catch (error) {
        // Expected error
      }
    });

    expect(onError).toHaveBeenCalledWith(mockError);
  });
});
