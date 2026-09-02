import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Component, type ReactNode } from "react"
import { getAuthToken, isStaffOrAdmin, isAdmin } from "./lib/api"
import Layout from "./components/layout/Layout"
import Dashboard from "./pages/Dashboard"
import Login from "./pages/Login"
import Results from "./pages/Results"
import Students from "./pages/Students"
import Attendance from "./pages/Attendance"
import Notices from "./pages/Notices"
import NotFound from "./pages/NotFound"
import ErrorPage from "./pages/ErrorPage"
import ManageResults from "./pages/staff/ManageResults"
import UploadResults from "./pages/staff/UploadResults"
import CreateExam from "./pages/staff/CreateExam"
import AdminDashboard from "./pages/admin/AdminDashboard"
import ManageUsers from "./pages/admin/ManageUsers"
import CreateUser from "./pages/admin/CreateUser"
import AuditLog from "./pages/admin/AuditLog"

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: string }> {
  state = { hasError: false, error: "" };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message };
  }

  render() {
    if (this.state.hasError) return <ErrorPage message={this.state.error} />;
    return this.props.children;
  }
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!getAuthToken()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function StaffRoute({ children }: { children: React.ReactNode }) {
  if (!getAuthToken()) {
    return <Navigate to="/login" replace />;
  }
  if (!isStaffOrAdmin()) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  if (!getAuthToken()) {
    return <Navigate to="/login" replace />;
  }
  if (!isAdmin()) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          element={
            <ErrorBoundary>
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            </ErrorBoundary>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/results" element={<Results />} />
          <Route path="/students" element={<Students />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/notices" element={<Notices />} />
          <Route
            element={
              <ErrorBoundary>
                <StaffRoute>
                  <Layout />
                </StaffRoute>
              </ErrorBoundary>
            }
          >
            <Route path="/staff/results" element={<ManageResults />} />
            <Route path="/staff/upload" element={<UploadResults />} />
            <Route path="/staff/create-exam" element={<CreateExam />} />
          </Route>
          <Route
            element={
              <ErrorBoundary>
                <AdminRoute>
                  <Layout />
                </AdminRoute>
              </ErrorBoundary>
            }
          >
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/admin/create-user" element={<CreateUser />} />
            <Route path="/admin/audit" element={<AuditLog />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
