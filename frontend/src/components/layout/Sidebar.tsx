import { NavLink } from "react-router-dom"
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  ClipboardCheck,
  Bell,
  Settings,
  ClipboardList,
  Upload,
  Shield,
} from "lucide-react"
import { isStaffOrAdmin, isAdmin } from "@/lib/api"

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/results", label: "Results", icon: GraduationCap },
  { to: "/students", label: "Students", icon: Users },
  { to: "/attendance", label: "Attendance", icon: ClipboardCheck },
  { to: "/notices", label: "Notices", icon: Bell },
  { to: "/settings", label: "Settings", icon: Settings },
]

const staffItems = [
  { to: "/staff/results", label: "Manage Results", icon: ClipboardList },
  { to: "/staff/upload", label: "Upload Results", icon: Upload },
]

const adminItems = [
  { to: "/admin", label: "Admin Dashboard", icon: Shield },
  { to: "/admin/users", label: "Manage Users", icon: Users },
  { to: "/admin/audit", label: "Audit Log", icon: ClipboardList },
]

export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-900 text-gray-100 flex flex-col min-h-screen">
      <div className="px-6 py-5 border-b border-gray-800">
        <h1 className="text-lg font-semibold tracking-tight">IEMCRP</h1>
        <p className="text-xs text-gray-400 mt-0.5">College ERP System</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                isActive
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:bg-gray-800/50 hover:text-gray-200"
              }`
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
        {isStaffOrAdmin() && (
          <>
            <div className="pt-3 pb-1 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Staff
            </div>
            {staffItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                    isActive
                      ? "bg-gray-800 text-white"
                      : "text-gray-400 hover:bg-gray-800/50 hover:text-gray-200"
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </>
        )}
        {isAdmin() && (
          <>
            <div className="pt-3 pb-1 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Admin
            </div>
            {adminItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/admin"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                    isActive
                      ? "bg-gray-800 text-white"
                      : "text-gray-400 hover:bg-gray-800/50 hover:text-gray-200"
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </>
        )}
      </nav>

      <div className="px-6 py-4 border-t border-gray-800 text-xs text-gray-500">
        IEMCRP v1.0
      </div>
    </div>
  )
}
