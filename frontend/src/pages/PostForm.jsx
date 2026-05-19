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
import toast from "react-hot-toast";
import {
  FaBook,
  FaLaptop,
  FaPen,
  FaTshirt,
  FaChair,
  FaHamburger,
  FaBox,
} from "react-icons/fa";
const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
const initialForm = {
  title: "", name: "", category: "", description: "",
  price: "", location: "", contact: "", image: null,
};

const TAG_STYLES = {
  lost:  { bg: "bg-orange-50",  text: "text-orange-600",  ring: "ring-orange-200",  dot: "bg-orange-400" },
  found: { bg: "bg-teal-50",    text: "text-teal-600",    ring: "ring-teal-200",    dot: "bg-teal-400"   },
  sell:  { bg: "bg-blue-50",    text: "text-blue-600",    ring: "ring-blue-200",    dot: "bg-blue-400"   },
  needs:   { bg: "bg-amber-50",   text: "text-amber-600",   ring: "ring-amber-200",   dot: "bg-amber-400"  },
};


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

    Object.entries(form).forEach(([key, value]) => {
      if (value && key !== "image") {
        fd.append(key, value);
      }
    });

    if (form.image) {
      fd.append("image", form.image);
    }

    const { data } = await axios.post(
      `${API}/api/items/add`,
      fd,
      {
        withCredentials: true,
      }
    );

    toast.success(data.message || "Item added successfully!");

    onSuccess?.();
    onClose?.();

  } catch (err) {
    console.error(err);

    toast.error(
      err.response?.data?.message ||
      "Failed to add item"
    );
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
              {["sell","needs","lost","found"].map(type => {
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
              <label className="text-[11px] uppercase tracking-widest font-semibold text-gray-400 block mb-2">
                Category
              </label>

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className={inputCls}
              >
                <option value="">Select Category</option>
                <option value="books">📚 Books</option>
                <option value="electronics">💻 Electronics</option>
                <option value="stationery">✏️ Stationery</option>
                <option value="clothing">👕 Clothing</option>
                <option value="furniture">🪑 Furniture</option>
                <option value="food">🍱 Food</option>
                <option value="other">📦 Other</option>
              </select>
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
export default PostModal