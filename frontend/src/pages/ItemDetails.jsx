import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

import { MapPin, Eye, MessageCircle, ArrowLeft, Package } from "lucide-react";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function ItemDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await api.get(`/items/${id}`);

        setItem(res.data.item);
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message || "Failed to load item details.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const messageOwner = async () => {
    if (!user) {
      return navigate("/login");
    }

    if (!item?.postedBy?._id) return;

    try {
      const res = await api.post("/chat/conversations", {
        userId: item.postedBy._id,
      });

      navigate(`/chat?conversation=${res.data.conversation._id}`);
    } catch (error) {
      console.error("Failed to create conversation:", error);
    }
  };

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

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="h-[450px] animate-pulse rounded-3xl bg-gray-200" />

          <div className="space-y-5 rounded-3xl border border-gray-200 bg-white p-7">
            <div className="h-6 w-32 animate-pulse rounded bg-gray-200" />

            <div className="h-10 w-3/4 animate-pulse rounded bg-gray-200" />

            <div className="h-6 w-full animate-pulse rounded bg-gray-100" />

            <div className="h-6 w-2/3 animate-pulse rounded bg-gray-100" />
          </div>
        </div>
      </div>
    );
  }

  // ================= ERROR =================

  if (error || !item) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white px-6 text-center">
        <Package size={42} className="mb-4 text-gray-300" />

        <h2 className="text-xl font-bold text-gray-900">Item not found</h2>

        <p className="mt-2 text-sm text-gray-500">
          {error || "This item may no longer be available."}
        </p>

        <Link
          to="/items"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          <ArrowLeft size={17} />
          Back to items
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* ================= BACK ================= */}

      <Link
        to="/items"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-indigo-600"
      >
        <ArrowLeft size={17} />
        Back to items
      </Link>

      {/* ================= DETAILS ================= */}

      <div className="grid gap-8 lg:grid-cols-2">
        {/* ================= IMAGE ================= */}

        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="flex min-h-[350px] items-center justify-center bg-gray-100 sm:min-h-[450px] lg:h-full">
            {item.image ? (
              <div className="w-full flex items-center justify-center bg-gray-50 rounded-2xl overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full max-h-[600px] object-contain"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 text-gray-400">
                <span className="text-8xl">
                  {item.title === "sell"
                    ? "🛍️"
                    : item.title === "lost"
                      ? "🔎"
                      : item.title === "found"
                        ? "✅"
                        : "📦"}
                </span>

                <p className="text-sm">No image available</p>
              </div>
            )}
          </div>
        </div>

        {/* ================= INFO ================= */}

        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          {/* Badge + Status */}
          <div className="mb-5 flex items-center justify-between gap-3">
            <span
              className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${
                badgeStyle[item.title] || "bg-gray-100 text-gray-600"
              }`}
            >
              {item.title}
            </span>

            <span
              className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize ${
                statusStyle[item.status] || "bg-gray-100 text-gray-600"
              }`}
            >
              {item.status}
            </span>
          </div>

          {/* Name */}
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {item.name}
          </h1>

          {/* Price */}
          {item.title === "sell" && (
            <p className="mt-4 text-3xl font-bold text-indigo-600">
              ₹{item.price || 0}
            </p>
          )}

          {/* Description */}
          <div className="mt-6">
            <h3 className="mb-2 text-sm font-semibold text-gray-900">
              Description
            </h3>

            <p className="whitespace-pre-line text-sm leading-7 text-gray-600 sm:text-base">
              {item.description || "No description provided."}
            </p>
          </div>

          {/* Info */}
          <div className="mt-7 space-y-4">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <MapPin size={17} />
              </div>

              <div>
                <p className="text-xs text-gray-400">Location</p>

                <p className="font-medium text-gray-700">
                  {item.location || "Campus"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <Eye size={17} />
              </div>

              <div>
                <p className="text-xs text-gray-400">Views</p>

                <p className="font-medium text-gray-700">
                  {item.views || 0} views
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="my-7 border-t border-gray-100" />

          {/* ================= OWNER ================= */}

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Posted by
            </p>

            <Link
              to={`/profile/${item.postedBy?._id}`}
              className="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-4 transition hover:border-indigo-100 hover:bg-indigo-50/50"
            >
              {/* Avatar */}
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-lg font-bold uppercase text-white">
                {item.postedBy?.name?.[0] || "U"}
              </div>

              {/* Owner details */}
              <div className="min-w-0">
                <p className="truncate font-semibold text-gray-900 transition group-hover:text-indigo-600">
                  {item.postedBy?.name || "Unknown User"}
                </p>

                <p className="mt-1 truncate text-sm text-gray-500">
                  {item.postedBy?.course || "Student"}

                  {item.postedBy?.year && ` · ${item.postedBy.year}`}
                </p>
              </div>
            </Link>
          </div>

          {/* ================= MESSAGE ================= */}

          {user?._id !== item.postedBy?._id && (
            <button
              onClick={messageOwner}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md"
            >
              <MessageCircle size={18} />
              Message owner
            </button>
          )}

          {/* Own item */}
          {user?._id === item.postedBy?._id && (
            <div className="mt-6 rounded-xl bg-indigo-50 px-4 py-3 text-center text-sm font-medium text-indigo-600">
              This item was posted by you.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
