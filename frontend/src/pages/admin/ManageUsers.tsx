import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Search, Plus } from "lucide-react";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: string;
  status: "active" | "inactive";
}

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  useEffect(() => {
    apiFetch<{ content: User[] }>("/admin/users?page=0&size=200")
      .then((res) => setUsers(res.content || []))
      .catch((err: Error) => setError(err.message));
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter((u) => {
      const matchSearch =
        !q ||
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q);
      const matchRole = !roleFilter || u.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [users, search, roleFilter]);

  if (error) return <div className="text-sm text-red-600" role="alert" aria-live="polite">{error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Manage Users</h1>
        <Link
          to="/admin/create-user"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          <Plus className="h-4 w-4" /> Create User
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <label htmlFor="user-search" className="sr-only">Search users</label>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            id="user-search"
            type="text"
            placeholder="Search by name, username, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full border border-slate-300 rounded-md pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <label htmlFor="role-filter" className="sr-only">Filter by role</label>
        <select
          id="role-filter"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="h-10 border border-slate-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Roles</option>
          <option value="STUDENT">Student</option>
          <option value="STAFF">Staff</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      {filtered.length === 0 && (
        <p className="text-sm text-slate-600">No users found.</p>
      )}

      <Card className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm text-left" aria-label="Users">
          <thead>
            <tr className="border-b border-slate-200">
              <th scope="col" className="py-3 px-4 font-medium text-slate-600">Name</th>
              <th scope="col" className="py-3 px-4 font-medium text-slate-600">Username</th>
              <th scope="col" className="py-3 px-4 font-medium text-slate-600">Email</th>
              <th scope="col" className="py-3 px-4 font-medium text-slate-600">Role</th>
              <th scope="col" className="py-3 px-4 font-medium text-slate-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-3 px-4 text-slate-900">{u.firstName} {u.lastName}</td>
                <td className="py-3 px-4 text-slate-700">{u.username}</td>
                <td className="py-3 px-4 text-slate-700">{u.email}</td>
                <td className="py-3 px-4 text-slate-700">{u.role}</td>
                <td className="py-3 px-4">
                  <Badge variant={u.status === "active" ? "active" : "pending"}>{u.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <div className="md:hidden space-y-3">
        {filtered.map((u) => (
          <Card key={u.id}>
            <div className="flex justify-between items-start mb-1">
              <p className="font-medium text-slate-900">{u.firstName} {u.lastName}</p>
              <Badge variant={u.status === "active" ? "active" : "pending"}>{u.status}</Badge>
            </div>
            <p className="text-sm text-slate-600">{u.username}</p>
            <p className="text-xs text-slate-600 mt-1">{u.email} &middot; {u.role}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
