import { useEffect, useState, useMemo } from "react";
import { apiFetch } from "@/lib/api";
import { Badge } from "@/components/ui/Badge";
import { ArrowUpDown, GraduationCap, Trophy } from "lucide-react";

interface Result {
  id: string;
  examName: string;
  subject: string;
  marks: number;
  maxMarks: number;
  grade: string;
  passed: boolean;
}

type SortKey = "examName" | "subject" | "marks";

export default function Results() {
  const [results, setResults] = useState<Result[]>([]);
  const [error, setError] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("examName");
  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => {
    apiFetch<Result[]>("/student/results")
      .then(setResults)
      .catch((err: Error) => setError(err.message));
  }, []);

  const sorted = useMemo(() => {
    return [...results].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "number" && typeof bv === "number") {
        return sortAsc ? av - bv : bv - av;
      }
      return sortAsc
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
  }, [results, sortKey, sortAsc]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  }

  const passCount = results.filter(r => r.passed).length;
  const avgMarks = results.length > 0 ? Math.round(results.reduce((sum, r) => sum + r.marks, 0) / results.length) : 0;

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
        <h1 className="text-2xl font-bold text-surface-900">Results</h1>
        <p className="text-sm text-surface-500 mt-1">{results.length} results found</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="card-modern p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-surface-900">{results.length}</p>
              <p className="text-xs text-surface-500 font-medium">Total Results</p>
            </div>
          </div>
        </div>
        <div className="card-modern p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Trophy className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-surface-900">{passCount}/{results.length}</p>
              <p className="text-xs text-surface-500 font-medium">Passed</p>
            </div>
          </div>
        </div>
        <div className="card-modern p-5 col-span-2 md:col-span-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">%</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-surface-900">{avgMarks}</p>
              <p className="text-xs text-surface-500 font-medium">Average Marks</p>
            </div>
          </div>
        </div>
      </div>

      {/* Empty state */}
      {sorted.length === 0 && (
        <div className="card-modern p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-surface-100 flex items-center justify-center mx-auto mb-3">
            <GraduationCap className="h-6 w-6 text-surface-400" />
          </div>
          <p className="text-sm text-surface-500">No results found.</p>
        </div>
      )}

      {/* Desktop table */}
      <div className="card-modern hidden md:block overflow-hidden">
        <table className="table-modern" aria-label="Student results">
          <thead>
            <tr>
              {(["examName", "subject", "marks"] as const).map((key) => (
                <th
                  key={key}
                  scope="col"
                  className="cursor-pointer select-none hover:text-surface-900"
                  onClick={() => toggleSort(key)}
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleSort(key); } }}
                >
                  <span className="inline-flex items-center gap-1">
                    {key === "examName" ? "Exam" : key === "subject" ? "Subject" : "Marks"}
                    <ArrowUpDown className="h-3 w-3 opacity-50" />
                  </span>
                </th>
              ))}
              <th scope="col">Grade</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => (
              <tr key={r.id}>
                <td className="font-medium text-surface-900">{r.examName}</td>
                <td className="text-surface-600">{r.subject}</td>
                <td className="font-mono text-sm text-surface-700">{r.marks}/{r.maxMarks}</td>
                <td className="font-semibold text-surface-900">{r.grade}</td>
                <td>
                  <Badge variant={r.passed ? "pass" : "fail"}>
                    {r.passed ? "Pass" : "Fail"}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {sorted.map((r) => (
          <div key={r.id} className="card-modern p-4">
            <div className="flex justify-between items-start mb-2">
              <p className="font-semibold text-surface-900">{r.examName}</p>
              <Badge variant={r.passed ? "pass" : "fail"}>
                {r.passed ? "Pass" : "Fail"}
              </Badge>
            </div>
            <p className="text-sm text-surface-600">{r.subject}</p>
            <div className="flex gap-4 mt-3 text-sm">
              <span className="font-mono text-surface-700">{r.marks}/{r.maxMarks}</span>
              <span className="font-semibold text-surface-900">Grade: {r.grade}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
