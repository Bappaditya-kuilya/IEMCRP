import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "@/lib/api";
import { Badge } from "@/components/ui/Badge";
import { Search, Plus, Users } from "lucide-react";

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Manage Users</h1>
          <p className="text-sm text-surface-500 mt-1">{filtered.length} users found</p>
        </div>
        <Link to="/admin/create-user" className="btn-primary">
          <Plus className="h-4 w-4" />
          Create User
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <label htmlFor="user-search" className="sr-only">Search users</label>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
          <input
            id="user-search"
            type="text"
            placeholder="Search by name, username, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-modern pl-10"
          />
        </div>
        <label htmlFor="role-filter" className="sr-only">Filter by role</label>
        <select
          id="role-filter"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="input-modern w-full sm:w-40"
        >
          <option value="">All Roles</option>
          <option value="STUDENT">Student</option>
          <option value="STAFF">Staff</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="card-modern p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-surface-100 flex items-center justify-center mx-auto mb-3">
            <Users className="h-6 w-6 text-surface-400" />
          </div>
          <p className="text-sm text-surface-500">No users found.</p>
        </div>
      )}

      {/* Desktop table */}
      <div className="card-modern hidden md:block overflow-hidden">
        <table className="table-modern" aria-label="Users">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Username</th>
              <th scope="col">Email</th>
              <th scope="col">Role</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
                      <span className="text-xs font-bold text-primary-700">
                        {u.firstName?.[0]}{u.lastName?.[0]}
                      </span>
                    </div>
                    <span className="font-medium text-surface-900">{u.firstName} {u.lastName}</span>
                  </div>
                </td>
                <td className="font-mono text-sm text-surface-600">{u.username}</td>
                <td className="text-surface-600">{u.email}</td>
                <td>
                  <Badge variant={u.role === "ADMIN" ? "active" : u.role === "STAFF" ? "pending" : "enrolled"}>
                    {u.role}
                  </Badge>
                </td>
                <td>
                  <Badge variant={u.status === "active" ? "pass" : "pending"}>{u.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {filtered.map((u) => (
          <div key={u.id} className="card-modern p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary-700">
                    {u.firstName?.[0]}{u.lastName?.[0]}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-surface-900">{u.firstName} {u.lastName}</p>
                  <p className="text-xs text-surface-500 font-mono">{u.username}</p>
                </div>
              </div>
              <Badge variant={u.status === "active" ? "pass" : "pending"}>{u.status}</Badge>
            </div>
            <div className="flex items-center gap-2 text-xs text-surface-500 mt-2">
              <span>{u.email}</span>
              <span>·</span>
              <Badge variant={u.role === "ADMIN" ? "active" : u.role === "STAFF" ? "pending" : "enrolled"}>
                {u.role}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
