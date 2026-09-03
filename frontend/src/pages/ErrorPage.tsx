import { Home, AlertTriangle } from "lucide-react";

export default function ErrorPage({ message = "Something went wrong" }: { message?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 relative overflow-hidden">
      <div className="absolute inset-0 gradient-mesh opacity-30" />
      <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-red-500/10 rounded-full blur-3xl animate-float" />

      <div className="relative z-10 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="h-8 w-8 text-red-600" />
        </div>
        <h1 className="text-3xl font-bold text-surface-900 mb-2">Error</h1>
        <p className="text-surface-600 mb-8 max-w-md">{message}</p>
        <a href="/" className="btn-primary inline-flex">
          <Home className="h-4 w-4" />
          Go Home
        </a>
      </div>
    </div>
  );
}
