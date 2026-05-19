import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  UserCircle,
  Settings,
  Bell,
  HelpCircle,
  LogOut,
  ShoppingBag,
  ChevronRight,
} from "lucide-react";

export default function ProfileDropdown({ onClose, user, setIsLoggedIn, setUser }) {
  const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  const handleLogout = async () => {
    try {
      await fetch(`${API}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setIsLoggedIn(false);
      setUser(null);
      onClose();
    }
  };

  const items = [
    { to: "/profile", icon: UserCircle, label: "My Profile" },
    { to: "/my-posts", icon: ShoppingBag, label: "My Posts" },
    { to: "/settings", icon: Settings, label: "Settings" },
    { to: "/notifications", icon: Bell, label: "Notifications" },
    { to: "/help", icon: HelpCircle, label: "Help Center" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.98 }}
      transition={{ duration: 0.16 }}
      className="absolute right-0 top-[54px] z-50 w-[320px] overflow-hidden rounded-[22px] border border-white/60 bg-white/95 shadow-[0_24px_80px_rgba(0,0,0,0.18)] backdrop-blur-2xl"
    >
      <div className="bg-gradient-to-br from-teal-600 to-teal-800 px-5 py-5 text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">
            <UserCircle size={26} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-[15px] font-semibold">
              {user?.name || "User"}
            </p>
            <p className="truncate text-[12px] text-white/75">
              {user?.email || "student@campushub.com"}
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="rounded-2xl bg-white/10 px-3 py-2 text-center">
            <div className="text-[14px] font-bold">12</div>
            <div className="text-[10px] uppercase tracking-wider text-white/70">
              Posts
            </div>
          </div>
          <div className="rounded-2xl bg-white/10 px-3 py-2 text-center">
            <div className="text-[14px] font-bold">4</div>
            <div className="text-[10px] uppercase tracking-wider text-white/70">
              Orders
            </div>
          </div>
          <div className="rounded-2xl bg-white/10 px-3 py-2 text-center">
            <div className="text-[14px] font-bold">98%</div>
            <div className="text-[10px] uppercase tracking-wider text-white/70">
              Rating
            </div>
          </div>
        </div>
      </div>

      <div className="p-3">
        <div className="mb-2 px-2 text-[10.5px] font-bold uppercase tracking-[0.18em] text-slate-400">
          Account
        </div>

        <div className="flex flex-col gap-1">
          {items.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              onClick={onClose}
              className="group flex items-center gap-3 rounded-2xl px-3 py-3 text-[13.5px] font-medium text-slate-700 transition-all hover:bg-teal-500/6 hover:text-teal-700"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 text-slate-500 transition-all group-hover:bg-teal-500/10 group-hover:text-teal-600">
                <Icon size={18} />
              </span>
              <span className="flex-1">{label}</span>
              <ChevronRight size={15} className="text-slate-300" />
            </Link>
          ))}
        </div>

        <div className="my-3 h-px bg-slate-100" />

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-[13.5px] font-semibold text-red-600 transition-all hover:bg-red-50"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <LogOut size={18} />
          </span>
          <span className="flex-1 text-left">Logout</span>
        </button>
      </div>
    </motion.div>
  );
}