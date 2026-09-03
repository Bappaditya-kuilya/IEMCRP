import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { GraduationCap, ClipboardCheck, Bell, TrendingUp, BookOpen } from "lucide-react";

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

function StatCard({ icon: Icon, label, value, subvalue, gradient }: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  subvalue?: string;
  gradient: string;
}) {
  return (
    <div className="card-modern p-6 group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-surface-500 mb-1">{label}</p>
          <p className="text-2xl font-bold text-surface-900">{value}</p>
          {subvalue && <p className="text-sm text-surface-400 mt-1">{subvalue}</p>}
        </div>
        <div className={`w-12 h-12 rounded-2xl ${gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );
}

function AttendanceRing({ percentage }: { percentage: number }) {
  const r = 40;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (percentage / 100) * circumference;
  const color = percentage >= 75 ? "#10b981" : percentage >= 50 ? "#f59e0b" : "#ef4444";
  const bgColor = percentage >= 75 ? "#d1fae5" : percentage >= 50 ? "#fef3c7" : "#fee2e2";

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="100" height="100" className="-rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke={bgColor} strokeWidth="10" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-xl font-bold text-surface-900">{Math.round(percentage)}%</span>
        <span className="text-[10px] text-surface-400 font-medium">ATTENDANCE</span>
      </div>
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
          <span className="text-sm text-surface-500">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  const firstName = data.firstName ?? "Student";

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl gradient-primary p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
        <div className="relative">
          <h1 className="text-2xl font-bold">Welcome back, {firstName}</h1>
          {data.rollNumber && (
            <p className="mt-1 text-white/70 text-sm font-medium">Roll No: {data.rollNumber}</p>
          )}
          <p className="mt-2 text-white/60 text-sm">Here's your academic overview</p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.latestResult && (
          <StatCard
            icon={GraduationCap}
            label="CGPA"
            value={data.latestResult.cgpa}
            subvalue={`${data.latestResult.percentage}% · ${data.latestResult.examName}`}
            gradient="gradient-primary"
          />
        )}

        {data.attendance && (
          <StatCard
            icon={ClipboardCheck}
            label="Attendance"
            value={`${data.attendance.present}/${data.attendance.total}`}
            subvalue={`${Math.round(data.attendance.percentage)}% present`}
            gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
          />
        )}

        <StatCard
          icon={BookOpen}
          label="Active Courses"
          value="5"
          subvalue="Current semester"
          gradient="bg-gradient-to-br from-amber-500 to-orange-600"
        />
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance detail */}
        {data.attendance && (
          <div className="card-modern p-6 lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <ClipboardCheck className="h-5 w-5 text-primary-500" />
              <h2 className="text-sm font-semibold text-surface-900">Attendance Overview</h2>
            </div>
            <div className="flex flex-col items-center">
              <AttendanceRing percentage={data.attendance.percentage} />
              <div className="mt-6 grid grid-cols-2 gap-4 w-full">
                <div className="text-center p-3 rounded-xl bg-emerald-50">
                  <p className="text-lg font-bold text-emerald-700">{data.attendance.present}</p>
                  <p className="text-xs text-emerald-600 font-medium">Present</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-surface-100">
                  <p className="text-lg font-bold text-surface-700">{data.attendance.total - data.attendance.present}</p>
                  <p className="text-xs text-surface-500 font-medium">Absent</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent notices */}
        {data.notices && data.notices.length > 0 && (
          <div className="card-modern p-6 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="h-5 w-5 text-amber-500" />
              <h2 className="text-sm font-semibold text-surface-900">Recent Notices</h2>
            </div>
            <div className="space-y-2">
              {data.notices.slice(0, 5).map((notice, i) => (
                <div
                  key={notice.id}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-50 transition-colors"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary-400" />
                    <span className="text-sm text-surface-800 font-medium">{notice.title}</span>
                  </div>
                  <span className="text-xs text-surface-400 font-medium whitespace-nowrap ml-4">
                    {new Date(notice.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="card-modern p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-primary-500" />
          <h2 className="text-sm font-semibold text-surface-900">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "View Results", href: "/results", color: "bg-primary-50 text-primary-700 hover:bg-primary-100" },
            { label: "My Attendance", href: "/attendance", color: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" },
            { label: "View Notices", href: "/notices", color: "bg-amber-50 text-amber-700 hover:bg-amber-100" },
            { label: "Students", href: "/students", color: "bg-surface-100 text-surface-700 hover:bg-surface-200" },
          ].map(({ label, href, color }) => (
            <a
              key={href}
              href={href}
              className={`flex items-center justify-center p-4 rounded-xl text-sm font-semibold transition-all ${color}`}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
