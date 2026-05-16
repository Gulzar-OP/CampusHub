import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  Menu, X, Search, ShoppingBag, Bell, UserCircle,
  ChevronDown, Settings, BookMarked, LogOut, User, Package,
  Sparkles, TrendingUp, MapPin,
} from "lucide-react";

/* ─── Fonts ──────────────────────────────────────────────────────── */
const FontImport = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@500;600;700;800&family=Manrope:wght@300;400;500;600;700&display=swap');
    
    :root {
      --nav-h: 68px;
    }

    .nav-link-pill {
      position: relative;
      font-family: 'Manrope', sans-serif;
      font-size: 13.5px;
      font-weight: 500;
      letter-spacing: 0.01em;
      padding: 7px 14px;
      border-radius: 100px;
      transition: all 0.2s ease;
      color: #5a6470;
    }
    .nav-link-pill:hover { color: #0f766e; background: rgba(13,148,136,0.07); }
    .nav-link-pill.active {
      color: #0f766e;
      background: rgba(13,148,136,0.1);
      font-weight: 600;
    }
    .nav-link-pill.active::after {
      content: '';
      position: absolute;
      bottom: 4px;
      left: 50%;
      transform: translateX(-50%);
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: #0d9488;
    }

    .icon-btn {
      position: relative;
      width: 42px; height: 42px;
      border-radius: 14px;
      display: flex; align-items: center; justify-content: center;
      background: rgba(248,250,252,0.9);
      border: 1px solid rgba(0,0,0,0.06);
      color: #4b5563;
      cursor: pointer;
      transition: all 0.18s ease;
    }
    .icon-btn:hover {
      background: rgba(13,148,136,0.08);
      border-color: rgba(13,148,136,0.2);
      color: #0d9488;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(13,148,136,0.12);
    }

    .search-bar {
      display: flex;
      align-items: center;
      gap: 10px;
      background: rgba(248,250,252,0.95);
      border: 1.5px solid rgba(0,0,0,0.07);
      border-radius: 14px;
      padding: 0 16px;
      height: 42px;
      width: 240px;
      transition: all 0.25s ease;
    }
    .search-bar:focus-within {
      width: 280px;
      border-color: rgba(13,148,136,0.35);
      background: white;
      box-shadow: 0 0 0 4px rgba(13,148,136,0.07);
    }
    .search-bar input {
      background: transparent;
      border: none;
      outline: none;
      font-family: 'Manrope', sans-serif;
      font-size: 13px;
      color: #374151;
      width: 100%;
    }
    .search-bar input::placeholder { color: #9ca3af; }

    .profile-btn {
      display: flex; align-items: center; gap: 8px;
      height: 42px; padding: 0 14px 0 6px;
      border-radius: 14px;
      background: rgba(248,250,252,0.9);
      border: 1.5px solid rgba(0,0,0,0.07);
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: 'Manrope', sans-serif;
    }
    .profile-btn:hover, .profile-btn.open {
      background: rgba(13,148,136,0.07);
      border-color: rgba(13,148,136,0.25);
      box-shadow: 0 4px 16px rgba(13,148,136,0.1);
    }
    .profile-avatar {
      width: 30px; height: 30px; border-radius: 10px;
      background: linear-gradient(135deg, #0d9488, #0f766e);
      display: flex; align-items: center; justify-content: center;
    }

    .dropdown-card {
      background: rgba(255,255,255,0.92);
      backdrop-filter: blur(32px);
      -webkit-backdrop-filter: blur(32px);
      border: 1px solid rgba(255,255,255,0.7);
      border-radius: 20px;
      box-shadow: 
        0 32px 80px rgba(0,0,0,0.13),
        0 8px 24px rgba(0,0,0,0.07),
        inset 0 1px 0 rgba(255,255,255,0.9);
      overflow: hidden;
    }

    .dropdown-header {
      padding: 20px;
      background: linear-gradient(145deg, #0f766e 0%, #115e59 50%, #0c4a46 100%);
      position: relative;
      overflow: hidden;
    }
    .dropdown-header::before {
      content: '';
      position: absolute;
      top: -30px; right: -30px;
      width: 100px; height: 100px;
      border-radius: 50%;
      background: rgba(255,255,255,0.08);
    }
    .dropdown-header::after {
      content: '';
      position: absolute;
      bottom: -20px; left: -20px;
      width: 80px; height: 80px;
      border-radius: 50%;
      background: rgba(255,255,255,0.05);
    }

    .stat-pill {
      display: flex; flex-direction: column; align-items: center;
      padding: 10px 0;
      flex: 1;
    }
    .stat-pill + .stat-pill { border-left: 1px solid rgba(0,0,0,0.05); }
    .stat-value { font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 700; color: #111827; }
    .stat-label { font-family: 'Manrope', sans-serif; font-size: 10px; font-weight: 500; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.06em; margin-top: 2px; }

    .menu-item {
      display: flex; align-items: center; gap: 11px;
      padding: 9px 10px;
      border-radius: 12px;
      font-family: 'Manrope', sans-serif;
      font-size: 13.5px;
      font-weight: 500;
      color: #374151;
      cursor: pointer;
      transition: all 0.15s ease;
      text-decoration: none;
    }
    .menu-item:hover { background: rgba(0,0,0,0.035); }
    .menu-item-icon {
      width: 32px; height: 32px; border-radius: 9px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
      transition: all 0.15s ease;
    }

    /* Noise texture overlay */
    .noise::after {
      content: '';
      position: absolute; inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
      pointer-events: none;
      z-index: 0;
    }

    /* Scrolled state */
    .navbar-scrolled {
      box-shadow: 0 2px 32px rgba(0,0,0,0.08);
      background: rgba(255,255,255,0.95) !important;
    }

    /* Badge */
    .badge {
      position: absolute;
      top: -4px; right: -4px;
      min-width: 18px; height: 18px;
      border-radius: 100px;
      background: #ef4444;
      border: 2px solid white;
      color: white;
      font-family: 'Manrope', sans-serif;
      font-size: 9px;
      font-weight: 700;
      display: flex; align-items: center; justify-content: center;
      padding: 0 3px;
    }

    .mobile-nav-item {
      display: flex; align-items: center; gap: 12px;
      padding: 13px 16px;
      border-radius: 14px;
      background: rgba(248,250,252,0.9);
      border: 1px solid rgba(0,0,0,0.05);
      font-family: 'Manrope', sans-serif;
      font-size: 14px;
      font-weight: 500;
      color: #374151;
      text-decoration: none;
      transition: all 0.18s ease;
    }
    .mobile-nav-item:hover, .mobile-nav-item.active {
      background: rgba(13,148,136,0.07);
      border-color: rgba(13,148,136,0.2);
      color: #0f766e;
    }
  `}</style>
);

/* ─── Animated Active Underline ──────────────────────────────────── */
const NavLink = ({ to, children, onClick }) => {
  const { pathname } = useLocation();
  const isActive = pathname === to;
  return (
    <Link to={to} onClick={onClick} className={`nav-link-pill ${isActive ? "active" : ""}`}>
      {children}
    </Link>
  );
};

/* ─── Profile Dropdown ───────────────────────────────────────────── */
const menuItems = [
  { icon: User,      label: "My Profile",    to: "/profile",   bg: "rgba(13,148,136,0.1)",   color: "#0d9488",  tag: null },
  { icon: Package,   label: "My Listings",   to: "/my-posts",  bg: "rgba(99,102,241,0.1)",   color: "#6366f1",  tag: "12" },
  { icon: TrendingUp,label: "Sales History",  to: "/sales",     bg: "rgba(245,158,11,0.1)",   color: "#f59e0b",  tag: null },
  { icon: BookMarked,label: "Saved Items",    to: "/saved",     bg: "rgba(236,72,153,0.1)",   color: "#ec4899",  tag: "8" },
  { icon: Settings,  label: "Settings",       to: "/settings",  bg: "rgba(107,114,128,0.1)",  color: "#6b7280",  tag: null },
];

function ProfileDropdown({ onClose }) {
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
            {/* Avatar */}
            <div className="relative">
              <div
                className="w-[52px] h-[52px] rounded-[16px] flex items-center justify-center"
                style={{
                  background: "rgba(255,255,255,0.15)",
                  border: "1.5px solid rgba(255,255,255,0.3)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <UserCircle size={30} className="text-white" />
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-white"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 700, color: "white", lineHeight: 1.2 }}>
                Student User
              </p>
              <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 12, color: "rgba(204,251,241,0.8)", marginTop: 2 }}>
                student@campus.edu
              </p>
              <div className="flex items-center gap-1.5 mt-2">
                <span style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: 10, fontWeight: 600,
                  padding: "3px 8px",
                  borderRadius: 100,
                  background: "rgba(255,255,255,0.15)",
                  color: "rgba(204,251,241,0.95)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  letterSpacing: "0.04em",
                }}>
                  🎓 Verified Student
                </span>
                <span style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: 10, fontWeight: 600,
                  padding: "3px 8px",
                  borderRadius: 100,
                  background: "rgba(251,191,36,0.2)",
                  color: "#fde68a",
                  border: "1px solid rgba(251,191,36,0.2)",
                  letterSpacing: "0.04em",
                }}>
                  ⭐ 4.9
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex" style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
          {[{ label: "Listings", value: "12" }, { label: "Sold", value: "5" }, { label: "Saved", value: "8" }].map((s) => (
            <div key={s.label} className="stat-pill">
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Location pill */}
        <div className="px-4 py-2.5" style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
          <div className="flex items-center gap-2" style={{ fontFamily: "'Manrope', sans-serif", fontSize: 12, color: "#6b7280" }}>
            <MapPin size={12} />
            <span>Main Campus · Block C, Room 204</span>
          </div>
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
                <span style={{ flex: 1 }}>{label}</span>
                {tag && (
                  <span style={{
                    fontSize: 10, fontWeight: 700,
                    padding: "2px 7px", borderRadius: 100,
                    background: bg, color,
                  }}>{tag}</span>
                )}
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#d1d5db" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Divider + Logout */}
        <div className="p-2" style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.28 }}>
            <Link to="/logout" onClick={onClose} className="menu-item" style={{ color: "#ef4444" }}>
              <span className="menu-item-icon" style={{ background: "rgba(239,68,68,0.08)" }}>
                <LogOut size={14} color="#ef4444" strokeWidth={2.2} />
              </span>
              <span>Log out</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main Navbar ────────────────────────────────────────────────── */
export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const profileRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/auth/me", { credentials: "include" });
        setIsLoggedIn(res.ok);
      } catch { setIsLoggedIn(false); }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setIsOpen(false); }, [location]);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/marketplace", label: "Marketplace" },
    { to: "/about", label: "About" },
    { to: "/my-posts", label: "My Posts" },
  ];

  return (
    <>
      <FontImport />
      <motion.nav
        className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "navbar-scrolled" : ""}`}
        style={{
          background: scrolled ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.82)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderBottom: scrolled ? "1px solid rgba(0,0,0,0.06)" : "1px solid rgba(255,255,255,0.4)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between" style={{ height: 68 }}>

            {/* ── Logo ── */}
            <Link to="/" className="flex items-center gap-3 shrink-0 group" style={{ textDecoration: "none" }}>
              <motion.div
                whileHover={{ scale: 1.05, rotate: -3 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <div
                  className="w-10 h-10 rounded-[13px] overflow-hidden flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #0d9488, #0f766e)",
                    boxShadow: "0 4px 16px rgba(13,148,136,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
                  }}
                >
                  <Sparkles size={20} color="white" />
                </div>
              </motion.div>
              <div className="hidden sm:block">
                <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 17, fontWeight: 700, color: "#111827", letterSpacing: "-0.02em", lineHeight: 1 }}>
                  Campus<span style={{ color: "#0d9488" }}>Hub</span>
                </h1>
                <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 11, color: "#9ca3af", marginTop: 2, fontWeight: 500 }}>
                  Student marketplace
                </p>
              </div>
            </Link>

            {/* ── Desktop Nav Pills ── */}
            <div className="hidden md:flex items-center gap-0.5" style={{
              background: "rgba(248,250,252,0.8)",
              border: "1px solid rgba(0,0,0,0.06)",
              borderRadius: 16,
              padding: "4px",
            }}>
              {navLinks.map(({ to, label }) => (
                <NavLink key={to} to={to}>{label}</NavLink>
              ))}
            </div>

            {/* ── Search ── */}
            {/* <div className="hidden lg:block search-bar">
              <Search size={15} color={searchFocused ? "#0d9488" : "#9ca3af"} strokeWidth={2.2} />
              <input
                placeholder="Search items..."
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
              <kbd style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: 10, color: "#d1d5db",
                background: "rgba(0,0,0,0.04)",
                padding: "2px 5px", borderRadius: 5,
                border: "1px solid rgba(0,0,0,0.07)",
                flexShrink: 0,
              }}>⌘K</kbd>
            </div> */}

            {/* ── Right Actions ── */}
            <div className="hidden md:flex items-center gap-2">

              {/* Bell */}
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="icon-btn">
                <Bell size={18} strokeWidth={2} />
                <span className="badge">2</span>
              </motion.button>

              {/* Cart */}
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="icon-btn">
                <ShoppingBag size={18} strokeWidth={2} />
              </motion.button>

              {/* Profile / Login */}
              {isLoggedIn ? (
                <div className="relative" ref={profileRef}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowProfile((p) => !p)}
                    className={`profile-btn ${showProfile ? "open" : ""}`}
                  >
                    <div className="profile-avatar">
                      <UserCircle size={17} color="white" />
                    </div>
                    <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 13.5, fontWeight: 600, color: "#374151" }}
                          className="hidden lg:inline">
                      Profile
                    </span>
                    <motion.span animate={{ rotate: showProfile ? 180 : 0 }} transition={{ duration: 0.22 }}>
                      <ChevronDown size={13} color="#9ca3af" />
                    </motion.span>
                  </motion.button>

                  <AnimatePresence>
                    {showProfile && <ProfileDropdown onClose={() => setShowProfile(false)} />}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/login"
                    style={{
                      display: "flex", alignItems: "center", gap: 6,
                      height: 42, padding: "0 18px",
                      borderRadius: 12,
                      background: "linear-gradient(135deg, #0d9488, #0f766e)",
                      color: "white",
                      fontFamily: "'Manrope', sans-serif", fontSize: 13.5, fontWeight: 600,
                      textDecoration: "none",
                      boxShadow: "0 4px 16px rgba(13,148,136,0.3), inset 0 1px 0 rgba(255,255,255,0.15)",
                      letterSpacing: "0.01em",
                    }}
                  >
                    Sign in
                  </Link>
                </motion.div>
              )}
            </div>

            {/* ── Hamburger ── */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="md:hidden icon-btn"
              onClick={() => setIsOpen((p) => !p)}
              style={{ borderRadius: 14 }}
            >
              <AnimatePresence mode="wait">
                {isOpen
                  ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}><X size={20} /></motion.div>
                  : <motion.div key="m" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}><Menu size={20} /></motion.div>
                }
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 md:hidden"
              style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(4px)" }}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-[300px] md:hidden"
              style={{
                background: "rgba(255,255,255,0.97)",
                backdropFilter: "blur(32px)",
                borderLeft: "1px solid rgba(0,0,0,0.07)",
                boxShadow: "-20px 0 60px rgba(0,0,0,0.12)",
                display: "flex", flexDirection: "column",
                overflowY: "auto",
              }}
            >
              {/* Mobile header */}
              <div className="flex items-center justify-between p-5" style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, color: "#111827" }}>
                  Campus<span style={{ color: "#0d9488" }}>Hub</span>
                </div>
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setIsOpen(false)} className="icon-btn" style={{ width: 36, height: 36 }}>
                  <X size={18} />
                </motion.button>
              </div>

              {/* Search */}
              <div className="p-4" style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                <div className="search-bar" style={{ width: "100%" }}>
                  <Search size={15} color="#9ca3af" strokeWidth={2.2} />
                  <input placeholder="Search items..." />
                </div>
              </div>

              {/* Nav links */}
              <div className="p-4 flex flex-col gap-2">
                <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 10.5, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4, paddingLeft: 4 }}>
                  Navigation
                </p>
                {navLinks.map(({ to, label }, i) => (
                  <motion.div
                    key={to}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.05 }}
                  >
                    <Link
                      to={to}
                      onClick={() => setIsOpen(false)}
                      className={`mobile-nav-item ${location.pathname === to ? "active" : ""}`}
                    >
                      {label}
                      {location.pathname === to && (
                        <span style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "#0d9488" }} />
                      )}
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Utility row */}
              <div className="px-4 pb-4 flex gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 h-11 rounded-[13px] bg-gray-50 border border-gray-100"
                  style={{ fontFamily: "'Manrope', sans-serif", fontSize: 13, fontWeight: 500, color: "#4b5563" }}>
                  <Bell size={16} /> Alerts
                  <span style={{ marginLeft: 2, fontSize: 10, fontWeight: 700, padding: "1px 5px", borderRadius: 100, background: "#ef4444", color: "white" }}>2</span>
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 h-11 rounded-[13px] bg-gray-50 border border-gray-100"
                  style={{ fontFamily: "'Manrope', sans-serif", fontSize: 13, fontWeight: 500, color: "#4b5563" }}>
                  <ShoppingBag size={16} /> Cart
                </button>
              </div>

              {/* CTA */}
              <div className="px-4 mt-auto mb-8">
                <Link
                  to={isLoggedIn ? "/profile" : "/login"}
                  onClick={() => setIsOpen(false)}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    height: 48, borderRadius: 14,
                    background: "linear-gradient(135deg, #0d9488, #0f766e)",
                    color: "white",
                    fontFamily: "'Manrope', sans-serif", fontSize: 14, fontWeight: 700,
                    textDecoration: "none",
                    boxShadow: "0 6px 20px rgba(13,148,136,0.3)",
                  }}
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