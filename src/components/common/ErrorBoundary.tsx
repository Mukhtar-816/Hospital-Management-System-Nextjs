"use client";
import React from "react";
import { devError, devLog } from "@/lib/logger";
import { Button } from "../ui/Button";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error: any, errorInfo: any) {
    if (process.env.NODE_ENV === "development") {
      devError("ErrorBoundary caught an error:", error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="p-12 text-center flex flex-col items-center justify-center space-y-4 bg-error/5 rounded-3xl border border-error/20 m-6">
          <div className="text-4xl">⚠️</div>
          <h2 className="text-xl font-bold text-text">Something went wrong</h2>
          <p className="text-textMuted max-w-md mx-auto">
            The application encountered an unexpected error. Please try
            refreshing the page.
          </p>
          <Button onClick={() => window.location.reload()}>Refresh Page</Button>
        </div>
      );
    }

    return this.props.children;
  }
}
