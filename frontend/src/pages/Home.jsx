import axios from "axios";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus
} from "lucide-react";
import toast from "react-hot-toast";

import Hero from "./Hero";
import TabBar from "./TabBar";
import PostModal from "./PostForm";
import ItemCard from "./ItemCard";

const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
/* ─────────────────────────────────────────────
   Constants & helpers
───────────────────────────────────────────── */


export const formatDate = (date) =>
  new Date(date).toLocaleString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
    hour: "numeric", minute: "2-digit", hour12: true,
  });



/* ─────────────────────────────────────────────
   Skeleton card
───────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="rounded-3xl bg-white border border-gray-100 overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-100" />
      <div className="p-5 space-y-3">
        <div className="h-3 w-16 bg-gray-100 rounded-full" />
        <div className="h-5 w-3/4 bg-gray-100 rounded-full" />
        <div className="h-3 w-full bg-gray-100 rounded-full" />
        <div className="h-3 w-2/3 bg-gray-100 rounded-full" />
        <div className="flex gap-2 pt-2">
          <div className="h-6 w-20 bg-gray-100 rounded-full" />
          <div className="h-6 w-16 bg-gray-100 rounded-full" />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Item card
───────────────────────────────────────────── */


/* ─────────────────────────────────────────────
   Post form modal
───────────────────────────────────────────── */


/* ─────────────────────────────────────────────
   Hero section
───────────────────────────────────────────── */

/* ─────────────────────────────────────────────
   Tab bar
───────────────────────────────────────────── */


/* ─────────────────────────────────────────────
   Empty state
───────────────────────────────────────────── */
function EmptyState({ tab }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="col-span-full flex flex-col items-center justify-center py-24 text-center"
    >
      <div className="w-20 h-20 rounded-3xl bg-gray-50 flex items-center justify-center text-4xl mb-4 border border-gray-100">
        {tab === "lost" ? "🔍" : tab === "found" ? "✋" : tab === "sell" ? "🏷️" : tab === "buy" ? "🛒" : "📭"}
      </div>
      <h3 className="text-lg font-bold text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>
        Nothing here yet
      </h3>
      <p className="text-sm text-gray-400 mt-1 max-w-xs">
        Be the first to post a{tab !== "all" ? ` ${tab}` : "n"} item!
      </p>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Main
───────────────────────────────────────────── */
export default function Home() {
  const [activeTab, setActiveTab]   = useState("all");
  const [items, setItems]           = useState([]);
  const [showForm, setShowForm]     = useState(false);
  const [loading, setLoading]       = useState(false);
  const [searchQuery, setSearch]    = useState("");
  const navigate = useNavigate();

  const fetchItems = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API}/api/items/items`);
      setItems(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchItems(); }, []);

  const filteredItems = useMemo(() => {
    let list = activeTab === "all" ? items : items.filter(i => i.title === activeTab);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(i =>
        i.name?.toLowerCase().includes(q) ||
        i.description?.toLowerCase().includes(q) ||
        i.location?.toLowerCase().includes(q) ||
        i.category?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [items, activeTab, searchQuery]);

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(180deg,#f0fdfa 0%,#ffffff 30%,#f8fafc 100%)",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,700;1,700&display=swap');`}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Hero onPost={() => setShowForm(true)} searchQuery={searchQuery} onSearch={setSearch} />

        <TabBar active={activeTab} onChange={setActiveTab} />

        {/* Results count */}
        {!loading && (
          <motion.p
            key={filteredItems.length}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-xs text-gray-400 font-medium mb-5 text-center"
          >
            {filteredItems.length === 0
              ? "No items found"
              : `${filteredItems.length} item${filteredItems.length !== 1 ? "s" : ""}`}
            {searchQuery && ` for "${searchQuery}"`}
          </motion.p>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pb-16">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : filteredItems.length === 0
              ? <EmptyState tab={activeTab} />
              : filteredItems.map((item, i) => (
                  <ItemCard
                    key={item._id || i}
                    item={item}
                    index={i}
                    onClick={() => navigate(`/details/${item._id}`)}
                  />
                ))
          }
        </div>
      </div>

      {/* Floating post button (mobile) */}
      <motion.button
        onClick={() => setShowForm(true)}
        whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-2xl text-white flex items-center justify-center shadow-xl shadow-teal-300/40 sm:hidden z-50"
        style={{ background: "linear-gradient(135deg,#0d9488,#0f766e)" }}
      >
        <Plus size={24} />
      </motion.button>

      {/* Post modal */}
      <AnimatePresence>
        {showForm && (
          <PostModal
            onClose={() => setShowForm(false)}
            onSuccess={fetchItems}
          />
        )}
      </AnimatePresence>
    </div>
  );
}