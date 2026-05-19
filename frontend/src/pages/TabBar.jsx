import { motion } from "framer-motion";
import React from "react";
import {
  TrendingUp, AlertTriangle, HandHelping, Tag, ShoppingCart
} from "lucide-react";

const TABS = [
  { id: "all",   label: "All",    icon: <TrendingUp size={16} />,     color: "from-gray-600 to-gray-800", shadow: "shadow-gray-400/50" },
  { id: "lost",  label: "Lost",   icon: <AlertTriangle size={16} />,  color: "from-orange-500 to-red-500", shadow: "shadow-orange-400/50" },
  { id: "found", label: "Found",  icon: <HandHelping size={16} />,    color: "from-teal-500 to-emerald-500", shadow: "shadow-teal-400/50" },
  { id: "sell",  label: "Sell",   icon: <Tag size={16} />,            color: "from-blue-500 to-indigo-500", shadow: "shadow-blue-400/50" },
  { id: "needs", label: "Needs",  icon: <ShoppingCart size={16} />,   color: "from-amber-500 to-orange-500", shadow: "shadow-amber-400/50" },
];

export default function TabBar({ active, onChange }) {
  return (
    <div className="w-full overflow-x-auto pb-2 scrollbar-hide">
      <div className="inline-flex gap-2 bg-gray-50 border border-gray-200 rounded-2xl p-2 shadow-lg">
        {TABS.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`
              relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold 
              transition-all duration-300 ease-out
              ${active === tab.id 
                ? "text-white" 
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              }
            `}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            {active === tab.id && (
              <motion.div
                layoutId="tabBg"
                className={`absolute inset-0 rounded-xl bg-gradient-to-r ${tab.color}`}
                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                style={{ zIndex: 0 }}
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