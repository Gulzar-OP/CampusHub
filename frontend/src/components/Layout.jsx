import React from "react";

import {
  Link,
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  Home,
  Search,
  ShoppingBag,
  MessageCircle,
  Bell,
  Settings,
  PlusCircle,
  LogOut,
  GraduationCap,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const nav = [
  ["/", Home, "Home"],
  ["/items?title=lost", Search, "Lost & Found"],
  ["/items?title=sell", ShoppingBag, "Marketplace"],
  ["/discussions", MessageCircle, "Discussions"],
  ["/chat", MessageCircle, "Chat"],
  ["/notifications", Bell, "Notifications"],
  ["/settings", Settings, "Settings"],
];

export default function Layout() {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const location = useLocation();

  const checkActive = (to) => {
    // Home
    if (to === "/") {
      return location.pathname === "/";
    }

    const params = new URLSearchParams(location.search);

    // Lost & Found
    if (to === "/items?title=lost") {
      return (
        location.pathname === "/items" &&
        params.get("title") === "lost"
      );
    }

    // Marketplace
    if (to === "/items?title=sell") {
      return (
        location.pathname === "/items" &&
        params.get("title") === "sell"
      );
    }

    // Other routes
    return location.pathname === to;
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleGlobalSearch = (e) => {
    if (e.key !== "Enter") return;

    const value = e.currentTarget.value.trim();

    if (!value) return;

    navigate(`/items?q=${encodeURIComponent(value)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 lg:flex">

      {/* ================= SIDEBAR ================= */}

      <aside className="hidden min-h-screen w-64 shrink-0 border-r border-gray-200 bg-white lg:fixed lg:left-0 lg:top-0 lg:flex lg:flex-col">

        {/* Brand */}
        <div className="flex h-20 items-center gap-3 border-b border-gray-100 px-6">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <GraduationCap size={24} />
          </div>

          <span className="text-xl font-semibold text-gray-900">
            Campus
            <b className="text-indigo-600">
              Hub
            </b>
          </span>

        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-6">

          {nav.map(([to, Icon, label]) => {
            const active = checkActive(to);

            return (
              <Link
                key={label}
                to={to}
                className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon
                  size={19}
                  className={
                    active
                      ? "text-indigo-600"
                      : "text-gray-400 transition group-hover:text-gray-600"
                  }
                />

                <span>
                  {label}
                </span>

                {active && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-indigo-600" />
                )}
              </Link>
            );
          })}

        </nav>

        {/* Bottom */}
        <div className="space-y-2 border-t border-gray-100 p-4">

          <button
            onClick={() => navigate("/create-item")}
            className="flex w-full items-center gap-3 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            <PlusCircle size={19} />

            Post an Item
          </button>

          {user && (
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-red-50 hover:text-red-600"
            >
              <LogOut size={19} />

              Logout
            </button>
          )}

        </div>

      </aside>

      {/* ================= MAIN ================= */}

      <main className="min-w-0 flex-1 lg:ml-64">

        {/* ================= TOPBAR ================= */}

        <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur-md">

          <div className="flex h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

            {/* Mobile Brand */}
            <Link
              to="/"
              className="flex shrink-0 items-center gap-2 lg:hidden"
            >

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
                <GraduationCap size={21} />
              </div>

              <span className="hidden text-lg font-semibold text-gray-900 sm:block">
                Campus
                <span className="text-indigo-600">
                  Hub
                </span>
              </span>

            </Link>

            {/* Global Search */}
            <div className="relative max-w-xl flex-1">

              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search campus items..."
                onKeyDown={handleGlobalSearch}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
              />

            </div>

            {/* Profile */}
            <button
              onClick={() =>
                navigate(
                  user
                    ? `/profile/${user._id}`
                    : "/login"
                )
              }
              className="flex shrink-0 items-center gap-3 rounded-xl p-1.5 transition hover:bg-gray-50 sm:pr-3"
            >

              {/* Avatar */}
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold uppercase text-white">
                {user?.name?.[0] || "G"}
              </div>

              {/* User info */}
              <div className="hidden text-left sm:block">

                <p className="max-w-[140px] truncate text-sm font-semibold text-gray-900">
                  {user?.name || "Guest User"}
                </p>

                <p className="max-w-[140px] truncate text-xs text-gray-500">
                  {user?.course || "CampusHub"}
                </p>

              </div>

            </button>

          </div>

        </header>

        {/* ================= PAGE CONTENT ================= */}

        <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </div>

        {/* Mobile bottom space */}
        <div className="h-20 lg:hidden" />

      </main>

      {/* ================= MOBILE NAV ================= */}

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white px-2 py-2 shadow-[0_-4px_20px_rgba(0,0,0,0.04)] lg:hidden">

        <div className="mx-auto flex max-w-lg items-center justify-around">

          {[
            ["/", Home, "Home"],
            ["/items?title=lost", Search, "Lost"],
            ["/create-item", PlusCircle, "Post"],
            ["/items?title=sell", ShoppingBag, "Market"],
            ["/chat", MessageCircle, "Chat"],
          ].map(([to, Icon, label]) => {
            const active =
              to === "/create-item"
                ? location.pathname === "/create-item"
                : checkActive(to);

            const isPost = to === "/create-item";

            return (
              <Link
                key={label}
                to={to}
                className={`flex min-w-[55px] flex-col items-center justify-center gap-1 rounded-xl px-2 py-1.5 text-[11px] font-medium transition ${
                  isPost
                    ? "text-indigo-600"
                    : active
                    ? "text-indigo-600"
                    : "text-gray-500"
                }`}
              >

                {isPost ? (
                  <div className="flex h-11 w-11 -translate-y-3 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-200">
                    <Icon size={22} />
                  </div>
                ) : (
                  <Icon size={20} />
                )}

                <span
                  className={
                    isPost
                      ? "-mt-2"
                      : ""
                  }
                >
                  {label}
                </span>

              </Link>
            );
          })}

        </div>

      </nav>

    </div>
  );
}