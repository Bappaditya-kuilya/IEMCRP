import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Users, ClipboardList, Bell, Activity } from "lucide-react";

interface DashboardStats {
  totalStudents: number;
  totalStaff: number;
  activeNotices: number;
  systemStatus: string;
}

interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  entity: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [audit, setAudit] = useState<AuditEntry[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch<DashboardStats>("/admin/dashboard")
      .then(setStats)
      .catch((err: Error) => setError(err.message));
    apiFetch<{ content: AuditEntry[] }>("/admin/audit?page=0&size=10")
      .then((res) => setAudit(res.content || []))
      .catch(() => {});
  }, []);

  if (error) return <div className="text-sm text-red-600" role="alert" aria-live="polite">{error}</div>;
  if (!stats) return <div className="text-sm text-slate-600" aria-live="polite">Loading...</div>;

  const cards = [
    { label: "Total Students", value: stats.totalStudents, icon: Users, color: "text-blue-500" },
    { label: "Total Staff", value: stats.totalStaff, icon: ClipboardList, color: "text-purple-500" },
    { label: "Active Notices", value: stats.activeNotices, icon: Bell, color: "text-amber-500" },
    { label: "System Status", value: stats.systemStatus, icon: Activity, color: "text-green-500" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <div className="flex items-center gap-3">
              <Icon className={`h-5 w-5 ${color}`} />
              <div>
                <p className="text-xs text-slate-600">{label}</p>
                <p className="text-lg font-semibold text-slate-900">{value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex gap-3">
        <Link
          to="/admin/create-user"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          <Users className="h-4 w-4" /> Create User
        </Link>
        <Link
          to="/notices"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          <Bell className="h-4 w-4" /> Manage Notices
        </Link>
      </div>

      <Card>
        <h2 className="text-sm font-medium text-slate-700 mb-3">Recent Audit Log</h2>
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm text-left" aria-label="Recent audit log">
            <thead>
              <tr className="border-b border-slate-200">
                <th scope="col" className="py-2 px-3 font-medium text-slate-600">Time</th>
                <th scope="col" className="py-2 px-3 font-medium text-slate-600">User</th>
                <th scope="col" className="py-2 px-3 font-medium text-slate-600">Action</th>
                <th scope="col" className="py-2 px-3 font-medium text-slate-600">Entity</th>
              </tr>
            </thead>
            <tbody>
              {audit.map((e) => (
                <tr key={e.id} className="border-b border-slate-100">
                  <td className="py-2 px-3 text-slate-700">{new Date(e.timestamp).toLocaleString()}</td>
                  <td className="py-2 px-3 text-slate-700">{e.user}</td>
                  <td className="py-2 px-3 text-slate-700">{e.action}</td>
                  <td className="py-2 px-3 text-slate-700">{e.entity}</td>
                </tr>
              ))}
              {audit.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-2 px-3 text-slate-600 text-center">No entries</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="md:hidden space-y-2">
          {audit.map((e) => (
            <div key={e.id} className="border-b border-slate-100 pb-2">
              <p className="text-sm text-slate-900">{e.action}</p>
              <p className="text-xs text-slate-600">{e.user} &middot; {e.entity}</p>
              <p className="text-xs text-slate-600">{new Date(e.timestamp).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
