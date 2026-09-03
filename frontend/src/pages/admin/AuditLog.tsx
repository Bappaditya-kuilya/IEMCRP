import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { ChevronLeft, ChevronRight, Shield } from "lucide-react";

interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  entity: string;
  ipAddress: string;
}

export default function AuditLog() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [actionFilter, setActionFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    const params = new URLSearchParams({ page: String(page), size: "20" });
    if (actionFilter) params.set("action", actionFilter);
    if (dateFrom) params.set("from", dateFrom);
    if (dateTo) params.set("to", dateTo);

    apiFetch<{ content: AuditEntry[]; totalPages: number }>(`/admin/audit?${params}`)
      .then((res) => {
        setEntries(res.content || []);
        setTotalPages(res.totalPages || 1);
      })
      .catch((err: Error) => setError(err.message));
  }, [page, actionFilter, dateFrom, dateTo]);

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
        <h1 className="text-2xl font-bold text-surface-900">Audit Log</h1>
        <p className="text-sm text-surface-500 mt-1">Track all system activity</p>
      </div>

      {/* Filters */}
      <div className="card-modern p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <label htmlFor="action-filter" className="sr-only">Filter by action</label>
          <select
            id="action-filter"
            value={actionFilter}
            onChange={(e) => { setActionFilter(e.target.value); setPage(0); }}
            className="input-modern sm:w-40"
          >
            <option value="">All Actions</option>
            <option value="CREATE">Create</option>
            <option value="UPDATE">Update</option>
            <option value="DELETE">Delete</option>
            <option value="LOGIN">Login</option>
          </select>
          <label htmlFor="date-from" className="sr-only">From date</label>
          <input
            id="date-from"
            type="date"
            value={dateFrom}
            onChange={(e) => { setDateFrom(e.target.value); setPage(0); }}
            className="input-modern sm:w-40"
          />
          <label htmlFor="date-to" className="sr-only">To date</label>
          <input
            id="date-to"
            type="date"
            value={dateTo}
            onChange={(e) => { setDateTo(e.target.value); setPage(0); }}
            className="input-modern sm:w-40"
          />
        </div>
      </div>

      {/* Empty state */}
      {entries.length === 0 && (
        <div className="card-modern p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-surface-100 flex items-center justify-center mx-auto mb-3">
            <Shield className="h-6 w-6 text-surface-400" />
          </div>
          <p className="text-sm text-surface-500">No audit entries found.</p>
        </div>
      )}

      {/* Desktop table */}
      <div className="card-modern hidden md:block overflow-hidden">
        <table className="table-modern" aria-label="Audit log">
          <thead>
            <tr>
              <th scope="col">Timestamp</th>
              <th scope="col">User</th>
              <th scope="col">Action</th>
              <th scope="col">Entity</th>
              <th scope="col">IP Address</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
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
                  <span className={`badge-modern ${
                    e.action === "CREATE" ? "bg-emerald-100 text-emerald-700" :
                    e.action === "DELETE" ? "bg-red-100 text-red-700" :
                    e.action === "LOGIN" ? "bg-primary-100 text-primary-700" :
                    "bg-surface-100 text-surface-600"
                  }`}>
                    {e.action}
                  </span>
                </td>
                <td className="text-surface-600">{e.entity}</td>
                <td className="font-mono text-xs text-surface-400">{e.ipAddress}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {entries.map((e) => (
          <div key={e.id} className="card-modern p-4">
            <div className="flex justify-between items-start mb-2">
              <span className={`badge-modern ${
                e.action === "CREATE" ? "bg-emerald-100 text-emerald-700" :
                e.action === "DELETE" ? "bg-red-100 text-red-700" :
                e.action === "LOGIN" ? "bg-primary-100 text-primary-700" :
                "bg-surface-100 text-surface-600"
              }`}>
                {e.action}
              </span>
              <span className="text-xs text-surface-400 font-mono">{e.ipAddress}</span>
            </div>
            <p className="text-sm font-medium text-surface-900">{e.user}</p>
            <p className="text-xs text-surface-500 mt-1">{e.entity}</p>
            <p className="text-xs text-surface-400 mt-1">
              {new Date(e.timestamp).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            aria-label="Previous page"
            className="inline-flex items-center gap-1 px-4 py-2 rounded-xl border border-surface-200 text-sm font-semibold text-surface-700 hover:bg-surface-50 disabled:opacity-40 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>
          <span className="text-sm text-surface-500 font-medium">
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            aria-label="Next page"
            className="inline-flex items-center gap-1 px-4 py-2 rounded-xl border border-surface-200 text-sm font-semibold text-surface-700 hover:bg-surface-50 disabled:opacity-40 transition-colors"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
