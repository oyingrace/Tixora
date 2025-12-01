'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Something went wrong!</AlertTitle>
          <AlertDescription className="space-y-4">
            <p>We're sorry, but something went wrong while loading this page.</p>
            <p className="text-sm text-muted-foreground">
              {error.message || 'An unexpected error occurred'}
            </p>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={() => reset()}>
                Try again
              </Button>
              <Button variant="ghost" asChild>
                <a href="/">Go to home</a>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
