import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ShoppingBag, Search, Shield, Users, Zap,
  ArrowRight, BookOpen, MapPin, Star, Heart
} from "lucide-react";

/* ── helpers ── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] },
});

function InView({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── data ── */
const features = [
  { icon: ShoppingBag, title: "Buy & Sell Freely",     desc: "List anything from textbooks to gadgets in under 2 minutes. Connect directly with classmates.",        color: "from-teal-400 to-teal-600",   bg: "bg-teal-50",   text: "text-teal-700" },
  { icon: Search,      title: "Lost & Found",           desc: "Lost your ID card? Found someone's keys? Our campus-specific board reunites students with their stuff.", color: "from-amber-400 to-orange-500", bg: "bg-amber-50",  text: "text-amber-700" },
  { icon: Shield,      title: "Verified Community",     desc: "Only students with a verified college email can join — making every transaction safe and trusted.",     color: "from-indigo-400 to-indigo-600", bg: "bg-indigo-50", text: "text-indigo-700" },
  { icon: Zap,         title: "Instant Notifications",  desc: "Get alerted the moment someone messages you or a saved item drops in price.",                         color: "from-emerald-400 to-emerald-600", bg: "bg-emerald-50", text: "text-emerald-700" },
];

const stats = [
  { value: "2,400+", label: "Students",     icon: Users },
  { value: "8,100+", label: "Items Listed", icon: ShoppingBag },
  { value: "4.9★",   label: "Avg Rating",   icon: Star },
  { value: "12",     label: "Campuses",     icon: MapPin },
];

const team = [
  { name: "Aarav Sharma",   role: "Founder & Dev",    year: "CSE · 3rd Year",    initials: "AS", color: "from-teal-400 to-teal-600" },
  { name: "Priya Menon",    role: "Design Lead",      year: "Design · 2nd Year", initials: "PM", color: "from-amber-400 to-orange-400" },
  { name: "Rohan Das",      role: "Backend Engineer", year: "CSE · 3rd Year",    initials: "RD", color: "from-indigo-400 to-indigo-600" },
];

/* ── component ── */
export default function AboutUs() {
  return (
    <div
      className="bg-gradient-to-b from-teal-50 via-white to-gray-50 min-h-screen overflow-x-hidden"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,700;1,500&display=swap');
        .mesh { background: radial-gradient(ellipse 80% 60% at 60% 0%, rgba(13,148,136,0.12) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 10% 80%, rgba(245,158,11,0.08) 0%, transparent 60%); }
        .card-glass { background: rgba(255,255,255,0.75); border: 1px solid rgba(255,255,255,0.9); backdrop-filter: blur(16px); }
      `}</style>

      {/* ── HERO ── */}
      <section className="mesh relative pt-20 pb-24 px-4 overflow-hidden">
        {/* Floating blobs */}
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-20 pointer-events-none" style={{ background: "radial-gradient(circle, #14b8a6, transparent)", transform: "translate(30%, -30%)" }} />
        <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full opacity-10 pointer-events-none" style={{ background: "radial-gradient(circle, #f59e0b, transparent)", transform: "translate(-30%, 40%)" }} />

        <div className="max-w-3xl mx-auto text-center relative">
          <motion.div {...fadeUp(0)} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-100 text-teal-700 text-xs font-semibold uppercase tracking-widest mb-6 border border-teal-200">
            <Heart size={12} className="fill-teal-500 text-teal-500" />
            Built by students, for students
          </motion.div>

          <motion.h1
            {...fadeUp(0.1)}
            style={{ fontFamily: "'Playfair Display', serif" }}
            className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6"
          >
            The marketplace your{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-teal-600">campus</span>
              <motion.span
                className="absolute bottom-1 left-0 right-0 h-3 bg-teal-100 rounded-sm -z-0"
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              />
            </span>{" "}
            deserves
          </motion.h1>

          <motion.p {...fadeUp(0.2)} className="text-gray-500 text-lg font-light leading-relaxed max-w-xl mx-auto mb-10">
            CampusHub is where students buy, sell, and rediscover lost items — all within the safety of their own campus community.
          </motion.p>

          <motion.div {...fadeUp(0.3)} className="flex flex-wrap justify-center gap-3">
            <Link
              to="/marketplace"
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-teal-600 text-white font-semibold text-sm shadow-lg shadow-teal-200 hover:bg-teal-700 transition-all"
            >
              Explore Marketplace <ArrowRight size={15} />
            </Link>
            <Link
              to="/login"
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-gray-700 font-semibold text-sm border border-gray-200 shadow-sm hover:border-teal-300 hover:text-teal-700 transition-all"
            >
              Join for free
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="px-4 -mt-10 mb-20">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(({ value, label, icon: Icon }, i) => (
            <InView key={label} delay={i * 0.08}>
              <div className="card-glass rounded-2xl p-5 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center mx-auto mb-3">
                  <Icon size={17} className="text-teal-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>{value}</p>
                <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">{label}</p>
              </div>
            </InView>
          ))}
        </div>
      </section>

      {/* ── STORY ── */}
      <section className="px-4 mb-24">
        <div className="max-w-4xl mx-auto">
          <InView>
            <div className="card-glass rounded-3xl p-8 md:p-12 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 pointer-events-none" style={{ background: "radial-gradient(circle, #0d9488, transparent)", transform: "translate(30%, -30%)" }} />

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center">
                  <BookOpen size={18} className="text-white" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-widest text-teal-600">Our Story</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-5 leading-snug" style={{ fontFamily: "'Playfair Display', serif" }}>
                It started with a textbook
              </h2>

              <div className="space-y-4 text-gray-500 font-light leading-relaxed text-[15px] max-w-2xl">
                <p>A final-year student was trying to sell an expensive engineering textbook before the semester ended. They posted it in a WhatsApp group, it got buried, and the book never sold.</p>
                <p>That frustration sparked an idea: what if every campus had its own clean, focused marketplace — just for students? No strangers, no scams, just verified peers trading within a trusted circle.</p>
                <p>CampusHub was born in a hostel room with a cup of chai and a GitHub repo. Today it connects thousands of students across campuses — helping them save money, declutter dorms, and find lost items.</p>
              </div>
            </div>
          </InView>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="px-4 mb-24">
        <div className="max-w-4xl mx-auto">
          <InView className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-teal-600 block mb-3">What we offer</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
              Everything your campus needs
            </h2>
          </InView>

          <div className="grid md:grid-cols-2 gap-5">
            {features.map(({ icon: Icon, title, desc, color, bg, text }, i) => (
              <InView key={title} delay={i * 0.1}>
                <div className="card-glass rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group hover:-translate-y-0.5">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-md`}>
                    <Icon size={20} className="text-white" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">{title}</h3>
                  <p className="text-sm text-gray-500 font-light leading-relaxed">{desc}</p>
                </div>
              </InView>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="px-4 mb-24">
        <div className="max-w-4xl mx-auto">
          <InView className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-teal-600 block mb-3">The builders</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
              Meet the team
            </h2>
          </InView>

          <div className="grid sm:grid-cols-3 gap-5">
            {team.map(({ name, role, year, initials, color }, i) => (
              <InView key={name} delay={i * 0.1}>
                <div className="card-glass rounded-2xl p-6 text-center shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mx-auto mb-4 text-white text-lg font-bold shadow-lg`}>
                    {initials}
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm">{name}</h3>
                  <p className="text-teal-600 text-xs font-semibold mt-0.5">{role}</p>
                  <p className="text-gray-400 text-xs mt-1">{year}</p>
                </div>
              </InView>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-4 pb-24">
        <InView>
          <div
            className="max-w-4xl mx-auto rounded-3xl p-10 md:p-14 text-center relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #0d9488 0%, #0f766e 60%, #134e4a 100%)" }}
          >
            <div className="absolute top-0 right-0 w-60 h-60 rounded-full opacity-15 pointer-events-none" style={{ background: "radial-gradient(circle, white, transparent)", transform: "translate(20%, -20%)" }} />
            <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full opacity-10 pointer-events-none" style={{ background: "radial-gradient(circle, white, transparent)", transform: "translate(-20%, 20%)" }} />

            <div className="relative">
              <p className="text-teal-200 text-xs font-semibold uppercase tracking-widest mb-4">Ready to dive in?</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                Join your campus community today
              </h2>
              <p className="text-teal-100/80 font-light mb-8 max-w-md mx-auto leading-relaxed">
                It's free, it's fast, and it's only for students like you.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-7 py-3 rounded-full bg-white text-teal-700 font-bold text-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                >
                  Get started free <ArrowRight size={15} />
                </Link>
                <Link
                  to="/marketplace"
                  className="flex items-center gap-2 px-7 py-3 rounded-full bg-white/15 text-white font-semibold text-sm border border-white/30 hover:bg-white/25 transition-all"
                >
                  Browse listings
                </Link>
              </div>
            </div>
          </div>
        </InView>
      </section>
    </div>
  );
}