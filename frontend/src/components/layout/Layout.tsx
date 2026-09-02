import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"
import Header from "./Header"
import { SkipLink } from "@/components/a11y/SkipLink"

export default function Layout() {
  return (
    <div className="flex min-h-screen">
      <SkipLink />
      <nav aria-label="Main navigation">
        <Sidebar />
      </nav>
      <div className="flex-1 flex flex-col">
        <header>
          <Header />
        </header>
        <main id="main-content" className="flex-1 p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
