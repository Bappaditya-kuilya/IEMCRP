import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Bell } from "lucide-react";

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

  if (error) return <div className="text-sm text-red-600" role="alert" aria-live="polite">{error}</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900">Notices</h1>

      {notices.length === 0 ? (
        <p className="text-sm text-slate-600">No notices found.</p>
      ) : (
        <div className="space-y-3">
          {notices.map((notice) => (
            <Card key={notice.id}>
              <div className="flex items-start gap-3">
                <Bell className="h-5 w-5 text-slate-400 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <h3 className="text-sm font-medium text-slate-900">{notice.title}</h3>
                  <p className="text-sm text-slate-600 mt-1 line-clamp-2">{notice.content}</p>
                  <div className="flex gap-3 mt-2 text-xs text-slate-600">
                    <span>{new Date(notice.createdAt).toLocaleDateString()}</span>
                    {notice.publishedBy && <span>by {notice.publishedBy}</span>}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
