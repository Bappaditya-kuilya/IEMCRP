import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Badge } from "@/components/ui/Badge";
import { ClipboardCheck, CheckCircle, XCircle, Clock } from "lucide-react";

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

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          <span className="text-sm text-surface-500">Loading attendance...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-surface-900">Attendance</h1>
        <p className="text-sm text-surface-500 mt-1">{Math.round(data.percentage)}% overall attendance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card-modern p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600">{data.totalPresent}</p>
              <p className="text-xs text-surface-500 font-medium">Present</p>
            </div>
          </div>
        </div>
        <div className="card-modern p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center">
              <XCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{data.totalAbsent}</p>
              <p className="text-xs text-surface-500 font-medium">Absent</p>
            </div>
          </div>
        </div>
        <div className="card-modern p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">{data.totalLate}</p>
              <p className="text-xs text-surface-500 font-medium">Late</p>
            </div>
          </div>
        </div>
        <div className="card-modern p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <ClipboardCheck className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-surface-900">{Math.round(data.percentage)}%</p>
              <p className="text-xs text-surface-500 font-medium">Overall</p>
            </div>
          </div>
        </div>
      </div>

      {/* Records */}
      <div className="card-modern overflow-hidden">
        <div className="p-6 border-b border-surface-100">
          <h2 className="text-sm font-semibold text-surface-900">Attendance Records</h2>
        </div>
        {data.records.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-surface-100 flex items-center justify-center mx-auto mb-3">
              <ClipboardCheck className="h-6 w-6 text-surface-400" />
            </div>
            <p className="text-sm text-surface-500">No attendance records.</p>
          </div>
        ) : (
          <div className="divide-y divide-surface-100">
            {data.records.map((rec) => (
              <div key={rec.id} className="px-6 py-4 flex justify-between items-center hover:bg-surface-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    rec.status === "present" ? "bg-emerald-100" :
                    rec.status === "absent" ? "bg-red-100" : "bg-amber-100"
                  }`}>
                    {rec.status === "present" ? (
                      <CheckCircle className="h-5 w-5 text-emerald-600" />
                    ) : rec.status === "absent" ? (
                      <XCircle className="h-5 w-5 text-red-600" />
                    ) : (
                      <Clock className="h-5 w-5 text-amber-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-surface-900">{rec.date}</p>
                    {rec.subject && (
                      <p className="text-xs text-surface-500">{rec.subject}</p>
                    )}
                  </div>
                </div>
                <Badge variant={rec.status}>{rec.status}</Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
