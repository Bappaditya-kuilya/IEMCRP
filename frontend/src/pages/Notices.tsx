import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Bell, Megaphone } from "lucide-react";

interface Notice {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  publishedBy?: string;
}

interface DashboardResponse {
  notices?: Notice[];
}

export default function Notices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch<DashboardResponse>("/student/dashboard")
      .then((data: DashboardResponse) => setNotices(data.notices ?? []))
      .catch((err: Error) => setError(err.message));
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
            <span className="text-red-600 text-lg">!</span>
          </div>
          <p className="text-sm text-red-600" role="alert" aria-live="polite">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-surface-900">Notices</h1>
        <p className="text-sm text-surface-500 mt-1">{notices.length} notices found</p>
      </div>

      {/* Empty state */}
      {notices.length === 0 && (
        <div className="card-modern p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-surface-100 flex items-center justify-center mx-auto mb-3">
            <Bell className="h-6 w-6 text-surface-400" />
          </div>
          <p className="text-sm text-surface-500">No notices found.</p>
        </div>
      )}

      {/* Notices list */}
      <div className="space-y-3">
        {notices.map((notice, i) => (
          <div
            key={notice.id}
            className="card-modern p-5 animate-slide-up"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                <Megaphone className="h-5 w-5 text-amber-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-surface-900">{notice.title}</h3>
                <p className="text-sm text-surface-600 mt-1 line-clamp-2">{notice.content}</p>
                <div className="flex items-center gap-3 mt-3 text-xs text-surface-400 font-medium">
                  <span>{new Date(notice.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}</span>
                  {notice.publishedBy && (
                    <>
                      <span className="text-surface-300">·</span>
                      <span>by {notice.publishedBy}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
