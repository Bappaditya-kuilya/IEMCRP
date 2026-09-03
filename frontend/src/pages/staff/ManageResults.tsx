import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStaffExams } from "@/lib/api";
import { Badge } from "@/components/ui/Badge";
import { ClipboardList, Plus, Upload } from "lucide-react";

interface Exam {
  id: string;
  name: string;
  examType: string;
  semester: number;
  academicYear: string;
}

export default function ManageResults() {
  const navigate = useNavigate();
  const [exams, setExams] = useState<Exam[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getStaffExams()
      .then((data: any) => setExams(data.exams || data))
      .catch((err: Error) => setError(err.message));
  }, []);

  const typeColor: Record<string, string> = {
    MIDTERM: "pending",
    FINAL: "fail",
    INTERNAL: "active",
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Manage Results</h1>
          <p className="text-sm text-surface-500 mt-1">{exams.length} exams found</p>
        </div>
        <button
          onClick={() => navigate("/staff/create-exam")}
          className="btn-primary"
        >
          <Plus className="h-4 w-4" />
          Create Exam
        </button>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700" role="alert" aria-live="polite">
          {error}
        </div>
      )}

      {/* Empty state */}
      {exams.length === 0 && !error && (
        <div className="card-modern p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-surface-100 flex items-center justify-center mx-auto mb-3">
            <ClipboardList className="h-6 w-6 text-surface-400" />
          </div>
          <p className="text-sm text-surface-500">No exams found. Create one to get started.</p>
        </div>
      )}

      {/* Desktop table */}
      <div className="card-modern hidden md:block overflow-hidden">
        <table className="table-modern" aria-label="Exams">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Type</th>
              <th scope="col">Semester</th>
              <th scope="col">Year</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {exams.map((exam) => (
              <tr key={exam.id}>
                <td className="font-medium text-surface-900">{exam.name}</td>
                <td>
                  <Badge variant={(typeColor[exam.examType] as any) || "active"}>
                    {exam.examType}
                  </Badge>
                </td>
                <td className="text-surface-600">Sem {exam.semester}</td>
                <td className="text-surface-600">{exam.academicYear}</td>
                <td>
                  <button
                    onClick={() => navigate(`/staff/upload?examId=${exam.id}`)}
                    className="inline-flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-semibold"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    Upload
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {exams.map((exam) => (
          <div key={exam.id} className="card-modern p-4">
            <div className="flex justify-between items-start mb-2">
              <p className="font-semibold text-surface-900">{exam.name}</p>
              <Badge variant={(typeColor[exam.examType] as any) || "active"}>
                {exam.examType}
              </Badge>
            </div>
            <p className="text-sm text-surface-500">Sem {exam.semester} · {exam.academicYear}</p>
            <button
              onClick={() => navigate(`/staff/upload?examId=${exam.id}`)}
              className="mt-3 inline-flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-semibold"
            >
              <Upload className="h-3.5 w-3.5" />
              Upload Results
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
