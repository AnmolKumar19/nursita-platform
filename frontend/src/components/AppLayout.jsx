import { useState } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Footer from "./Footer.jsx";

const AppLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Closed by default (w-0)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const navLinks = [
    {
      label: "Home",
      path: "/",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 00-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      roles: ["student", "instructor", "admin"],
    },
    {
      label: "All Batches",
      path: "/courses",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      roles: ["student", "instructor", "admin"],
    },
    {
      label: "My Enrolled Batches",
      path: "/dashboard",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        </svg>
      ),
      roles: ["student"],
    },
    {
      label: "Batch Workspace",
      path: "/instructor",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      roles: ["instructor", "admin"],
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="h-screen flex flex-col font-sans bg-slate-50 text-slate-800 overflow-hidden">
      {/* TOP HEADER BAR */}
      <header className="h-16 bg-[rgb(11,19,36)] border-b border-slate-800 shrink-0 px-4 lg:px-6 flex items-center justify-between z-40 shadow-md">
        <div className="flex items-center gap-4">
          {/* Toggle Sidebar Button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 text-slate-300 hover:text-amber-400 rounded-lg hover:bg-slate-800 transition-colors"
            title="Toggle Menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Logo Branding */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-extrabold text-lg shadow-sm">
              🩺
            </div>
            <span className="text-xl font-extrabold tracking-tight text-white">
              Nursita<span className="text-amber-500">.</span>
            </span>
          </Link>
        </div>

        {/* PROFILE MENU */}
        <div className="relative">
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-3 p-1.5 rounded-full hover:bg-slate-800 transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 font-bold flex items-center justify-center text-sm">
              {user?.name ? user.name[0].toUpperCase() : "U"}
            </div>
            <div className="hidden sm:block text-left pr-2">
              <p className="text-xs font-bold text-slate-100 leading-tight">{user?.name || "User Account"}</p>
              <p className="text-[10px] font-semibold tracking-wider text-amber-400 uppercase leading-tight">
                {user?.role || "Student"}
              </p>
            </div>
            <svg className="w-4 h-4 text-slate-400 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                <p className="text-sm font-bold text-slate-800 truncate">{user?.email}</p>
              </div>

              <div className="pt-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <svg className="w-4 h-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* BODY AREA */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* SIDEBAR: Hidden completely when closed, slides out when tapped */}
        <aside
          className={`bg-[rgb(11,19,36)] border-r border-slate-800 transition-all duration-300 flex flex-col shrink-0 h-full overflow-hidden ${
            isSidebarOpen ? "w-64 opacity-100" : "w-0 opacity-0 border-none"
          }`}
        >
          <nav className="flex-1 p-3 space-y-1.5 w-64">
            {navLinks
              .filter((link) => link.roles.includes(user?.role || "student"))
              .map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                        : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                    }`}
                  >
                    <span className="shrink-0">{link.icon}</span>
                    <span className="truncate">{link.label}</span>
                  </Link>
                );
              })}
          </nav>

          <div className="p-4 m-3 bg-slate-900/60 rounded-2xl border border-slate-800 text-center w-58">
            <p className="text-[11px] font-medium text-slate-400">Nursita Portal</p>
            <p className="text-[10px] text-amber-400 font-semibold mt-0.5">🟢 Systems Operational</p>
          </div>
        </aside>

        {/* MAIN PAGE AREA */}
        <main className="flex-1 overflow-y-auto flex flex-col justify-between bg-slate-50">
          <div className="flex-1">
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;