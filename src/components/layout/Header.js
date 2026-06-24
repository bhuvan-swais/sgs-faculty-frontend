"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Header({ onMenuToggle }) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    window.location.href = "https://staging.sgs.swais.in";
  };

  return (
    <header
      className="sticky top-0 z-30 px-4 sm:px-6 py-3"
      style={{ background: "rgba(248,250,252,0.88)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: "1px solid rgba(99,102,241,0.1)" }}
    >
      <div className="flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button onClick={onMenuToggle} className="p-2 rounded-xl lg:hidden cursor-pointer transition-all" style={{ color: "#94A3B8" }}
            onMouseEnter={e => { e.currentTarget.style.background="#EEF2FF"; e.currentTarget.style.color="#6366F1"; }}
            onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.color="#94A3B8"; }}
            aria-label="Toggle sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="hidden sm:flex items-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold" style={{ background: "#EEF2FF", color: "#6366F1" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              {user?.subject || "Social Studies"}
            </span>
            <span style={{ color: "#CBD5E1" }}>·</span>
            <span className="text-xs font-medium" style={{ color: "#64748B" }}>
              Class {user?.class || "8"}{user?.section ? `-${user.section}` : ""}
            </span>
            <span style={{ color: "#CBD5E1" }}>·</span>
            <span className="flex items-center gap-1 text-xs font-medium" style={{ color: "#64748B" }}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13.5 7a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              {user?.totalStudents || 200} Students
            </span>
            <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: "linear-gradient(135deg,#EEF2FF,#F5F3FF)", color: "#8B5CF6", border: "1px solid #DDD6FE" }}>
              ⚡ AI Active
            </span>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col text-right">
            <p className="text-sm font-semibold leading-tight" style={{ color: "#0F172A", fontFamily: "var(--font-space-grotesk)" }}>
              {user?.name || "Teacher"}
            </p>
            <p className="text-[11px] leading-tight" style={{ color: "#94A3B8" }}>{user?.email || ""}</p>
          </div>

          {/* Avatar with gradient ring */}
          <div className="relative">
            <div className="absolute -inset-0.5 rounded-full ai-gradient opacity-80 blur-[1px]" />
            <div className="relative w-9 h-9 rounded-full ai-gradient flex items-center justify-center text-white text-sm font-bold">
              {user?.avatar || "T"}
            </div>
          </div>

          {/* Logout */}
          <button onClick={handleLogout} className="p-2 rounded-xl cursor-pointer transition-all" style={{ color: "#94A3B8" }}
            onMouseEnter={e => { e.currentTarget.style.color="#EF4444"; e.currentTarget.style.background="#FEF2F2"; }}
            onMouseLeave={e => { e.currentTarget.style.color="#94A3B8"; e.currentTarget.style.background="transparent"; }}
            aria-label="Sign out" title="Sign out"
          >
            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
