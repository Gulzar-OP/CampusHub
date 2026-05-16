import axios from "axios";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Search, Plus, X, MapPin, Clock, User,
  Tag, Package, AlertTriangle, HandHelping,
  ShoppingCart, Sparkles, Upload, ChevronRight,
  Filter, TrendingUp
} from "lucide-react";

/* ─────────────────────────────────────────────
   Constants & helpers
───────────────────────────────────────────── */
const TABS = [
  { id: "all",   label: "All",    icon: <TrendingUp size={14} />,     color: "from-gray-700 to-gray-900" },
  { id: "lost",  label: "Lost",   icon: <AlertTriangle size={14} />,  color: "from-orange-500 to-red-500" },
  { id: "found", label: "Found",  icon: <HandHelping size={14} />,    color: "from-teal-500 to-emerald-500" },
  { id: "sell",  label: "Sell",   icon: <Tag size={14} />,            color: "from-blue-500 to-indigo-500" },
  { id: "buy",   label: "Buy",    icon: <ShoppingCart size={14} />,   color: "from-amber-500 to-orange-500" },
];

const TAG_STYLES = {
  lost:  { bg: "bg-orange-50",  text: "text-orange-600",  ring: "ring-orange-200",  dot: "bg-orange-400" },
  found: { bg: "bg-teal-50",    text: "text-teal-600",    ring: "ring-teal-200",    dot: "bg-teal-400"   },
  sell:  { bg: "bg-blue-50",    text: "text-blue-600",    ring: "ring-blue-200",    dot: "bg-blue-400"   },
  buy:   { bg: "bg-amber-50",   text: "text-amber-600",   ring: "ring-amber-200",   dot: "bg-amber-400"  },
};

const CATEGORY_ICONS = {
  books: "📚", electronics: "💻", stationery: "✏️",
  clothing: "👕", furniture: "🪑", food: "🍱", other: "📦",
};

export const formatDate = (date) =>
  new Date(date).toLocaleString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
    hour: "numeric", minute: "2-digit", hour12: true,
  });

const timeAgo = (date) => {
  const diff = (Date.now() - new Date(date)) / 1000;
  if (diff < 60)     return "just now";
  if (diff < 3600)   return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400)  return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const initialForm = {
  title: "", name: "", category: "", description: "",
  price: "", location: "", contact: "", image: null,
};

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
function ItemCard({ item, index, onClick }) {
  const tag = TAG_STYLES[item.title] || { bg:"bg-gray-50", text:"text-gray-600", ring:"ring-gray-200", dot:"bg-gray-400" };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      className="group relative rounded-3xl bg-white border border-gray-100 overflow-hidden cursor-pointer
        shadow-sm hover:shadow-2xl hover:shadow-gray-200/60 hover:-translate-y-1.5 transition-all duration-400"
    >
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        <img
          src={item.image || "/default.png"}
          alt={item.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Tag badge */}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide ring-1 backdrop-blur-sm ${tag.bg} ${tag.text} ${tag.ring}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${tag.dot}`} />
            {item.title?.toUpperCase()}
          </span>
        </div>

        {/* Price badge */}
        {item.price && (
          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold shadow-sm">
              ₹{item.price}
            </span>
          </div>
        )}

        {/* Arrow on hover */}
        <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300 shadow-sm">
          <ChevronRight size={14} className="text-gray-700" />
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {item.category && (
          <p className="text-[10px] uppercase tracking-widest font-semibold text-gray-400 mb-1.5">
            {CATEGORY_ICONS[item.category?.toLowerCase()] || "📦"} {item.category}
          </p>
        )}

        <h3 className="text-base font-bold text-gray-900 leading-snug line-clamp-1 group-hover:text-teal-700 transition-colors">
          {item.name}
        </h3>

        <p className="mt-1.5 text-sm text-gray-500 leading-relaxed line-clamp-2">
          {item.description}
        </p>

        {/* Location & time chips */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {item.location && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-50 text-gray-500 text-[11px] font-medium border border-gray-100">
              <MapPin size={10} /> {item.location}
            </span>
          )}
          {item.createdAt && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-50 text-gray-500 text-[11px] font-medium border border-gray-100">
              <Clock size={10} /> {timeAgo(item.createdAt)}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3.5 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-[10px] font-bold">
              {item.postedBy?.name?.[0]?.toUpperCase() || "?"}
            </div>
            <span className="text-xs text-gray-500 font-medium">
              {item.postedBy?.name || "Anonymous"}
            </span>
          </div>
          {item.status && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-semibold border border-emerald-100">
              {item.status}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Post form modal
───────────────────────────────────────────── */
function PostModal({ onClose, onSuccess }) {
  const [form, setForm]       = useState(initialForm);
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  const handleChange = (e) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const applyFile = (file) => {
    if (!file) return;
    setForm(f => ({ ...f, image: file }));
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v && k !== "image") fd.append(k, v); });
      if (form.image) fd.append("image", form.image);
      await axios.post("http://localhost:4000/api/items/add", fd, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = "w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-50 transition-all duration-200";

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center px-0 sm:px-4"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ y: 60, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 60, opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full sm:max-w-2xl rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div
          className="px-7 py-6 shrink-0 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg,#0d9488 0%,#0f766e 60%,#134e4a 100%)" }}
        >
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-16 w-20 h-20 rounded-full bg-white/10 translate-y-1/2" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                  <Sparkles size={16} className="text-white" />
                </div>
                <h2 className="text-xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                  New Post
                </h2>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
                <X size={16} className="text-white" />
              </button>
            </div>
            <p className="text-teal-100 text-sm mt-1">Share with your campus community</p>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-7 py-6 space-y-5">
          {/* Type selector */}
          <div>
            <label className="text-[11px] uppercase tracking-widest font-semibold text-gray-400 block mb-2">Post Type</label>
            <div className="grid grid-cols-4 gap-2">
              {["sell","buy","lost","found"].map(type => {
                const t = TAG_STYLES[type];
                const sel = form.title === type;
                return (
                  <button
                    key={type} type="button"
                    onClick={() => setForm(f => ({ ...f, title: type }))}
                    className={`py-2.5 rounded-2xl text-xs font-bold capitalize transition-all border ${
                      sel
                        ? `${t.bg} ${t.text} border-current ring-2 ${t.ring} shadow-sm`
                        : "bg-gray-50 text-gray-500 border-gray-100 hover:bg-gray-100"
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] uppercase tracking-widest font-semibold text-gray-400 block mb-2">Item Name</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Drawing Kit" className={inputCls} />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-widest font-semibold text-gray-400 block mb-2">Category</label>
              <input name="category" value={form.category} onChange={handleChange} placeholder="Books, Electronics…" className={inputCls} />
            </div>
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-widest font-semibold text-gray-400 block mb-2">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3}
              placeholder="Describe the item, condition, any details…"
              className={`${inputCls} resize-none`} />
          </div>

          {/* Image drop zone */}
          <div>
            <label className="text-[11px] uppercase tracking-widest font-semibold text-gray-400 block mb-2">Photo</label>
            <div
              onClick={() => fileRef.current.click()}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); applyFile(e.dataTransfer.files[0]); }}
              className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-200 flex items-center justify-center overflow-hidden
                ${dragOver ? "border-teal-500 bg-teal-50" : "border-gray-200 bg-gray-50 hover:border-teal-400 hover:bg-teal-50/40"}`}
              style={{ minHeight: preview ? 0 : "9rem" }}
            >
              {preview ? (
                <div className="relative w-full">
                  <img src={preview} alt="preview" className="w-full h-44 object-cover" />
                  <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-sm font-medium">Click to change</span>
                  </div>
                </div>
              ) : (
                <div className="py-8 flex flex-col items-center gap-2 text-gray-400">
                  <Upload size={22} className={dragOver ? "text-teal-500" : ""} />
                  <p className="text-sm font-medium">Drop photo here or click to upload</p>
                  <p className="text-xs">PNG, JPG up to 10MB</p>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => applyFile(e.target.files[0])} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {form.title === "sell" && (
              <div>
                <label className="text-[11px] uppercase tracking-widest font-semibold text-gray-400 block mb-2">Price (₹)</label>
                <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="250" className={inputCls} />
              </div>
            )}
            <div className={form.title === "sell" ? "" : "col-span-2"}>
              <label className="text-[11px] uppercase tracking-widest font-semibold text-gray-400 block mb-2">Location</label>
              <input name="location" value={form.location} onChange={handleChange} placeholder="Block A, Library…" className={inputCls} />
            </div>
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-widest font-semibold text-gray-400 block mb-2">Contact</label>
            <input name="contact" value={form.contact} onChange={handleChange} placeholder="Phone or WhatsApp" className={inputCls} />
          </div>
        </div>

        {/* Footer */}
        <div className="px-7 py-5 border-t border-gray-100 flex gap-3 shrink-0 bg-white">
          <button type="button" onClick={onClose}
            className="flex-1 py-3 rounded-2xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || !form.title || !form.name}
            className="flex-1 py-3 rounded-2xl text-white text-sm font-semibold disabled:opacity-50 transition-all"
            style={{ background: "linear-gradient(135deg,#0d9488,#0f766e)", boxShadow: "0 4px 16px rgba(13,148,136,.3)" }}
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Posting…
              </span>
            ) : "Post Now"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Hero section
───────────────────────────────────────────── */
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
          Your campus,{" "}
          <span
            className="italic"
            style={{ background: "linear-gradient(135deg,#0d9488,#059669)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
          >
            connected.
          </span>
        </h1>
        <p className="mt-4 text-gray-500 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
          Lost something? Found something? Buying or selling within campus?
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
          className="flex items-center gap-2 px-6 py-3.5 rounded-2xl text-white text-sm font-semibold whitespace-nowrap shadow-lg shadow-teal-200/60 transition-all"
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

/* ─────────────────────────────────────────────
   Tab bar
───────────────────────────────────────────── */
function TabBar({ active, onChange }) {
  return (
    <div className="flex items-center justify-center mb-8">
      <div className="inline-flex gap-1.5 bg-white border border-gray-100 rounded-2xl p-1.5 shadow-sm">
        {TABS.map(tab => (
          <motion.button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              active === tab.id ? "text-white shadow-md" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
            whileTap={{ scale: 0.96 }}
          >
            {active === tab.id && (
              <motion.div
                layoutId="tabBg"
                className={`absolute inset-0 rounded-xl bg-gradient-to-r ${tab.color}`}
                transition={{ type: "spring", bounce: 0.25, duration: 0.4 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              {tab.icon}
              {tab.label}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

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
  const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
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