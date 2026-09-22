import React from "react";
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";

export default function ItemCard({ item }) {
  const fallback =
    item.title === "sell"
      ? "🛍️"
      : item.title === "lost"
        ? "🔎"
        : item.title === "found"
          ? "✅"
          : "🙋";

  const badgeStyle = {
    lost: "bg-red-50 text-red-600",
    found: "bg-green-50 text-green-600",
    sell: "bg-blue-50 text-blue-600",
    needs: "bg-orange-50 text-orange-600",
  };

  const statusStyle = {
    open: "bg-emerald-50 text-emerald-600",
    claimed: "bg-yellow-50 text-yellow-700",
    sold: "bg-gray-100 text-gray-600",
  };

  return (
    <Link
      to={`/items/${item._id}`}
      className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      {/* IMAGE */}
      <div className="relative flex h-48 items-center justify-center overflow-hidden bg-gray-100">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <span className="text-6xl">{fallback}</span>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
      </div>

      {/* DETAILS */}
      <div className="bg-gray-50/80 p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
              badgeStyle[item.title] || "bg-gray-100 text-gray-600"
            }`}
          >
            {item.title}
          </span>

          <span
            className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
              statusStyle[item.status] || "bg-gray-100 text-gray-600"
            }`}
          >
            {item.status}
          </span>
        </div>

        <h3 className="mb-2 line-clamp-1 text-lg font-bold text-gray-900 transition group-hover:text-indigo-600">
          {item.name}
        </h3>

        <p className="mb-5 line-clamp-2 min-h-[40px] text-sm leading-5 text-gray-500">
          {item.description || "No description provided."}
        </p>

        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="flex min-w-0 items-center gap-1.5 text-sm text-gray-500">
            <MapPin size={15} className="shrink-0 text-indigo-500" />

            <span className="truncate">{item.location || "Campus"}</span>
          </div>

          {item.title === "sell" && (
            <span className="ml-3 font-bold text-indigo-600">
              ₹{item.price || 0}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
