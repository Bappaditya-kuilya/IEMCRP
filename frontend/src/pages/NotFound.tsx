import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-mesh opacity-30" />
      <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />

      <div className="relative z-10 text-center animate-fade-in">
        <div className="text-8xl font-bold text-gradient mb-4">404</div>
        <p className="text-lg text-surface-600 mb-8">Page not found</p>
        <a href="/" className="btn-primary inline-flex">
          <Home className="h-4 w-4" />
          Go Home
        </a>
      </div>
    </div>
  );
}
