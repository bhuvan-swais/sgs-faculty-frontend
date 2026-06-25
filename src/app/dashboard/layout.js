"use client";

/**
 * Dashboard Layout — Shell with Sidebar + Header
 *
 * Wraps all /dashboard/* pages with the navigation chrome.
 * Redirects unauthenticated users to the login page.
 */

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { NotesProvider } from "@/context/NotesContext";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

function DashboardShell({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {}, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-bg min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-text-lighter">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }) {
  return (
    <AuthProvider>
      <NotesProvider>
        <DashboardShell>{children}</DashboardShell>
      </NotesProvider>
    </AuthProvider>
  );
}
