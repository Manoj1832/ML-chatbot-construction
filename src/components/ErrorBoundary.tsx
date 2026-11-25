import React from "react";
import { trackError } from "@/lib/telemetry";

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    trackError(error, info.componentStack ?? undefined);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FFFFFF] text-[#111111] flex items-center justify-center px-6">
          <div className="max-w-md w-full border border-[#EAEAEA] p-8 bg-[#F5F5F5]">
            <p className="text-xs uppercase tracking-[0.16em] text-[#777777] mb-2">
              System Notice
            </p>
            <h1 className="text-2xl font-display font-semibold mb-3">
              Something went wrong
            </h1>
            <p className="text-sm text-[#444444] mb-6 leading-relaxed">
              An unexpected display error occurred. Please reload the page to continue.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center px-5 py-2.5 bg-[#111111] text-[#FFFFFF] text-sm font-medium hover:bg-[#222222] transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
