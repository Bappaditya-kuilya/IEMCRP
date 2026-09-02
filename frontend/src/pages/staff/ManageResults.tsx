import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStaffExams } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Manage Results</h1>
        <button
          onClick={() => navigate("/staff/create-exam")}
          className="h-10 px-4 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Create Exam
        </button>
      </div>

      {error && <p className="text-sm text-red-600" role="alert" aria-live="polite">{error}</p>}

      {exams.length === 0 && !error && (
        <p className="text-sm text-slate-600">No exams found. Create one to get started.</p>
      )}

      {/* Desktop table */}
      <Card className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm text-left" aria-label="Exams">
          <thead>
            <tr className="border-b border-slate-200">
              <th scope="col" className="py-3 px-4 font-medium text-slate-600">Name</th>
              <th scope="col" className="py-3 px-4 font-medium text-slate-600">Type</th>
              <th scope="col" className="py-3 px-4 font-medium text-slate-600">Semester</th>
              <th scope="col" className="py-3 px-4 font-medium text-slate-600">Year</th>
              <th scope="col" className="py-3 px-4 font-medium text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {exams.map((exam) => (
              <tr key={exam.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-3 px-4 text-slate-900">{exam.name}</td>
                <td className="py-3 px-4">
                  <Badge variant={(typeColor[exam.examType] as any) || "active"}>
                    {exam.examType}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-slate-700">{exam.semester}</td>
                <td className="py-3 px-4 text-slate-700">{exam.academicYear}</td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => navigate(`/staff/upload?examId=${exam.id}`)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                  >
                    Upload Results
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {exams.map((exam) => (
          <Card key={exam.id}>
            <div className="flex justify-between items-start mb-2">
              <p className="font-medium text-slate-900">{exam.name}</p>
              <Badge variant={(typeColor[exam.examType] as any) || "active"}>
                {exam.examType}
              </Badge>
            </div>
            <p className="text-sm text-slate-600">Sem {exam.semester} &middot; {exam.academicYear}</p>
            <button
              onClick={() => navigate(`/staff/upload?examId=${exam.id}`)}
              className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
            >
              Upload Results
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}
