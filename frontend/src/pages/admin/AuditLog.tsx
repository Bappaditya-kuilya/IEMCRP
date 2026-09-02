import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

  if (error) return <div className="text-sm text-red-600" role="alert" aria-live="polite">{error}</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900">Audit Log</h1>

      <div className="flex flex-col sm:flex-row gap-3">
        <label htmlFor="action-filter" className="sr-only">Filter by action</label>
        <select
          id="action-filter"
          value={actionFilter}
          onChange={(e) => { setActionFilter(e.target.value); setPage(0); }}
          className="h-10 border border-slate-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
          className="h-10 border border-slate-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <label htmlFor="date-to" className="sr-only">To date</label>
        <input
          id="date-to"
          type="date"
          value={dateTo}
          onChange={(e) => { setDateTo(e.target.value); setPage(0); }}
          className="h-10 border border-slate-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <Card className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm text-left" aria-label="Audit log">
          <thead>
            <tr className="border-b border-slate-200">
              <th scope="col" className="py-3 px-4 font-medium text-slate-600">Timestamp</th>
              <th scope="col" className="py-3 px-4 font-medium text-slate-600">User</th>
              <th scope="col" className="py-3 px-4 font-medium text-slate-600">Action</th>
              <th scope="col" className="py-3 px-4 font-medium text-slate-600">Entity</th>
              <th scope="col" className="py-3 px-4 font-medium text-slate-600">IP Address</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-3 px-4 text-slate-700">{new Date(e.timestamp).toLocaleString()}</td>
                <td className="py-3 px-4 text-slate-700">{e.user}</td>
                <td className="py-3 px-4 text-slate-700">{e.action}</td>
                <td className="py-3 px-4 text-slate-700">{e.entity}</td>
                <td className="py-3 px-4 text-slate-700">{e.ipAddress}</td>
              </tr>
            ))}
            {entries.length === 0 && (
              <tr>
                <td colSpan={5} className="py-4 text-center text-slate-600">No entries</td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>

      <div className="md:hidden space-y-3">
        {entries.map((e) => (
          <Card key={e.id}>
            <p className="text-sm font-medium text-slate-900">{e.action}</p>
            <p className="text-xs text-slate-600 mt-1">{e.user} &middot; {e.entity}</p>
            <p className="text-xs text-slate-600 mt-1">
              {new Date(e.timestamp).toLocaleString()} &middot; {e.ipAddress}
            </p>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            aria-label="Previous page"
            className="p-2 rounded-md border border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm text-slate-600">Page {page + 1} of {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            aria-label="Next page"
            className="p-2 rounded-md border border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
