export default function ErrorPage({ message = "Something went wrong" }: { message?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-600">Error</h1>
        <p className="mt-4 text-lg text-slate-600">{message}</p>
        <a href="/" className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          Go Home
        </a>
      </div>
    </div>
  );
}
