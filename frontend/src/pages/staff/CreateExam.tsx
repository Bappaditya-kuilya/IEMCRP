import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createExam } from "@/lib/api";
import { Card } from "@/components/ui/Card";

const examTypes = ["MIDTERM", "FINAL", "INTERNAL"];

export default function CreateExam() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    examType: "MIDTERM",
    semester: 1,
    academicYear: "2025-2026",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await createExam(form);
      navigate("/staff/results");
    } catch (err: any) {
      setError(err.message || "Failed to create exam");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900">Create Exam</h1>

      {error && <p className="text-sm text-red-600" role="alert" aria-live="polite">{error}</p>}

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="exam-name" className="block text-sm font-medium text-slate-700 mb-1">Exam Name</label>
            <input
              id="exam-name"
              type="text"
              required
              className="w-full h-10 border border-slate-300 rounded-md px-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="exam-type" className="block text-sm font-medium text-slate-700 mb-1">Exam Type</label>
            <select
              id="exam-type"
              className="w-full h-10 border border-slate-300 rounded-md px-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={form.examType}
              onChange={(e) => update("examType", e.target.value)}
            >
              {examTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="semester" className="block text-sm font-medium text-slate-700 mb-1">Semester</label>
            <select
              id="semester"
              className="w-full h-10 border border-slate-300 rounded-md px-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={form.semester}
              onChange={(e) => update("semester", Number(e.target.value))}
            >
              {Array.from({ length: 8 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="academic-year" className="block text-sm font-medium text-slate-700 mb-1">Academic Year</label>
            <input
              id="academic-year"
              type="text"
              required
              placeholder="2025-2026"
              className="w-full h-10 border border-slate-300 rounded-md px-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={form.academicYear}
              onChange={(e) => update("academicYear", e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className="w-full h-10 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
          >
            {loading ? "Creating..." : "Create Exam"}
          </button>
        </form>
      </Card>
    </div>
  );
}
