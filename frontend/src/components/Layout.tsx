import { NavLink } from "react-router-dom";
import {
  Bot,
  CircleDot,
  FileText,
  Network,
  Search,
} from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col border-r border-slate-200 bg-white">
        <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900">
            <Network size={17} className="text-white" />
          </div>

          <span className="text-lg font-semibold tracking-tight">
            ContextGraph
          </span>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          <NavItem
            to="/overview"
            icon={<CircleDot size={17} />}
          >
            Overview
          </NavItem>

          <NavItem
            to="/explore"
            icon={<Search size={17} />}
          >
            Explore Context
          </NavItem>

          <NavItem
            to="/ask"
            icon={<Bot size={17} />}
          >
            Ask Agent
          </NavItem>

          <NavItem
            to="/docs"
            icon={<FileText size={17} />}
          >
            Documentation
          </NavItem>
        </nav>

        <div className="border-t border-slate-200 p-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Graph connected
          </div>
        </div>
      </aside>

      <main className="ml-64 min-h-screen">
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8">
          <div>
            <p className="text-sm text-slate-500">
              AI Support Intelligence
            </p>
          </div>

          <div className="text-sm text-slate-500">
            ContextGraph
          </div>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function NavItem({
  to,
  icon,
  children,
}: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
          isActive
            ? "bg-gray-300 text-gray-900"
            : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        }`
      }
    >
      {icon}
      {children}
    </NavLink>
  );
}

export default Layout;