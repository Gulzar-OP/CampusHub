import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaGithub, FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { CiLocationOn } from "react-icons/ci";
import { Globe, Sparkles, ArrowUpRight, Heart, ShoppingBag, Search } from "lucide-react";

/* ─── Animated grid canvas ───────────────────────────────────────── */
function GridCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w, h, cols, rows;

    const resize = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
      cols = Math.ceil(w / 48);
      rows = Math.ceil(h / 48);
    };
    resize();
    window.addEventListener("resize", resize);

    let frame = 0;
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++) {
          const x = c * 48;
          const y = r * 48;
          const pulse = Math.sin(frame * 0.015 + r * 0.4 + c * 0.3);
          const alpha = 0.025 + pulse * 0.02;
          ctx.strokeStyle = `rgba(45,212,191,${Math.max(0, alpha)})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.rect(x, y, 48, 48);
          ctx.stroke();
        }
      }
      frame++;
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <canvas
      ref={ref}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", opacity: 0.6 }}
    />
  );
}

/* ─── Social button ──────────────────────────────────────────────── */
function Social({ href, icon, label, hoverBg }) {
  return (
    <a
      href={href}
      aria-label={label}
      style={{
        width: 42, height: 42, borderRadius: 13,
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.09)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "rgba(255,255,255,0.55)",
        textDecoration: "none",
        transition: "all 0.22s ease",
        position: "relative",
        overflow: "hidden",
        "--hbg": hoverBg,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = hoverBg;
        e.currentTarget.style.borderColor = "transparent";
        e.currentTarget.style.color = "white";
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = `0 8px 24px ${hoverBg}55`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(255,255,255,0.05)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)";
        e.currentTarget.style.color = "rgba(255,255,255,0.55)";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {icon}
    </a>
  );
}

/* ─── Nav link with hover line ───────────────────────────────────── */
function FLink({ href, children, external }) {
  const base = {
    display: "inline-flex", alignItems: "center", gap: 4,
    fontSize: 13.5, fontWeight: 500,
    color: "rgba(255,255,255,0.45)",
    textDecoration: "none",
    transition: "color 0.18s ease",
    position: "relative",
  };
  const props = {
    style: base,
    onMouseEnter: (e) => { e.currentTarget.style.color = "#2dd4bf"; },
    onMouseLeave: (e) => { e.currentTarget.style.color = "rgba(255,255,255,0.45)"; },
  };
  if (external) return <a href={href} {...props}>{children}{external && <ArrowUpRight size={11} style={{ opacity: 0.6 }} />}</a>;
  return <Link to={href} {...props}>{children}</Link>;
}

/* ─── Feature chip ───────────────────────────────────────────────── */
function Chip({ icon: Icon, label, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 12px", borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", fontSize: 12.5, fontWeight: 600, color: "rgba(255,255,255,0.5)", fontFamily: "'Manrope',sans-serif" }}>
      <span style={{ width: 22, height: 22, borderRadius: 7, background: `${color}22`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={12} color={color} strokeWidth={2.2} />
      </span>
      {label}
    </div>
  );
}

/* ─── Contact row ────────────────────────────────────────────────── */
function Contact({ icon, text, href }) {
  return (
    <a
      href={href || "#"}
      style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "inherit" }}
      onMouseEnter={(e) => e.currentTarget.querySelector("span.ct").style.color = "#2dd4bf"}
      onMouseLeave={(e) => e.currentTarget.querySelector("span.ct").style.color = "rgba(255,255,255,0.45)"}
    >
      <span style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.4)", flexShrink: 0 }}>
        {icon}
      </span>
      <span className="ct" style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.45)", transition: "color 0.18s" }}>{text}</span>
    </a>
  );
}

/* ─── Footer ─────────────────────────────────────────────────────── */
export default function Footer() {
  return (
    <footer
      style={{
        position: "relative",
        overflow: "hidden",
        background: "#050c10",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        fontFamily: "'Manrope', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Manrope:wght@400;500;600;700&display=swap');
      `}</style>

      {/* Glow blobs */}
      <div style={{ position: "absolute", top: -120, left: -80, width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle,rgba(13,148,136,0.14) 0%,transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: -60, right: -100, width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle,rgba(99,102,241,0.09) 0%,transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: 600, height: 200, borderRadius: "50%", background: "radial-gradient(ellipse,rgba(13,148,136,0.07) 0%,transparent 70%)", pointerEvents: "none" }} />

      {/* Animated grid */}
      <GridCanvas />

      {/* ── Top CTA banner ── */}
      <div style={{ position: "relative", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "36px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 100, background: "rgba(13,148,136,0.12)", border: "1px solid rgba(13,148,136,0.25)", marginBottom: 8 }}>
              <Sparkles size={10} color="#2dd4bf" />
              <span style={{ fontSize: 11, fontWeight: 700, color: "#2dd4bf", letterSpacing: "0.06em" }}>STUDENT-EXCLUSIVE PLATFORM</span>
            </div>
            <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(18px,3vw,26px)", fontWeight: 800, color: "white", margin: 0, letterSpacing: "-0.02em", lineHeight: 1.2 }}>
              Ready to buy or sell on campus?
            </h3>
            <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.4)", marginTop: 5, fontWeight: 500 }}>Join 2,400+ students already using CampusHub.</p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link
              to="/marketplace"
              style={{ display: "flex", alignItems: "center", gap: 7, height: 44, padding: "0 20px", borderRadius: 13, background: "linear-gradient(135deg,#0d9488,#0f766e)", color: "white", fontWeight: 700, fontSize: 13.5, textDecoration: "none", boxShadow: "0 4px 20px rgba(13,148,136,0.35)", transition: "all .18s" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(13,148,136,0.4)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 20px rgba(13,148,136,0.35)"; }}
            >
              <ShoppingBag size={15} /> Browse Listings
            </Link>
            <Link
              to="/my-posts"
              style={{ display: "flex", alignItems: "center", gap: 7, height: 44, padding: "0 20px", borderRadius: 13, background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.8)", fontWeight: 700, fontSize: 13.5, textDecoration: "none", border: "1px solid rgba(255,255,255,0.1)", transition: "all .18s" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "white"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "rgba(255,255,255,0.8)"; }}
            >
              Post an Item
            </Link>
          </div>
        </div>
      </div>

      {/* ── Main grid ── */}
      <div style={{ position: "relative", maxWidth: 1280, margin: "0 auto", padding: "52px 32px 40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 40 }}>

          {/* Brand col */}
          <div style={{ gridColumn: "span 2", minWidth: 240 }}>
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: "linear-gradient(135deg,#0d9488,#0f766e)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px rgba(13,148,136,0.4), inset 0 1px 0 rgba(255,255,255,0.15)" }}>
                <Sparkles size={20} color="white" />
              </div>
              <div>
                <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 800, color: "white", margin: 0, letterSpacing: "-0.02em" }}>
                  Campus<span style={{ color: "#2dd4bf" }}>Hub</span>
                </h2>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", margin: "2px 0 0", fontWeight: 500 }}>Student marketplace</p>
              </div>
            </div>

            <p style={{ fontSize: 13.5, lineHeight: 1.75, color: "rgba(255,255,255,0.38)", maxWidth: 300, fontWeight: 400, marginBottom: 22 }}>
              A smart campus marketplace for students to buy, sell, and manage lost & found items — exclusively within your college community.
            </p>

            {/* Feature chips */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 24 }}>
              <Chip icon={ShoppingBag} label="Buy & Sell" color="#0d9488" />
              <Chip icon={Search} label="Lost & Found" color="#6366f1" />
              <Chip icon={Heart} label="Save Favourites" color="#ec4899" />
            </div>

            {/* Socials */}
            <div style={{ display: "flex", gap: 8 }}>
              <Social href="#" icon={<FaWhatsapp size={17} />} label="WhatsApp" hoverBg="#25d366" />
              <Social href="#" icon={<FaInstagram size={17} />} label="Instagram" hoverBg="#e1306c" />
              <Social href="#" icon={<FaFacebook size={17} />} label="Facebook" hoverBg="#1877f2" />
              <Social href="#" icon={<FaGithub size={17} />} label="GitHub" hoverBg="#333" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontFamily: "'Syne',sans-serif", fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 18 }}>Navigation</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
              <FLink href="/">Home</FLink>
              <FLink href="/marketplace">Marketplace</FLink>
              <FLink href="/lost-found">Lost & Found</FLink>
              <FLink href="/my-posts">My Posts</FLink>
              <FLink href="/about">About</FLink>
              <FLink href="/contact">Contact</FLink>
            </div>
          </div>

          {/* Features */}
          <div>
            <h4 style={{ fontFamily: "'Syne',sans-serif", fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 18 }}>Features</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
              {["Buy & Sell Items", "Lost & Found Posts", "Saved Listings", "Verified Students", "Secure Auth", "Campus-Only Access"].map((f) => (
                <span key={f} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13.5, fontWeight: 500, color: "rgba(255,255,255,0.38)" }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#0d9488", flexShrink: 0, opacity: 0.7 }} />
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontFamily: "'Syne',sans-serif", fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 18 }}>Contact</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Contact icon={<HiOutlineMail size={16} />} text="support@campushub.com" href="mailto:support@campushub.com" />
              <Contact icon={<CiLocationOn size={17} />} text="West Bengal, India" />
              <Contact icon={<Globe size={15} />} text="campushub.com" href="https://campushub.com" />
            </div>

            {/* Status pill */}
            <div style={{ marginTop: 24, display: "inline-flex", alignItems: "center", gap: 7, padding: "8px 13px", borderRadius: 11, background: "rgba(5,150,105,0.1)", border: "1px solid rgba(5,150,105,0.2)" }}>
              <span style={{ position: "relative", width: 8, height: 8 }}>
                <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#10b981", animation: "ping 1.4s ease infinite" }} />
                <span style={{ position: "relative", display: "block", width: 8, height: 8, borderRadius: "50%", background: "#10b981" }} />
              </span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#2dd4bf" }}>All systems operational</span>
            </div>
          </div>
        </div>

        {/* ── Divider ── */}
        <div style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.22)", fontWeight: 500, margin: 0 }}>
            © {new Date().getFullYear()} CampusHub · Built with{" "}
            <Heart size={10} style={{ display: "inline", verticalAlign: -1 }} color="#ec4899" fill="#ec4899" />
            {" "}for students
          </p>

          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {["Privacy Policy", "Terms of Service", "Help Center"].map((l) => (
              <a
                key={l}
                href="#"
                style={{ fontSize: 12.5, fontWeight: 500, color: "rgba(255,255,255,0.25)", textDecoration: "none", transition: "color .18s" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.25)"; }}
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ping {
          0%   { transform: scale(1);   opacity: 1; }
          75%  { transform: scale(2.2); opacity: 0; }
          100% { transform: scale(2.2); opacity: 0; }
        }
      `}</style>
    </footer>
  );
}