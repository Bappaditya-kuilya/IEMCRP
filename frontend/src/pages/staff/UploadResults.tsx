import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getStaffExams, uploadResults } from "@/lib/api";
import { Plus, Trash2, Upload } from "lucide-react";

interface Exam {
  id: string;
  name: string;
  examType: string;
  semester: number;
  academicYear: string;
}

interface ResultRow {
  id: string;
  studentId: string;
  subjectCode: string;
  subjectName: string;
  marksObtained: number;
  maxMarks: number;
  grade: string;
}

function calculateGrade(marks: number, max: number): string {
  if (max <= 0) return "-";
  const pct = (marks / max) * 100;
  if (pct >= 90) return "A+";
  if (pct >= 80) return "A";
  if (pct >= 70) return "B+";
  if (pct >= 60) return "B";
  if (pct >= 50) return "C";
  if (pct >= 40) return "D";
  return "F";
}

let rowId = 0;
function newRow(): ResultRow {
  return {
    id: String(++rowId),
    studentId: "",
    subjectCode: "",
    subjectName: "",
    marksObtained: 0,
    maxMarks: 100,
    grade: "-",
  };
}

export default function UploadResults() {
  const [params] = useSearchParams();
  const initialExamId = params.get("examId") || "";

  const [exams, setExams] = useState<Exam[]>([]);
  const [examId, setExamId] = useState(initialExamId);
  const [rows, setRows] = useState<ResultRow[]>([newRow()]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    getStaffExams()
      .then((data: any) => setExams(data.exams || data))
      .catch((err: Error) => setError(err.message));
  }, []);

  function updateRow(id: string, field: keyof ResultRow, value: any) {
    setRows((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const next = { ...r, [field]: value };
        if (field === "marksObtained" || field === "maxMarks") {
          next.grade = calculateGrade(
            field === "marksObtained" ? value : r.marksObtained,
            field === "maxMarks" ? value : r.maxMarks
          );
        }
        return next;
      })
    );
  }

  function addRow() {
    setRows((prev) => [...prev, newRow()]);
  }

  function removeRow(id: string) {
    setRows((prev) => (prev.length === 1 ? prev : prev.filter((r) => r.id !== id)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!examId) {
      setError("Select an exam first");
      return;
    }
    setLoading(true);
    try {
      const payload = rows.map(({ id: _, ...rest }) => rest);
      await uploadResults({ examId, results: payload });
      setSuccess("Results uploaded successfully");
      setRows([newRow()]);
    } catch (err: any) {
      setError(err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-surface-900">Upload Results</h1>
        <p className="text-sm text-surface-500 mt-1">Submit grades for your students</p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700 flex items-center gap-3" role="alert" aria-live="polite">
          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
            <span className="text-red-600 text-xs font-bold">!</span>
          </div>
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-700 flex items-center gap-3" role="status" aria-live="polite">
          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
            <span className="text-emerald-600 text-xs font-bold">✓</span>
          </div>
          {success}
        </div>
      )}

      {/* Exam selector */}
      <div className="card-modern p-6">
        <label htmlFor="exam-select" className="block text-sm font-semibold text-surface-900 mb-2">Select Exam</label>
        <select
          id="exam-select"
          required
          className="input-modern"
          value={examId}
          onChange={(e) => setExamId(e.target.value)}
        >
          <option value="">-- Choose exam --</option>
          {exams.map((ex) => (
            <option key={ex.id} value={ex.id}>
              {ex.name} ({ex.examType} - Sem {ex.semester})
            </option>
          ))}
        </select>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Desktop table */}
        <div className="card-modern hidden md:block overflow-hidden">
          <table className="table-modern" aria-label="Upload results">
            <thead>
              <tr>
                <th scope="col">Student ID</th>
                <th scope="col">Subject Code</th>
                <th scope="col">Subject Name</th>
                <th scope="col">Marks</th>
                <th scope="col">Max</th>
                <th scope="col">Grade</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>
                    <label htmlFor={`student-id-${row.id}`} className="sr-only">Student ID</label>
                    <input
                      id={`student-id-${row.id}`}
                      required
                      className="input-modern !py-2 !px-3"
                      value={row.studentId}
                      onChange={(e) => updateRow(row.id, "studentId", e.target.value)}
                    />
                  </td>
                  <td>
                    <label htmlFor={`subject-code-${row.id}`} className="sr-only">Subject Code</label>
                    <input
                      id={`subject-code-${row.id}`}
                      required
                      className="input-modern !py-2 !px-3"
                      value={row.subjectCode}
                      onChange={(e) => updateRow(row.id, "subjectCode", e.target.value)}
                    />
                  </td>
                  <td>
                    <label htmlFor={`subject-name-${row.id}`} className="sr-only">Subject Name</label>
                    <input
                      id={`subject-name-${row.id}`}
                      required
                      className="input-modern !py-2 !px-3"
                      value={row.subjectName}
                      onChange={(e) => updateRow(row.id, "subjectName", e.target.value)}
                    />
                  </td>
                  <td>
                    <label htmlFor={`marks-${row.id}`} className="sr-only">Marks</label>
                    <input
                      id={`marks-${row.id}`}
                      required
                      type="number"
                      min={0}
                      className="input-modern !py-2 !px-3 w-20"
                      value={row.marksObtained || ""}
                      onChange={(e) => updateRow(row.id, "marksObtained", Number(e.target.value))}
                    />
                  </td>
                  <td>
                    <label htmlFor={`max-marks-${row.id}`} className="sr-only">Max Marks</label>
                    <input
                      id={`max-marks-${row.id}`}
                      required
                      type="number"
                      min={1}
                      className="input-modern !py-2 !px-3 w-20"
                      value={row.maxMarks}
                      onChange={(e) => updateRow(row.id, "maxMarks", Number(e.target.value))}
                    />
                  </td>
                  <td className="font-semibold text-surface-900">{row.grade}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => removeRow(row.id)}
                      disabled={rows.length === 1}
                      className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-30 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-3">
          {rows.map((row, idx) => (
            <div key={row.id} className="card-modern p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-semibold text-surface-500">Row {idx + 1}</span>
                <button
                  type="button"
                  onClick={() => removeRow(row.id)}
                  disabled={rows.length === 1}
                  aria-label={`Remove row ${idx + 1}`}
                  className="p-1 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-30 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-2">
                <input
                  required
                  placeholder="Student ID"
                  className="input-modern"
                  value={row.studentId}
                  onChange={(e) => updateRow(row.id, "studentId", e.target.value)}
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    required
                    placeholder="Subject Code"
                    className="input-modern"
                    value={row.subjectCode}
                    onChange={(e) => updateRow(row.id, "subjectCode", e.target.value)}
                  />
                  <input
                    required
                    placeholder="Subject Name"
                    className="input-modern"
                    value={row.subjectName}
                    onChange={(e) => updateRow(row.id, "subjectName", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    required
                    type="number"
                    min={0}
                    placeholder="Marks"
                    className="input-modern"
                    value={row.marksObtained || ""}
                    onChange={(e) => updateRow(row.id, "marksObtained", Number(e.target.value))}
                  />
                  <input
                    required
                    type="number"
                    min={1}
                    placeholder="Max"
                    className="input-modern"
                    value={row.maxMarks}
                    onChange={(e) => updateRow(row.id, "maxMarks", Number(e.target.value))}
                  />
                  <div className="flex items-center text-sm font-semibold text-surface-900">
                    Grade: {row.grade}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={addRow}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-surface-200 rounded-xl text-sm font-semibold text-surface-700 hover:bg-surface-50 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Row
          </button>
          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className="btn-primary"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Uploading...
              </div>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Submit Results
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
