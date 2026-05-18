import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, Search, ShoppingBag, Bell, UserCircle,
  ChevronDown, Sparkles,
} from "lucide-react";
import ProfileDropdown from "./ProfileDropdown";

/* ─── Styles ─────────────────────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    :root { --nav-h: 68px; }

    .nav-link-pill {
      position: relative;
      font-size: 13.5px; font-weight: 500;
      letter-spacing: 0.01em;
      padding: 7px 14px; border-radius: 100px;
      transition: all 0.2s ease; color: #5a6470;
    }
    .nav-link-pill:hover { color: #0f766e; background: rgba(13,148,136,0.07); }
    .nav-link-pill.active { color: #0f766e; background: rgba(13,148,136,0.1); font-weight: 600; }
    .nav-link-pill.active::after {
      content: ''; position: absolute;
      bottom: 4px; left: 50%; transform: translateX(-50%);
      width: 4px; height: 4px; border-radius: 50%; background: #0d9488;
    }

    .icon-btn {
      position: relative; width: 42px; height: 42px; border-radius: 14px;
      display: flex; align-items: center; justify-content: center;
      background: rgba(248,250,252,0.9); border: 1px solid rgba(0,0,0,0.06);
      color: #4b5563; cursor: pointer; transition: all 0.18s ease;
    }
    .icon-btn:hover {
      background: rgba(13,148,136,0.08); border-color: rgba(13,148,136,0.2);
      color: #0d9488; transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(13,148,136,0.12);
    }

    .search-bar {
      display: flex; align-items: center; gap: 10px;
      background: rgba(248,250,252,0.95); border: 1.5px solid rgba(0,0,0,0.07);
      border-radius: 14px; padding: 0 16px; height: 42px; width: 240px;
      transition: all 0.25s ease;
    }
    .search-bar:focus-within {
      width: 280px; border-color: rgba(13,148,136,0.35);
      background: white; box-shadow: 0 0 0 4px rgba(13,148,136,0.07);
    }
    .search-bar input {
      background: transparent; border: none; outline: none;
      font-size: 13px; color: #374151; width: 100%;
    }
    .search-bar input::placeholder { color: #9ca3af; }

    .profile-btn {
      display: flex; align-items: center; gap: 8px;
      height: 42px; padding: 0 14px 0 6px; border-radius: 14px;
      background: rgba(248,250,252,0.9); border: 1.5px solid rgba(0,0,0,0.07);
      cursor: pointer; transition: all 0.2s ease;
    }
    .profile-btn:hover, .profile-btn.open {
      background: rgba(13,148,136,0.07); border-color: rgba(13,148,136,0.25);
      box-shadow: 0 4px 16px rgba(13,148,136,0.1);
    }
    .profile-avatar {
      width: 30px; height: 30px; border-radius: 10px;
      background: linear-gradient(135deg, #0d9488, #0f766e);
      display: flex; align-items: center; justify-content: center;
    }

    .dropdown-card {
      background: rgba(255,255,255,0.92);
      backdrop-filter: blur(32px); -webkit-backdrop-filter: blur(32px);
      border: 1px solid rgba(255,255,255,0.7); border-radius: 20px;
      box-shadow: 0 32px 80px rgba(0,0,0,0.13), 0 8px 24px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.9);
      overflow: hidden;
    }

    .dropdown-header {
      padding: 20px;
      background: linear-gradient(145deg, #0f766e 0%, #115e59 50%, #0c4a46 100%);
      position: relative; overflow: hidden;
    }
    .dropdown-header::before {
      content: ''; position: absolute; top: -30px; right: -30px;
      width: 100px; height: 100px; border-radius: 50%; background: rgba(255,255,255,0.08);
    }
    .dropdown-header::after {
      content: ''; position: absolute; bottom: -20px; left: -20px;
      width: 80px; height: 80px; border-radius: 50%; background: rgba(255,255,255,0.05);
    }

    .stat-pill { display: flex; flex-direction: column; align-items: center; padding: 10px 0; flex: 1; }
    .stat-pill + .stat-pill { border-left: 1px solid rgba(0,0,0,0.05); }
    .stat-value { font-size: 17px; font-weight: 700; color: #111827; }
    .stat-label { font-size: 10px; font-weight: 500; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.06em; margin-top: 2px; }

    .menu-item {
      display: flex; align-items: center; gap: 11px;
      padding: 9px 10px; border-radius: 12px;
      font-size: 13.5px; font-weight: 500;
      color: #374151; cursor: pointer; transition: all 0.15s ease; text-decoration: none;
    }
    .menu-item:hover { background: rgba(0,0,0,0.035); }
    .menu-item-icon {
      width: 32px; height: 32px; border-radius: 9px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; transition: all 0.15s ease;
    }

    .navbar-scrolled { box-shadow: 0 2px 32px rgba(0,0,0,0.08); background: rgba(255,255,255,0.95) !important; }

    .badge {
      position: absolute; top: -4px; right: -4px;
      min-width: 18px; height: 18px; border-radius: 100px;
      background: #ef4444; border: 2px solid white; color: white;
      font-size: 9px; font-weight: 700;
      display: flex; align-items: center; justify-content: center; padding: 0 3px;
    }

    .mobile-nav-item {
      display: flex; align-items: center; gap: 12px;
      padding: 13px 16px; border-radius: 14px;
      background: rgba(248,250,252,0.9); border: 1px solid rgba(0,0,0,0.05);
      font-size: 14px; font-weight: 500;
      color: #374151; text-decoration: none; transition: all 0.18s ease;
    }
    .mobile-nav-item:hover, .mobile-nav-item.active {
      background: rgba(13,148,136,0.07); border-color: rgba(13,148,136,0.2); color: #0f766e;
    }
  `}</style>
);

/* ─── Nav Link ───────────────────────────────────────────────────── */
const NavLink = ({ to, children }) => {
  const { pathname } = useLocation();
  const isActive = pathname === to;
  return (
    <Link to={to} className={`nav-link-pill ${isActive ? "active" : ""}`}>
      {children}
    </Link>
  );
};

/* ─── Navbar ─────────────────────────────────────────────────────── */
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
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setShowProfile(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => { setIsOpen(false); }, [location]);

  const navLinks = [
    { to: "/",            label: "Home"        },
    { to: "/marketplace", label: "Marketplace" },
    { to: "/about",       label: "About"       },
    { to: "/my-posts",    label: "My Posts"    },
  ];

  return (
    <>
      <GlobalStyles />
      <motion.nav
        className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "navbar-scrolled" : ""}`}
        style={{
          background: scrolled ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.82)",
          backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
          borderBottom: scrolled ? "1px solid rgba(0,0,0,0.06)" : "1px solid rgba(255,255,255,0.4)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between" style={{ height: 68 }}>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 shrink-0" style={{ textDecoration: "none" }}>
              <motion.div whileHover={{ scale: 1.05, rotate: -3 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
                <div className="w-10 h-10 rounded-[13px] flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #0d9488, #0f766e)", boxShadow: "0 4px 16px rgba(13,148,136,0.3)" }}>
                  <Sparkles size={20} color="white" />
                </div>
              </motion.div>
              <div className="hidden sm:block">
                <h1 className="text-[17px] font-bold tracking-tight leading-none" style={{ color: "#111827" }}>
                  Campus<span style={{ color: "#0d9488" }}>Hub</span>
                </h1>
                <p className="text-[11px] font-medium mt-0.5" style={{ color: "#9ca3af" }}>
                  Student marketplace
                </p>
              </div>
            </Link>

            {/* Desktop nav pills */}
            <div className="hidden md:flex items-center gap-0.5"
              style={{ background: "rgba(248,250,252,0.8)", border: "1px solid rgba(0,0,0,0.06)", borderRadius: 16, padding: "4px" }}>
              {navLinks.map(({ to, label }) => (
                <NavLink key={to} to={to}>{label}</NavLink>
              ))}
            </div>

            {/* Right actions */}
            <div className="hidden md:flex items-center gap-2">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="icon-btn">
                <Bell size={18} strokeWidth={2} />
                <span className="badge">2</span>
              </motion.button>

              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="icon-btn">
                <ShoppingBag size={18} strokeWidth={2} />
              </motion.button>

              {isLoggedIn ? (
                <div className="relative" ref={profileRef}>
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => setShowProfile((p) => !p)}
                    className={`profile-btn ${showProfile ? "open" : ""}`}
                  >
                    <div className="profile-avatar">
                      <UserCircle size={17} color="white" />
                    </div>
                    <span className="hidden lg:inline text-[13.5px] font-semibold" style={{ color: "#374151" }}>
                      {user?.name?.split(" ")[0] || "Profile"}
                    </span>
                    <motion.span animate={{ rotate: showProfile ? 180 : 0 }} transition={{ duration: 0.22 }}>
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
                  <Link to="/login"
                    className="flex items-center gap-1.5 text-[13.5px] font-semibold text-white no-underline"
                    style={{
                      height: 42, padding: "0 18px", borderRadius: 12,
                      background: "linear-gradient(135deg, #0d9488, #0f766e)",
                      boxShadow: "0 4px 16px rgba(13,148,136,0.3)",
                    }}>
                    Sign in
                  </Link>
                </motion.div>
              )}
            </div>

            {/* Hamburger */}
            <motion.button whileTap={{ scale: 0.9 }} className="md:hidden icon-btn"
              onClick={() => setIsOpen((p) => !p)}>
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

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 md:hidden"
              style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(4px)" }}
            />
            <motion.div
              initial={{ opacity: 0, x: "100%" }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-[300px] md:hidden flex flex-col overflow-y-auto"
              style={{
                background: "rgba(255,255,255,0.97)", backdropFilter: "blur(32px)",
                borderLeft: "1px solid rgba(0,0,0,0.07)", boxShadow: "-20px 0 60px rgba(0,0,0,0.12)",
              }}
            >
              {/* Mobile header */}
              <div className="flex items-center justify-between p-5" style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                <span className="text-[16px] font-bold" style={{ color: "#111827" }}>
                  Campus<span style={{ color: "#0d9488" }}>Hub</span>
                </span>
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
                <p className="text-[10.5px] font-bold uppercase tracking-widest mb-1 pl-1" style={{ color: "#9ca3af" }}>
                  Navigation
                </p>
                {navLinks.map(({ to, label }, i) => (
                  <motion.div key={to} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 + i * 0.05 }}>
                    <Link to={to} onClick={() => setIsOpen(false)}
                      className={`mobile-nav-item ${location.pathname === to ? "active" : ""}`}>
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
                <button className="flex-1 flex items-center justify-center gap-2 h-11 rounded-[13px] bg-gray-50 border border-gray-100 text-[13px] font-medium text-gray-600">
                  <Bell size={16} /> Alerts
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-500 text-white">2</span>
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 h-11 rounded-[13px] bg-gray-50 border border-gray-100 text-[13px] font-medium text-gray-600">
                  <ShoppingBag size={16} /> Cart
                </button>
              </div>

              {/* CTA */}
              <div className="px-4 mt-auto mb-8">
                <Link to={isLoggedIn ? "/profile" : "/login"} onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 text-[14px] font-bold text-white no-underline"
                  style={{
                    height: 48, borderRadius: 14,
                    background: "linear-gradient(135deg, #0d9488, #0f766e)",
                    boxShadow: "0 6px 20px rgba(13,148,136,0.3)",
                  }}>
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