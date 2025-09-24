'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mb-4 mx-auto">
          <div className="text-red-400 text-2xl">⚠️</div>
        </div>
        
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Oops! Something went wrong
        </h2>
        
        <p className="text-text-secondary mb-6">
          Your plants are safe, but we encountered an error. Please try again.
        </p>
        
        <div className="space-y-3">
          <button
            onClick={reset}
            className="btn-primary w-full"
          >
            Try Again
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className="btn-secondary w-full"
          >
            Go Home
          </button>
        </div>
        
        {error.digest && (
          <p className="text-text-secondary text-xs mt-4">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
