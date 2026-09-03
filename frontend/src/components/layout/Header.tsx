import { LogOut, User, ChevronDown } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { getUserRole, clearAuthToken } from "@/lib/api"
import { useState, useRef, useEffect } from "react"

function getRoleLabel(role: string | null) {
  switch (role) {
    case "ADMIN": return "Administrator"
    case "STAFF": return "Staff"
    case "STUDENT": return "Student"
    default: return "User"
  }
}

function getRoleColor(role: string | null) {
  switch (role) {
    case "ADMIN": return "bg-primary-100 text-primary-700"
    case "STAFF": return "bg-amber-100 text-amber-700"
    case "STUDENT": return "bg-emerald-100 text-emerald-700"
    default: return "bg-surface-100 text-surface-700"
  }
}

export default function Header() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const role = getUserRole()

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  function handleLogout() {
    clearAuthToken()
    navigate("/login")
  }

  return (
    <header className="h-16 border-b border-surface-200/60 bg-white/80 backdrop-blur-xl flex items-center justify-between px-6">
      <div>
        <h2 className="text-sm font-semibold text-surface-900">Institute of Engineering & Management</h2>
      </div>

      <div className="flex items-center gap-3" ref={ref}>
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 pl-1 pr-3 py-1 rounded-xl hover:bg-surface-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          >
            <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center shadow-sm shadow-primary-500/20">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-medium text-surface-900 leading-tight">{getRoleLabel(role)}</p>
              <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold ${getRoleColor(role)}`}>
                {role}
              </span>
            </div>
            <ChevronDown className={`h-4 w-4 text-surface-400 transition-transform ${open ? "rotate-180" : ""}`} />
          </button>

          {open && (
            <div className="absolute right-0 top-full mt-2 w-48 py-2 bg-white rounded-xl shadow-xl shadow-surface-900/10 border border-surface-100 animate-slide-in z-50">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
