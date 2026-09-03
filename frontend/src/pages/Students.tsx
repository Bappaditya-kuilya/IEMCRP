import { useEffect, useState, useMemo } from "react";
import { apiFetch } from "@/lib/api";
import { Badge } from "@/components/ui/Badge";
import { Search, Users } from "lucide-react";

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  department: string;
  semester: number;
  status: "active" | "inactive";
}

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    apiFetch<Student[]>("/students")
      .then(setStudents)
      .catch((err: Error) => setError(err.message));
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return students;
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.rollNumber.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q)
    );
  }, [students, search]);

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
          <h1 className="text-2xl font-bold text-surface-900">Students</h1>
          <p className="text-sm text-surface-500 mt-1">{filtered.length} students found</p>
        </div>
        <div className="relative">
          <label htmlFor="student-search" className="sr-only">Search students</label>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
          <input
            id="student-search"
            type="text"
            placeholder="Search by name, roll, or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-modern pl-10 w-full sm:w-80"
          />
        </div>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="card-modern p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-surface-100 flex items-center justify-center mx-auto mb-3">
            <Users className="h-6 w-6 text-surface-400" />
          </div>
          <p className="text-sm text-surface-500">No students found.</p>
        </div>
      )}

      {/* Desktop table */}
      <div className="card-modern hidden md:block overflow-hidden">
        <table className="table-modern" aria-label="Students">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Roll No</th>
              <th scope="col">Department</th>
              <th scope="col">Semester</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
                      <span className="text-xs font-bold text-primary-700">
                        {s.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </span>
                    </div>
                    <span className="font-medium text-surface-900">{s.name}</span>
                  </div>
                </td>
                <td className="font-mono text-sm text-surface-600">{s.rollNumber}</td>
                <td className="text-surface-600">{s.department}</td>
                <td className="text-surface-600">Sem {s.semester}</td>
                <td>
                  <Badge variant={s.status === "active" ? "active" : "pending"}>
                    {s.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {filtered.map((s) => (
          <div key={s.id} className="card-modern p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary-700">
                    {s.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-surface-900">{s.name}</p>
                  <p className="text-xs text-surface-500 font-mono">{s.rollNumber}</p>
                </div>
              </div>
              <Badge variant={s.status === "active" ? "active" : "pending"}>
                {s.status}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-xs text-surface-500 mt-2">
              <span>{s.department}</span>
              <span>·</span>
              <span>Sem {s.semester}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
