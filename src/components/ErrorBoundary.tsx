import {Component, ErrorInfo, ReactNode} from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
    message: '',
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error.message || 'An unexpected error occurred.',
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Quadra 12 ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F5F2EB] dark:bg-[#161412] text-[#1E1B18] dark:text-[#F5F2EB] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-[#FAF8F3] dark:bg-[#1E1B18] border border-[#DDD6C7] dark:border-[#332E28] rounded-xl p-6 space-y-4">
            <h1 className="text-lg font-semibold">
              Something went wrong in Quadra 12
            </h1>
            <p className="text-sm text-[#575048] dark:text-[#CBC3B6]">
              Your study tracker progress is safely preserved in your browser.
              Reload the page to resume cleanly.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-4 py-2 text-xs font-medium rounded-lg bg-[#1E1B18] dark:bg-[#F5F2EB] text-[#F5F2EB] dark:text-[#1E1B18]"
            >
              Reload Quadra 12
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
