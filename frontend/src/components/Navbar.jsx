import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Search,
  ShoppingBag,
  Bell,
  UserCircle,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import ProfileDropdown from "./ProfileDropdown";

const NavLink = ({ to, children }) => {
  const { pathname } = useLocation();
  const isActive = pathname === to;

  return (
    <Link
      to={to}
      className={`relative px-3.5 py-1.5 rounded-full text-[13.5px] font-medium tracking-[0.01em] transition-all duration-200 ${
        isActive
          ? "text-teal-700 bg-teal-500/10 font-semibold"
          : "text-slate-500 hover:text-teal-700 hover:bg-teal-500/5"
      }`}
    >
      {children}
      {isActive && (
        <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-teal-500" />
      )}
    </Link>
  );
};

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const profileRef = useRef(null);
  const location = useLocation();
  const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${API}/api/auth/me`, { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setIsLoggedIn(true);
          setUser(data);
        } else if (res.status === 401 || res.status === 403) {
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch {
        console.warn("Auth check failed");
      }
    };
    checkAuth();
  }, [API]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/marketplace", label: "Marketplace" },
    { to: "/about", label: "About" },
  ];

  return (
    <>
      <motion.nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "shadow-[0_2px_32px_rgba(0,0,0,0.08)] border-b border-black/5" : "border-b border-white/40"
        }`}
        style={{
          background: scrolled ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.82)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-[68px] items-center justify-between">
            <Link to="/" className="flex shrink-0 items-center gap-3 no-underline">
              <motion.div
                whileHover={{ scale: 1.05, rotate: -3 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-[13px] bg-gradient-to-br from-teal-500 to-teal-700 shadow-[0_4px_16px_rgba(13,148,136,0.3)]">
                  <Sparkles size={20} color="white" />
                </div>
              </motion.div>

              <div className="hidden sm:block">
                <h1 className="text-[17px] font-bold tracking-tight leading-none text-slate-900">
                  Campus<span className="text-teal-600">Hub</span>
                </h1>
                <p className="mt-0.5 text-[11px] font-medium text-slate-400">
                  Student marketplace
                </p>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-0.5 rounded-2xl border border-black/5 bg-slate-50/80 p-1">
              {navLinks.map(({ to, label }) => (
                <NavLink key={to} to={to}>
                  {label}
                </NavLink>
              ))}
              {isLoggedIn && (
                <NavLink to="/my-posts">My Posts</NavLink>
              )}
            </div>

            <div className="hidden md:flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative flex h-[42px] w-[42px] items-center justify-center rounded-[14px] border border-black/5 bg-slate-50/90 text-slate-600 transition-all hover:-translate-y-px hover:border-teal-500/20 hover:bg-teal-500/10 hover:text-teal-600 hover:shadow-[0_4px_12px_rgba(13,148,136,0.12)]"
              >
                <Bell size={18} strokeWidth={2} />
                <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-white bg-red-500 px-1 text-[9px] font-bold text-white">
                  2
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex h-[42px] w-[42px] items-center justify-center rounded-[14px] border border-black/5 bg-slate-50/90 text-slate-600 transition-all hover:-translate-y-px hover:border-teal-500/20 hover:bg-teal-500/10 hover:text-teal-600 hover:shadow-[0_4px_12px_rgba(13,148,136,0.12)]"
              >
                <ShoppingBag size={18} strokeWidth={2} />
              </motion.button>

              {isLoggedIn ? (
                <div className="relative" ref={profileRef}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowProfile((p) => !p)}
                    className={`flex h-[42px] items-center gap-2 rounded-[14px] border px-[14px] pl-1.5 transition-all ${
                      showProfile
                        ? "border-teal-500/25 bg-teal-500/10 shadow-[0_4px_16px_rgba(13,148,136,0.1)]"
                        : "border-black/5 bg-slate-50/90"
                    }`}
                  >
                    <div className="flex h-[30px] w-[30px] items-center justify-center rounded-[10px] bg-gradient-to-br from-teal-500 to-teal-700">
                      <UserCircle size={17} color="white" />
                    </div>
                    <span className="hidden lg:inline text-[13.5px] font-semibold text-slate-700">
                      {user?.name?.split(" ")[0] || "Profile"}
                    </span>
                    <motion.span
                      animate={{ rotate: showProfile ? 180 : 0 }}
                      transition={{ duration: 0.22 }}
                    >
                      <ChevronDown size={13} color="#9ca3af" />
                    </motion.span>
                  </motion.button>

                  <AnimatePresence>
                    {showProfile && (
                      <ProfileDropdown
                        onClose={() => setShowProfile(false)}
                        user={user}
                        setIsLoggedIn={setIsLoggedIn}
                        setUser={setUser}
                      />
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/login"
                    className="flex h-[42px] items-center gap-1.5 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 px-[18px] text-[13.5px] font-semibold text-white no-underline shadow-[0_4px_16px_rgba(13,148,136,0.3)]"
                  >
                    Sign in
                  </Link>
                </motion.div>
              )}
            </div>

            <motion.button
              whileTap={{ scale: 0.9 }}
              className="md:hidden flex h-[42px] w-[42px] items-center justify-center rounded-[14px] border border-black/5 bg-slate-50/90 text-slate-600"
              onClick={() => setIsOpen((p) => !p)}
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="x"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X size={20} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="m"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu size={20} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
            />

            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed right-0 top-0 bottom-0 z-50 flex w-[300px] flex-col overflow-y-auto border-l border-black/5 bg-white/97 backdrop-blur-[32px] md:hidden"
              style={{
                boxShadow: "-20px 0 60px rgba(0,0,0,0.12)",
                background: "rgba(255,255,255,0.97)",
              }}
            >
              <div className="flex items-center justify-between border-b border-black/5 p-5">
                <span className="text-[16px] font-bold text-slate-900">
                  Campus<span className="text-teal-600">Hub</span>
                </span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-[14px] border border-black/5 bg-slate-50/90 text-slate-600"
                >
                  <X size={18} />
                </motion.button>
              </div>

              <div className="border-b border-black/5 p-4">
                <div className="flex h-[42px] items-center gap-2 rounded-[14px] border border-black/10 bg-slate-50/95 px-4">
                  <Search size={15} color="#9ca3af" strokeWidth={2.2} />
                  <input
                    placeholder="Search items..."
                    className="w-full bg-transparent text-[13px] text-slate-700 outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 p-4">
                <p className="mb-1 pl-1 text-[10.5px] font-bold uppercase tracking-widest text-slate-400">
                  Navigation
                </p>
                {/* FIX: Build mobile links list dynamically, including My Posts only when logged in */}
                {[
                  ...navLinks,
                  ...(isLoggedIn ? [{ to: "/my-posts", label: "My Posts" }] : []),
                ].map(({ to, label }, i) => (
                  <motion.div
                    key={to}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.05 }}
                  >
                    <Link
                      to={to}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 rounded-[14px] border px-4 py-[13px] text-[14px] font-medium no-underline transition-all ${
                        location.pathname === to
                          ? "border-teal-500/20 bg-teal-500/10 text-teal-700"
                          : "border-black/5 bg-slate-50/90 text-slate-700 hover:border-teal-500/20 hover:bg-teal-500/10 hover:text-teal-700"
                      }`}
                    >
                      {label}
                      {location.pathname === to && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-teal-500" />
                      )}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="flex gap-3 px-4 pb-4">
                <button className="flex h-11 flex-1 items-center justify-center gap-2 rounded-[13px] border border-gray-100 bg-gray-50 text-[13px] font-medium text-gray-600">
                  <Bell size={16} /> Alerts
                  <span className="rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                    2
                  </span>
                </button>
                <button className="flex h-11 flex-1 items-center justify-center gap-2 rounded-[13px] border border-gray-100 bg-gray-50 text-[13px] font-medium text-gray-600">
                  <ShoppingBag size={16} /> Cart
                </button>
              </div>

              <div className="mt-auto mb-8 px-4">
                <Link
                  to={isLoggedIn ? "/profile" : "/login"}
                  onClick={() => setIsOpen(false)}
                  className="flex h-12 items-center justify-center gap-2 rounded-[14px] bg-gradient-to-br from-teal-500 to-teal-700 text-[14px] font-bold text-white no-underline shadow-[0_6px_20px_rgba(13,148,136,0.3)]"
                >
                  <UserCircle size={18} />
                  {isLoggedIn ? "My Profile" : "Sign In"}
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}