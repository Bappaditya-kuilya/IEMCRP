import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getStaffExams, uploadResults } from "@/lib/api";
import { Card } from "@/components/ui/Card";

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
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900">Upload Results</h1>

      {error && <p className="text-sm text-red-600" role="alert" aria-live="polite">{error}</p>}
      {success && <p className="text-sm text-green-600" role="status" aria-live="polite">{success}</p>}

      <div>
        <label htmlFor="exam-select" className="block text-sm font-medium text-slate-700 mb-1">Select Exam</label>
        <select
          id="exam-select"
          required
          className="w-full h-10 border border-slate-300 rounded-md px-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
        <Card className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm text-left" aria-label="Upload results">
            <thead>
              <tr className="border-b border-slate-200">
                <th scope="col" className="py-3 px-4 font-medium text-slate-600">Student ID</th>
                <th scope="col" className="py-3 px-4 font-medium text-slate-600">Subject Code</th>
                <th scope="col" className="py-3 px-4 font-medium text-slate-600">Subject Name</th>
                <th scope="col" className="py-3 px-4 font-medium text-slate-600">Marks</th>
                <th scope="col" className="py-3 px-4 font-medium text-slate-600">Max</th>
                <th scope="col" className="py-3 px-4 font-medium text-slate-600">Grade</th>
                <th scope="col" className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-slate-100">
                  <td className="py-2 px-4">
                    <label htmlFor={`student-id-${row.id}`} className="sr-only">Student ID</label>
                    <input
                      id={`student-id-${row.id}`}
                      required
                      className="w-full h-8 border border-slate-300 rounded px-2 text-sm"
                      value={row.studentId}
                      onChange={(e) => updateRow(row.id, "studentId", e.target.value)}
                    />
                  </td>
                  <td className="py-2 px-4">
                    <label htmlFor={`subject-code-${row.id}`} className="sr-only">Subject Code</label>
                    <input
                      id={`subject-code-${row.id}`}
                      required
                      className="w-full h-8 border border-slate-300 rounded px-2 text-sm"
                      value={row.subjectCode}
                      onChange={(e) => updateRow(row.id, "subjectCode", e.target.value)}
                    />
                  </td>
                  <td className="py-2 px-4">
                    <label htmlFor={`subject-name-${row.id}`} className="sr-only">Subject Name</label>
                    <input
                      id={`subject-name-${row.id}`}
                      required
                      className="w-full h-8 border border-slate-300 rounded px-2 text-sm"
                      value={row.subjectName}
                      onChange={(e) => updateRow(row.id, "subjectName", e.target.value)}
                    />
                  </td>
                  <td className="py-2 px-4">
                    <label htmlFor={`marks-${row.id}`} className="sr-only">Marks</label>
                    <input
                      id={`marks-${row.id}`}
                      required
                      type="number"
                      min={0}
                      className="w-20 h-8 border border-slate-300 rounded px-2 text-sm"
                      value={row.marksObtained || ""}
                      onChange={(e) => updateRow(row.id, "marksObtained", Number(e.target.value))}
                    />
                  </td>
                  <td className="py-2 px-4">
                    <label htmlFor={`max-marks-${row.id}`} className="sr-only">Max Marks</label>
                    <input
                      id={`max-marks-${row.id}`}
                      required
                      type="number"
                      min={1}
                      className="w-20 h-8 border border-slate-300 rounded px-2 text-sm"
                      value={row.maxMarks}
                      onChange={(e) => updateRow(row.id, "maxMarks", Number(e.target.value))}
                    />
                  </td>
                  <td className="py-3 px-4 text-slate-700 font-medium">{row.grade}</td>
                  <td className="py-2 px-4">
                    <button
                      type="button"
                      onClick={() => removeRow(row.id)}
                      disabled={rows.length === 1}
                      className="text-red-500 hover:text-red-700 disabled:opacity-30 text-sm"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* Mobile cards */}
        <div className="md:hidden space-y-3">
          {rows.map((row, idx) => (
            <Card key={row.id}>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs text-slate-500">Row {idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeRow(row.id)}
                      disabled={rows.length === 1}
                      aria-label={`Remove row ${idx + 1}`}
                      className="text-red-500 hover:text-red-700 disabled:opacity-30 text-xs"
                    >
                  Remove
                </button>
              </div>
              <div className="space-y-2">
                <label htmlFor={`m-student-id-${row.id}`} className="sr-only">Student ID</label>
                <input
                  id={`m-student-id-${row.id}`}
                  required
                  placeholder="Student ID"
                  className="w-full h-10 border border-slate-300 rounded-md px-3 text-sm"
                  value={row.studentId}
                  onChange={(e) => updateRow(row.id, "studentId", e.target.value)}
                />
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor={`m-subject-code-${row.id}`} className="sr-only">Subject Code</label>
                    <input
                      id={`m-subject-code-${row.id}`}
                      required
                      placeholder="Subject Code"
                      className="w-full h-10 border border-slate-300 rounded-md px-3 text-sm"
                      value={row.subjectCode}
                      onChange={(e) => updateRow(row.id, "subjectCode", e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor={`m-subject-name-${row.id}`} className="sr-only">Subject Name</label>
                    <input
                      id={`m-subject-name-${row.id}`}
                      required
                      placeholder="Subject Name"
                      className="w-full h-10 border border-slate-300 rounded-md px-3 text-sm"
                      value={row.subjectName}
                      onChange={(e) => updateRow(row.id, "subjectName", e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label htmlFor={`m-marks-${row.id}`} className="sr-only">Marks</label>
                    <input
                      id={`m-marks-${row.id}`}
                      required
                      type="number"
                      min={0}
                      placeholder="Marks"
                      className="w-full h-10 border border-slate-300 rounded-md px-3 text-sm"
                      value={row.marksObtained || ""}
                      onChange={(e) => updateRow(row.id, "marksObtained", Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label htmlFor={`m-max-${row.id}`} className="sr-only">Max Marks</label>
                    <input
                      id={`m-max-${row.id}`}
                      required
                      type="number"
                      min={1}
                      placeholder="Max"
                      className="w-full h-10 border border-slate-300 rounded-md px-3 text-sm"
                      value={row.maxMarks}
                      onChange={(e) => updateRow(row.id, "maxMarks", Number(e.target.value))}
                    />
                  </div>
                  <div className="h-10 flex items-center text-sm font-medium text-slate-700">
                    {row.grade}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={addRow}
            className="h-10 px-4 border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Add Row
          </button>
          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className="h-10 px-6 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
          >
            {loading ? "Uploading..." : "Submit Results"}
          </button>
        </div>
      </form>
    </div>
  );
}
