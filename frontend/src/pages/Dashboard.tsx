import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { GraduationCap, ClipboardCheck, Bell } from "lucide-react";

interface DashboardData {
  firstName?: string;
  rollNumber?: string;
  latestResult?: {
    examName: string;
    cgpa: number;
    percentage: number;
  };
  attendance?: {
    present: number;
    total: number;
    percentage: number;
  };
  notices?: Array<{ id: string; title: string; createdAt: string }>;
}

function AttendanceRing({ percentage }: { percentage: number }) {
  const r = 36;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (percentage / 100) * circumference;
  const color = percentage >= 75 ? "text-green-500" : percentage >= 50 ? "text-amber-500" : "text-red-500";

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="88" height="88" className="-rotate-90">
        <circle cx="44" cy="44" r={r} fill="none" stroke="#e2e8f0" strokeWidth="8" />
        <circle
          cx="44"
          cy="44"
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={color}
        />
      </svg>
      <span className="absolute text-sm font-semibold text-slate-900">{Math.round(percentage)}%</span>
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch<DashboardData>("/student/dashboard")
      .then(setData)
      .catch((err: Error) => setError(err.message));
  }, []);

  if (error) return <div className="text-sm text-red-600" role="alert" aria-live="polite">{error}</div>;
  if (!data) return <div className="text-sm text-slate-600" aria-live="polite">Loading...</div>;

  const firstName = data.firstName ?? "Student";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Hi, {firstName}</h1>
        {data.rollNumber && (
          <p className="text-sm text-slate-600">Roll No: {data.rollNumber}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.latestResult && (
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <GraduationCap className="h-5 w-5 text-slate-400" />
              <h2 className="text-sm font-medium text-slate-700">Latest Result</h2>
            </div>
            <p className="text-lg font-semibold text-slate-900">{data.latestResult.examName}</p>
            <div className="mt-2 flex gap-4">
              <div>
                <p className="text-2xl font-bold text-slate-900">{data.latestResult.cgpa}</p>
                <p className="text-xs text-slate-600">CGPA</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{data.latestResult.percentage}%</p>
                <p className="text-xs text-slate-600">Percentage</p>
              </div>
            </div>
          </Card>
        )}

        {data.attendance && (
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <ClipboardCheck className="h-5 w-5 text-slate-400" />
              <h2 className="text-sm font-medium text-slate-700">Attendance</h2>
            </div>
            <div className="flex items-center gap-6">
              <AttendanceRing percentage={data.attendance.percentage} />
              <div>
                <p className="text-sm text-slate-600">
                  <Badge variant="present">{data.attendance.present}</Badge> present
                </p>
                <p className="text-sm text-slate-600 mt-1">
                  out of {data.attendance.total} classes
                </p>
              </div>
            </div>
          </Card>
        )}

        {data.notices && data.notices.length > 0 && (
          <Card className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="h-5 w-5 text-slate-400" />
              <h2 className="text-sm font-medium text-slate-700">Recent Notices</h2>
            </div>
            <ul className="divide-y divide-slate-100">
              {data.notices.slice(0, 5).map((notice) => (
                <li key={notice.id} className="py-3 flex justify-between items-center">
                  <span className="text-sm text-slate-900">{notice.title}</span>
                  <span className="text-xs text-slate-600 whitespace-nowrap ml-4">
                    {new Date(notice.createdAt).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>
    </div>
  );
}
