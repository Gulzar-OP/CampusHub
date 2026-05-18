import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  UserCircle, MapPin, User, Package, TrendingUp,
  BookMarked, Settings, LogOut,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

const menuItems = [
  { icon: User,       label: "My Profile",    to: "/profile",  bg: "rgba(13,148,136,0.1)",  color: "#0d9488", tag: null },
  { icon: Package,    label: "My Listings",   to: "/my-posts", bg: "rgba(99,102,241,0.1)",  color: "#6366f1", tag: null },
  { icon: TrendingUp, label: "Sales History", to: "/sales",    bg: "rgba(245,158,11,0.1)",  color: "#f59e0b", tag: null },
  { icon: BookMarked, label: "Saved Items",   to: "/saved",    bg: "rgba(236,72,153,0.1)",  color: "#ec4899", tag: null },
  { icon: Settings,   label: "Settings",      to: "/settings", bg: "rgba(107,114,128,0.1)", color: "#6b7280", tag: null },
];

export default function ProfileDropdown({ onClose, user, setIsLoggedIn, setUser }) {
  const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  const handleLogout = async () => {
    await axios.post(`${API}/api/auth/logout`, {}, {
      withCredentials: true,
    }).catch(() => {});

    setIsLoggedIn(false);
    setUser(null);
    toast.success("Logged out successfully");
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="absolute right-0 top-full mt-3 w-[300px] z-[200]"
    >
      <div className="dropdown-card">

        {/* Header */}
        <div className="dropdown-header">
          <div className="relative z-10 flex items-center gap-3">
            <div className="relative">
              <div className="w-[52px] h-[52px] rounded-[16px] flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.3)", backdropFilter: "blur(8px)" }}>
                <UserCircle size={30} className="text-white" />
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-white"
              />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-bold leading-tight text-white">
                {user?.name || "Student User"}
              </p>
              <p className="text-[12px] mt-0.5" style={{ color: "rgba(204,251,241,0.8)" }}>
                {user?.email || "student@campus.edu"}
              </p>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(255,255,255,0.15)", color: "rgba(204,251,241,0.95)", border: "1px solid rgba(255,255,255,0.2)", letterSpacing: "0.04em" }}>
                  Verified Student
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(251,191,36,0.2)", color: "#fde68a", border: "1px solid rgba(251,191,36,0.2)", letterSpacing: "0.04em" }}>
                  {user?.rating || "4.9"} stars
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex" style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
          {[
            { label: "Listings", value: user?.listingsCount ?? "0" },
            { label: "Sold",     value: user?.soldCount     ?? "0" },
            { label: "Saved",    value: user?.savedCount    ?? "0" },
          ].map((s) => (
            <div key={s.label} className="stat-pill">
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Location */}
        <div className="px-4 py-2.5 flex items-center gap-2 text-[12px]"
          style={{ borderBottom: "1px solid rgba(0,0,0,0.04)", color: "#6b7280" }}>
          <MapPin size={12} />
          <span>{user?.location || "Main Campus"}</span>
        </div>

        {/* Menu Items */}
        <div className="p-2">
          {menuItems.map(({ icon: Icon, label, to, bg, color, tag }, i) => (
            <motion.div
              key={to}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.04 + i * 0.04, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link to={to} onClick={onClose} className="menu-item">
                <span className="menu-item-icon" style={{ background: bg }}>
                  <Icon size={14} color={color} strokeWidth={2.2} />
                </span>
                <span className="flex-1">{label}</span>
                {tag && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: bg, color }}>
                    {tag}
                  </span>
                )}
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#d1d5db" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Logout */}
        <div className="p-2" style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.28 }}>
            <button
              onClick={handleLogout}
              className="menu-item w-full"
              style={{ color: "#ef4444", background: "none", border: "none", textAlign: "left" }}
            >
              <span className="menu-item-icon" style={{ background: "rgba(239,68,68,0.08)" }}>
                <LogOut size={14} color="#ef4444" strokeWidth={2.2} />
              </span>
              <span>Log out</span>
            </button>
          </motion.div>
        </div>

      </div>
    </motion.div>
  );
}