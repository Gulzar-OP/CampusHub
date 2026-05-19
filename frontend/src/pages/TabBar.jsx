import { FaHamburger, FaBox } from "react-icons/fa";
import { motion } from "framer-motion";
import React from "react";
import {
  Search, Plus, X, MapPin, Clock, User,
  Tag, Package, AlertTriangle, HandHelping,
  ShoppingCart, Sparkles, Upload, ChevronRight,
  Filter, TrendingUp
} from "lucide-react";
const TABS = [
  { id: "all",   label: "All",    icon: <TrendingUp size={14} />,     color: "from-gray-700 to-gray-900" },
  { id: "lost",  label: "Lost",   icon: <AlertTriangle size={14} />,  color: "from-orange-500 to-red-500" },
  { id: "found", label: "Found",  icon: <HandHelping size={14} />,    color: "from-teal-500 to-emerald-500" },
  { id: "sell",  label: "Sell",   icon: <Tag size={14} />,            color: "from-blue-500 to-indigo-500" },
  { id: "needs",   label: "Needs",    icon: <ShoppingCart size={14} />,   color: "from-amber-500 to-orange-500" },
];

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
export default TabBar;