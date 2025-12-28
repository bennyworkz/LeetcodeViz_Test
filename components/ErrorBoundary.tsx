import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary class component to catch rendering errors in the visualization modules.
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-slate-50 rounded-xl border border-red-100">
          <div className="bg-red-100 p-4 rounded-full mb-4">
            <AlertTriangle className="text-red-600" size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Visualization Error</h2>
          <p className="text-slate-600 mb-6 max-w-md">
            An unexpected error occurred while rendering the visualization step.
          </p>
          <div className="p-4 bg-white rounded border border-slate-200 font-mono text-xs text-red-500 mb-6 text-left w-full max-w-lg overflow-auto">
             {this.state.error?.message || "Unknown error"}
          </div>
          <button
            onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
            }}
            className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <RefreshCcw size={16} /> Reset Visualizer
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
