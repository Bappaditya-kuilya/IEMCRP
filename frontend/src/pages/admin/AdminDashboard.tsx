import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "@/lib/api";
import { Users, ClipboardList, Bell, Activity, Plus, Shield } from "lucide-react";

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

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          <span className="text-sm text-surface-500">Loading admin dashboard...</span>
        </div>
      </div>
    );
  }

  const cards = [
    { label: "Students", value: stats.totalStudents, icon: Users, gradient: "gradient-primary" },
    { label: "Staff", value: stats.totalStaff, icon: ClipboardList, gradient: "bg-gradient-to-br from-purple-500 to-violet-600" },
    { label: "Notices", value: stats.activeNotices, icon: Bell, gradient: "bg-gradient-to-br from-amber-500 to-orange-600" },
    { label: "System", value: stats.systemStatus, icon: Activity, gradient: "bg-gradient-to-br from-emerald-500 to-teal-600" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Admin Dashboard</h1>
          <p className="text-sm text-surface-500 mt-1">System overview and management</p>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/create-user" className="btn-primary">
            <Plus className="h-4 w-4" />
            Create User
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, gradient }) => (
          <div key={label} className="card-modern p-5 group">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-surface-500 mb-1">{label}</p>
                <p className="text-2xl font-bold text-surface-900">{value}</p>
              </div>
              <div className={`w-12 h-12 rounded-2xl ${gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Manage Users", href: "/admin/users", color: "bg-primary-50 text-primary-700 hover:bg-primary-100" },
          { label: "Audit Log", href: "/admin/audit", color: "bg-amber-50 text-amber-700 hover:bg-amber-100" },
          { label: "Manage Notices", href: "/notices", color: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" },
          { label: "View Reports", href: "/admin/audit", color: "bg-surface-100 text-surface-700 hover:bg-surface-200" },
        ].map(({ label, href, color }) => (
          <Link
            key={href}
            to={href}
            className={`flex items-center justify-center p-4 rounded-xl text-sm font-semibold transition-all ${color}`}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Audit log */}
      <div className="card-modern overflow-hidden">
        <div className="p-6 border-b border-surface-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary-500" />
            <h2 className="text-sm font-semibold text-surface-900">Recent Audit Log</h2>
          </div>
          <Link to="/admin/audit" className="text-xs font-semibold text-primary-600 hover:text-primary-700">
            View all →
          </Link>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block">
          <table className="table-modern" aria-label="Recent audit log">
            <thead>
              <tr>
                <th scope="col">Time</th>
                <th scope="col">User</th>
                <th scope="col">Action</th>
                <th scope="col">Entity</th>
              </tr>
            </thead>
            <tbody>
              {audit.map((e) => (
                <tr key={e.id}>
                  <td className="font-mono text-xs text-surface-500">
                    {new Date(e.timestamp).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="font-medium text-surface-900">{e.user}</td>
                  <td>
                    <span className="badge-modern bg-surface-100 text-surface-600">{e.action}</span>
                  </td>
                  <td className="text-surface-600">{e.entity}</td>
                </tr>
              ))}
              {audit.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center text-surface-400 py-8">No entries</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-surface-100">
          {audit.map((e) => (
            <div key={e.id} className="p-4">
              <div className="flex justify-between items-start mb-1">
                <p className="text-sm font-medium text-surface-900">{e.action}</p>
                <span className="badge-modern bg-surface-100 text-surface-600 text-[10px]">{e.entity}</span>
              </div>
              <p className="text-xs text-surface-500">{e.user}</p>
              <p className="text-xs text-surface-400 mt-1">
                {new Date(e.timestamp).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
