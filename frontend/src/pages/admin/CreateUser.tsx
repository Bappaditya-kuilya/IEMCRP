import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createAdminUser } from "@/lib/api";
import { UserPlus, ArrowLeft } from "lucide-react";

export default function CreateUser() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    role: "STUDENT",
    department: "",
    semester: "",
    rollNumber: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await createAdminUser({
        ...form,
        semester: form.semester ? Number(form.semester) : undefined,
      });
      navigate("/admin/users");
    } catch (err: any) {
      setError(err.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate("/admin/users")}
          className="inline-flex items-center gap-1.5 text-sm text-surface-500 hover:text-surface-700 mb-3 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to users
        </button>
        <h1 className="text-2xl font-bold text-surface-900">Create User</h1>
        <p className="text-sm text-surface-500 mt-1">Add a new user to the system</p>
      </div>

      <div className="card-modern p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700 flex items-center gap-3" role="alert" aria-live="polite">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-red-600 text-xs font-bold">!</span>
              </div>
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-surface-900 mb-2">First Name</label>
              <input
                type="text"
                required
                value={form.firstName}
                onChange={set("firstName")}
                className="input-modern"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-surface-900 mb-2">Last Name</label>
              <input
                type="text"
                required
                value={form.lastName}
                onChange={set("lastName")}
                className="input-modern"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-surface-900 mb-2">Username</label>
            <input
              type="text"
              required
              value={form.username}
              onChange={set("username")}
              className="input-modern"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-surface-900 mb-2">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={set("email")}
              className="input-modern"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-surface-900 mb-2">Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={set("password")}
              className="input-modern"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-surface-900 mb-2">Role</label>
            <select
              value={form.role}
              onChange={set("role")}
              className="input-modern"
            >
              <option value="STUDENT">Student</option>
              <option value="STAFF">Staff</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          {form.role === "STUDENT" && (
            <>
              <div>
                <label className="block text-sm font-semibold text-surface-900 mb-2">Department</label>
                <input
                  type="text"
                  value={form.department}
                  onChange={set("department")}
                  className="input-modern"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-surface-900 mb-2">Semester</label>
                  <input
                    type="number"
                    min={1}
                    max={8}
                    value={form.semester}
                    onChange={set("semester")}
                    className="input-modern"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-surface-900 mb-2">Roll Number</label>
                  <input
                    type="text"
                    value={form.rollNumber}
                    onChange={set("rollNumber")}
                    className="input-modern"
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className="btn-primary w-full"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating...
              </div>
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                Create User
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
