
import React from "react";
import { motion} from "framer-motion";
import { MapPin, Clock, ChevronRight
} from "lucide-react";

import {
  FaBook,
  FaLaptop,
  FaPen,
  FaTshirt,
  FaChair,
  FaHamburger,
  FaBox,
} from "react-icons/fa";

const TAG_STYLES = {
  lost:  { bg: "bg-orange-50",  text: "text-orange-600",  ring: "ring-orange-200",  dot: "bg-orange-400" },
  found: { bg: "bg-teal-50",    text: "text-teal-600",    ring: "ring-teal-200",    dot: "bg-teal-400"   },
  sell:  { bg: "bg-blue-50",    text: "text-blue-600",    ring: "ring-blue-200",    dot: "bg-blue-400"   },
  needs:   { bg: "bg-amber-50",   text: "text-amber-600",   ring: "ring-amber-200",   dot: "bg-amber-400"  },
};


const CATEGORY_ICONS = {
  books: <FaBook />,
  electronics: <FaLaptop />,
  stationery: <FaPen />,
  clothing: <FaTshirt />,
  furniture: <FaChair />,
  food: <FaHamburger />,
  other: <FaBox />,
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
export default ItemCard;