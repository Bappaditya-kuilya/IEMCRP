import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createExam } from "@/lib/api";
import { ClipboardList, ArrowLeft } from "lucide-react";

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
    <div className="max-w-lg mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate("/staff/results")}
          className="inline-flex items-center gap-1.5 text-sm text-surface-500 hover:text-surface-700 mb-3 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to exams
        </button>
        <h1 className="text-2xl font-bold text-surface-900">Create Exam</h1>
        <p className="text-sm text-surface-500 mt-1">Set up a new examination</p>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700 flex items-center gap-3" role="alert" aria-live="polite">
          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
            <span className="text-red-600 text-xs font-bold">!</span>
          </div>
          {error}
        </div>
      )}

      <div className="card-modern p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="exam-name" className="block text-sm font-semibold text-surface-900 mb-2">Exam Name</label>
            <input
              id="exam-name"
              type="text"
              required
              className="input-modern"
              placeholder="e.g., Mid Semester Examination"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="exam-type" className="block text-sm font-semibold text-surface-900 mb-2">Exam Type</label>
            <select
              id="exam-type"
              className="input-modern"
              value={form.examType}
              onChange={(e) => update("examType", e.target.value)}
            >
              {examTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="semester" className="block text-sm font-semibold text-surface-900 mb-2">Semester</label>
            <select
              id="semester"
              className="input-modern"
              value={form.semester}
              onChange={(e) => update("semester", Number(e.target.value))}
            >
              {Array.from({ length: 8 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>Semester {n}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="academic-year" className="block text-sm font-semibold text-surface-900 mb-2">Academic Year</label>
            <input
              id="academic-year"
              type="text"
              required
              placeholder="2025-2026"
              className="input-modern"
              value={form.academicYear}
              onChange={(e) => update("academicYear", e.target.value)}
            />
          </div>

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
                <ClipboardList className="h-4 w-4" />
                Create Exam
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
