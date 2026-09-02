import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface AttendanceRecord {
  id: string;
  date: string;
  subject?: string;
  status: "present" | "absent" | "late";
}

interface AttendanceSummary {
  totalPresent: number;
  totalAbsent: number;
  totalLate: number;
  percentage: number;
  records: AttendanceRecord[];
}

export default function Attendance() {
  const [data, setData] = useState<AttendanceSummary | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch<AttendanceSummary>("/student/attendance")
      .then(setData)
      .catch((err: Error) => setError(err.message));
  }, []);

  if (error) return <div className="text-sm text-red-600" role="alert" aria-live="polite">{error}</div>;
  if (!data) return <div className="text-sm text-slate-600" aria-live="polite">Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Attendance</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <p className="text-xs text-slate-600 mb-1">Present</p>
          <p className="text-2xl font-bold text-green-600">{data.totalPresent}</p>
        </Card>
        <Card>
          <p className="text-xs text-slate-600 mb-1">Absent</p>
          <p className="text-2xl font-bold text-red-600">{data.totalAbsent}</p>
        </Card>
        <Card>
          <p className="text-xs text-slate-600 mb-1">Late</p>
          <p className="text-2xl font-bold text-amber-600">{data.totalLate}</p>
        </Card>
        <Card>
          <p className="text-xs text-slate-600 mb-1">Percentage</p>
          <p className="text-2xl font-bold text-slate-900">{Math.round(data.percentage)}%</p>
        </Card>
      </div>

      <Card>
        <h2 className="text-sm font-medium text-slate-700 mb-4">Records</h2>
        {data.records.length === 0 ? (
          <p className="text-sm text-slate-600">No attendance records.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {data.records.map((rec) => (
              <li key={rec.id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="text-sm text-slate-900">{rec.date}</p>
                  {rec.subject && (
                    <p className="text-xs text-slate-600">{rec.subject}</p>
                  )}
                </div>
                <Badge variant={rec.status}>{rec.status}</Badge>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
