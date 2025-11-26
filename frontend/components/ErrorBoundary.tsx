'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Button } from './ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    
    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      // Use custom fallback if provided, otherwise use default
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="container mx-auto p-4 max-w-2xl">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription className="mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </AlertDescription>
            <Button variant="outline" onClick={this.handleReset}>
              Try again
            </Button>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher Order Component for pages
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  FallbackComponent?: React.ComponentType<{ error: Error | null; resetError: () => void }>,
  onError?: (error: Error, errorInfo: ErrorInfo) => void
) => {
  return function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundary
        fallback={
          FallbackComponent ? (
            <FallbackComponent
              error={null}
              resetError={() => window.location.reload()}
            />
          ) : null
        }
        onError={onError}
      >
        <Component {...props} />
      </ErrorBoundary>
    );
  };
};
