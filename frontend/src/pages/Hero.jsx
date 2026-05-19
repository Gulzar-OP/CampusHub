import { Search, Plus } from "lucide-react";
import { motion } from "framer-motion";
import React from "react";

function Hero({ onPost, searchQuery, onSearch }) {
  return (
    <div className="relative pt-14 pb-12 text-center overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-teal-100/40 blur-3xl -z-10" />
      <div className="absolute top-10 left-1/4 w-48 h-48 rounded-full bg-emerald-100/30 blur-2xl -z-10" />
      <div className="absolute top-0 right-1/4 w-32 h-32 rounded-full bg-cyan-100/40 blur-2xl -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white shadow-sm ring-1 ring-teal-100 text-xs text-teal-700 font-semibold mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
          HIT Campus Marketplace · Live
        </div>

        <h1
          className="text-5xl sm:text-6xl font-bold text-gray-900 tracking-tight leading-[1.1]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Made for students,{" "}
          <span
            className="italic block"
            style={{ background: "linear-gradient(135deg,#0d9488,#059669)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
          >
             Built for campus life..
          </span>
        </h1>
        <p className="mt-4 text-gray-500 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
          Lost something? Found something? Need to buy or sell on campus?
          Post it here in seconds.
        </p>
      </motion.div>

      {/* Search + CTA row */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-xl mx-auto px-4"
      >
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search items, locations…"
            value={searchQuery}
            onChange={e => onSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-white border border-gray-200 text-sm text-gray-800
              placeholder:text-gray-400 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-50
              shadow-sm transition-all"
          />
        </div>
        <motion.button
          onClick={onPost} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          className="hidden sm:flex items-center gap-2 px-6 py-3.5 rounded-2xl text-white text-sm font-semibold whitespace-nowrap shadow-lg shadow-teal-200/60 transition-all"
          style={{ background: "linear-gradient(135deg,#0d9488,#0f766e)" }}
        >
          <Plus size={16} />
          Post Item
        </motion.button>
      </motion.div>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-8 flex items-center justify-center gap-6 text-xs text-gray-400"
      >
        {[["🔁", "Free to post"], ["⚡", "Instant visibility"], ["🏫", "Campus only"]].map(([icon, label]) => (
          <span key={label} className="flex items-center gap-1.5">
            <span>{icon}</span> {label}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
export default Hero;