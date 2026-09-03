import { NavLink } from "react-router-dom"
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  ClipboardCheck,
  Bell,
  ClipboardList,
  Upload,
  BookOpen,
  CreditCard,
  BarChart3,
} from "lucide-react"
import { isStaffOrAdmin, isAdmin } from "@/lib/api"

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/results", label: "Results", icon: GraduationCap },
  { to: "/students", label: "Students", icon: Users },
  { to: "/attendance", label: "Attendance", icon: ClipboardCheck },
  { to: "/notices", label: "Notices", icon: Bell },
]

const staffItems = [
  { to: "/staff/results", label: "Manage Results", icon: ClipboardList },
  { to: "/staff/upload", label: "Upload Results", icon: Upload },
]

const adminItems = [
  { to: "/admin", label: "Overview", icon: BarChart3 },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/courses", label: "Courses", icon: BookOpen },
  { to: "/admin/fees", label: "Fees", icon: CreditCard },
  { to: "/admin/audit", label: "Audit Log", icon: ClipboardList },
]

export default function Sidebar() {
  return (
    <div className="w-64 bg-surface-950 flex flex-col min-h-screen relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-900/20 via-transparent to-accent-900/10 pointer-events-none" />

      {/* Logo */}
      <div className="relative px-6 py-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary-500/20">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight">IEMCRP</h1>
            <p className="text-[11px] text-white/40 font-medium">College ERP</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `sidebar-item ${isActive ? "sidebar-item-active" : ""}`
            }
          >
            <Icon className="h-[18px] w-[18px]" />
            {label}
          </NavLink>
        ))}

        {isStaffOrAdmin() && (
          <>
            <div className="pt-5 pb-2 px-3 text-[10px] font-semibold text-white/30 uppercase tracking-widest">
              Staff
            </div>
            {staffItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `sidebar-item ${isActive ? "sidebar-item-active" : ""}`
                }
              >
                <Icon className="h-[18px] w-[18px]" />
                {label}
              </NavLink>
            ))}
          </>
        )}

        {isAdmin() && (
          <>
            <div className="pt-5 pb-2 px-3 text-[10px] font-semibold text-white/30 uppercase tracking-widest">
              Admin
            </div>
            {adminItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/admin"}
                className={({ isActive }) =>
                  `sidebar-item ${isActive ? "sidebar-item-active" : ""}`
                }
              >
                <Icon className="h-[18px] w-[18px]" />
                {label}
              </NavLink>
            ))}
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="relative px-6 py-4 border-t border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] text-white/30 font-medium">System Online</span>
        </div>
      </div>
    </div>
  )
}
