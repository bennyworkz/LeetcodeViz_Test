
import React from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

interface Props {
  children?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary class component to catch rendering errors in the visualization modules.
 */
// Explicitly use React.Component to ensure TypeScript correctly resolves inherited properties like 'props' and 'setState'
export class ErrorBoundary extends React.Component<Props, State> {
  // Use a property initializer for state to clarify the type on the class instance.
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render(): React.ReactNode {
    // Access state from this.state inherited from React.Component.
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
                // Correctly access setState from the React.Component base class.
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

    // Access children from this.props which is inherited from React.Component.
    return this.props.children;
  }
}
