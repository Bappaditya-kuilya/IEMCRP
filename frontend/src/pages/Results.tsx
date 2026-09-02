import { useEffect, useState, useMemo } from "react";
import { apiFetch } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ArrowUpDown } from "lucide-react";

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

  if (error) return <div className="text-sm text-red-600" role="alert" aria-live="polite">{error}</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900">Results</h1>

      {sorted.length === 0 && !error && (
        <p className="text-sm text-slate-500">No results found.</p>
      )}

      {/* Desktop table */}
      <Card className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm text-left" aria-label="Student results">
          <thead>
            <tr className="border-b border-slate-200">
              {(["examName", "subject", "marks"] as const).map((key) => (
                <th
                  key={key}
                  scope="col"
                  className="py-3 px-4 font-medium text-slate-600 cursor-pointer select-none hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={() => toggleSort(key)}
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleSort(key); } }}
                >
                  <span className="inline-flex items-center gap-1">
                    {key === "examName" ? "Exam" : key === "subject" ? "Subject" : "Marks"}
                    <ArrowUpDown className="h-3 w-3" />
                  </span>
                </th>
              ))}
              <th scope="col" className="py-3 px-4 font-medium text-slate-600">Grade</th>
              <th scope="col" className="py-3 px-4 font-medium text-slate-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => (
              <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-3 px-4 text-slate-900">{r.examName}</td>
                <td className="py-3 px-4 text-slate-700">{r.subject}</td>
                <td className="py-3 px-4 text-slate-700">{r.marks}/{r.maxMarks}</td>
                <td className="py-3 px-4 text-slate-700">{r.grade}</td>
                <td className="py-3 px-4">
                  <Badge variant={r.passed ? "pass" : "fail"}>
                    {r.passed ? "Pass" : "Fail"}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {sorted.map((r) => (
          <Card key={r.id}>
            <div className="flex justify-between items-start mb-2">
              <p className="font-medium text-slate-900">{r.examName}</p>
              <Badge variant={r.passed ? "pass" : "fail"}>
                {r.passed ? "Pass" : "Fail"}
              </Badge>
            </div>
            <p className="text-sm text-slate-600">{r.subject}</p>
            <div className="flex gap-4 mt-2 text-sm text-slate-600">
              <span>{r.marks}/{r.maxMarks}</span>
              <span>Grade: {r.grade}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
