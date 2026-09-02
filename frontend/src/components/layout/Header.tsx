import { LogOut, User } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function Header() {
  const navigate = useNavigate()

  return (
    <header className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-6">
      <span className="text-sm font-medium text-gray-700">
        Institute of Engineering & Management
      </span>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="h-7 w-7 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="h-4 w-4 text-gray-500" />
          </div>
          <span>Admin</span>
        </div>
        <button
          onClick={() => navigate("/login")}
          aria-label="Sign out"
          className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  )
}
