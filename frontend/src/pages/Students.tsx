import { useEffect, useState, useMemo } from "react";
import { apiFetch } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Search } from "lucide-react";

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

  if (error) return <div className="text-sm text-red-600" role="alert" aria-live="polite">{error}</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900">Students</h1>

      <div className="relative max-w-sm">
        <label htmlFor="student-search" className="sr-only">Search students</label>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          id="student-search"
          type="text"
          placeholder="Search by name, roll, or department..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 w-full border border-slate-300 rounded-md pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {filtered.length === 0 && (
        <p className="text-sm text-slate-600">No students found.</p>
      )}

      {/* Desktop table */}
      <Card className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm text-left" aria-label="Students">
          <thead>
            <tr className="border-b border-slate-200">
              <th scope="col" className="py-3 px-4 font-medium text-slate-600">Name</th>
              <th scope="col" className="py-3 px-4 font-medium text-slate-600">Roll No</th>
              <th scope="col" className="py-3 px-4 font-medium text-slate-600">Department</th>
              <th scope="col" className="py-3 px-4 font-medium text-slate-600">Semester</th>
              <th scope="col" className="py-3 px-4 font-medium text-slate-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-3 px-4 text-slate-900">{s.name}</td>
                <td className="py-3 px-4 text-slate-700">{s.rollNumber}</td>
                <td className="py-3 px-4 text-slate-700">{s.department}</td>
                <td className="py-3 px-4 text-slate-700">{s.semester}</td>
                <td className="py-3 px-4">
                  <Badge variant={s.status === "active" ? "active" : "pending"}>
                    {s.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {filtered.map((s) => (
          <Card key={s.id}>
            <div className="flex justify-between items-start mb-1">
              <p className="font-medium text-slate-900">{s.name}</p>
              <Badge variant={s.status === "active" ? "active" : "pending"}>
                {s.status}
              </Badge>
            </div>
            <p className="text-sm text-slate-600">Roll: {s.rollNumber}</p>
            <p className="text-xs text-slate-600 mt-1">{s.department} &middot; Sem {s.semester}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
