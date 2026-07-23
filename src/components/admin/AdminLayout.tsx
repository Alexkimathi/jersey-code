"use client";

import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useSupabase } from "@/app/providers";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Tag, FileText, Image, BarChart3, LogOut, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/inventory", label: "Inventory", icon: BarChart3 },
  { href: "/admin/banners", label: "Banners", icon: Image },
  { href: "/admin/promotions", label: "Promotions", icon: Tag },
  { href: "/admin/audit", label: "Audit Log", icon: FileText },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { adminUser, permissions, isLoading, user } = useAdminAuth();
  const { supabase } = useSupabase();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!adminUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">You need to be logged in as an admin.</p>
          <Link href="/admin/login" className="text-blue-600 hover:text-blue-700">
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:static md:inset-auto`}
        >
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <Link href="/admin" className="text-lg font-bold text-gray-900">
              Admin Panel
            </Link>
            <button
              className="md:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
            <div className="mb-3 px-4">
              <p className="text-sm font-medium text-gray-900">
                {adminUser.full_name || "Admin"}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {adminUser.role.replace("_", " ")}
              </p>
              {adminUser.role === "admin" && permissions && (
                <div className="mt-1 text-xs text-gray-400">
                  {permissions.can_create && "Create "}
                  {permissions.can_edit && "Edit "}
                  {permissions.can_hide && "Hide"}
                </div>
              )}
            </div>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                window.location.href = "/admin/login";
              }}
              className="flex items-center space-x-2 text-red-600 hover:text-red-700 px-4 py-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        <main className="flex-1 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
