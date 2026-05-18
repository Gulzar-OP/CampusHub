import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function DetailsPost() {
  const [postedById, setPostedById] = useState(null);
  const { id } = useParams();
  const [postedUser, setPostedUser] = useState(null);
  const [itemDetails, setItemDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  useEffect(() => {
    const fetchPostedUser = async () => {
      try {
        const response = await axios.get(`${API}/api/auth/users/${postedById}`, {
          withCredentials: true,
        });
        setPostedUser(response.data);
      } catch (error) {
        console.error("Error fetching posted user:", error);
      }
    };
    if (postedById) fetchPostedUser();
  }, [postedById]);

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const response = await axios.get(`${API}/api/items/${id}`, {
          withCredentials: true,
        });
        setItemDetails(response.data);
        setPostedById(response.data.postedBy);
      } catch (error) {
        console.error("Error fetching item details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchItemDetails();
  }, [id]);

  const handleClaim = async () => {
    try {
      const response = await axios.put(
        `${API}/api/items/claim/${id}`,
        {},
        { withCredentials: true }
      );
      setItemDetails(response.data.item);
      alert("Item claimed successfully");
    } catch (error) {
      console.error("Claim error:", error);
      alert(error.response?.data?.message || "Failed to claim item");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400 tracking-wide">Fetching details…</p>
        </div>
      </div>
    );
  }

  if (!itemDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-400">No item found.</p>
      </div>
    );
  }

  const isClaimed = itemDetails.status !== "open";
  const avatarFallback = postedUser?.name
    ? postedUser.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-5xl mx-auto space-y-4">

        {/* ── Main card ───────────────────────────────────────── */}
        <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">

            {/* Image */}
            <div className="relative h-72 lg:h-full min-h-[300px] bg-gray-100">
              <img
                src={itemDetails.image || "/default.png"}
                alt={itemDetails.name || itemDetails.title}
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
              {/* Status pill over image */}
              <div className="absolute top-4 left-4">
                <StatusBadge status={itemDetails.status} />
              </div>
            </div>

            {/* Details */}
            <div className="p-7 flex flex-col gap-5">

              {/* Category tag */}
              {itemDetails.title && (
                <span className="self-start px-2.5 py-0.5 rounded-md text-[11px] font-semibold tracking-wider uppercase bg-teal-50 text-teal-700 border border-teal-100">
                  {itemDetails.title}
                </span>
              )}

              {/* Name + price */}
              <div>
                <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                  {itemDetails.name}
                </h1>
                {itemDetails.price != 0 && (
                  <p className="mt-1 text-xl font-semibold text-teal-600">
                    ₹{itemDetails.price}
                  </p>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-500 text-sm leading-relaxed">
                {itemDetails.description}
              </p>

              {/* Meta chips */}
              <div className="flex flex-wrap gap-2">
                {itemDetails.category && (
                  <MetaChip icon="🏷️" label={itemDetails.category} />
                )}
                {itemDetails.location && (
                  <MetaChip icon="📍" label={itemDetails.location} />
                )}
              </div>

              {/* Claimed by */}
              {isClaimed && itemDetails.claimedBy && (
                <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-amber-50 border border-amber-100">
                  <span className="text-amber-500 text-lg">🔒</span>
                  <div className="text-sm">
                    <p className="text-amber-800 font-medium">
                      Claimed by {itemDetails.claimedBy.name || "Unknown"}
                    </p>
                    {itemDetails.claimedBy.email && (
                      <p className="text-amber-600 text-xs mt-0.5">
                        {itemDetails.claimedBy.email}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="mt-auto pt-2">
                {!isClaimed ? (
                  <button
                    onClick={handleClaim}
                    className="w-full rounded-xl bg-teal-600 px-5 py-3 text-white text-sm font-semibold shadow-sm transition hover:bg-teal-700 active:scale-[0.98]"
                  >
                    Claim This Item
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full rounded-xl bg-gray-100 px-5 py-3 text-gray-400 text-sm font-semibold cursor-not-allowed"
                  >
                    Already Claimed
                  </button>
                )}
              </div>

              {/* Meta timestamps + contact */}
              <div className="pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-gray-400">
                {itemDetails.contact && (
                  <MetaRow label="Contact" value={itemDetails.contact} />
                )}
                {itemDetails.createdAt && (
                  <MetaRow label="Listed" value={formatDate(itemDetails.createdAt)} />
                )}
                {itemDetails.updatedAt && (
                  <MetaRow label="Updated" value={formatDate(itemDetails.updatedAt)} />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Posted By card ──────────────────────────────────── */}
        <div className="rounded-2xl bg-white shadow-sm border border-gray-100 px-6 py-5">
          <p className="text-[11px] font-semibold tracking-widest uppercase text-gray-400 mb-4">
            Posted by
          </p>

          {postedUser ? (
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                {postedUser.avatar ? (
                  <img
                    src={postedUser.avatar}
                    alt={postedUser.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-gray-100"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 font-bold text-lg">
                    {avatarFallback}
                  </div>
                )}
                {/* Online dot (decorative) */}
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {postedUser.name}
                </p>
                {postedUser.email && (
                  <p className="text-xs text-gray-400 truncate mt-0.5">
                    {postedUser.email}
                  </p>
                )}
                {postedUser.bio && (
                  <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">
                    {postedUser.bio}
                  </p>
                )}
              </div>

              {/* Contact button */}
              {postedUser.email && (
                <a
                  href={`mailto:${postedUser.email}`}
                  className="flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-100 hover:bg-teal-100 transition"
                >
                  Contact
                </a>
              )}
            </div>
          ) : (
            /* Skeleton while loading */
            <div className="flex items-center gap-4 animate-pulse">
              <div className="w-14 h-14 rounded-2xl bg-gray-100" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-100 rounded w-1/3" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

/* ── Helpers ─────────────────────────────────────────────────── */

function StatusBadge({ status }) {
  const map = {
    open: "bg-green-500 text-white",
    claimed: "bg-amber-500 text-white",
    closed: "bg-gray-500 text-white",
  };
  const cls = map[status] || "bg-gray-400 text-white";
  return (
    <span className={`inline-block px-2.5 py-1 rounded-lg text-[11px] font-semibold ${cls}`}>
      {status?.charAt(0).toUpperCase() + status?.slice(1)}
    </span>
  );
}

function MetaChip({ icon, label }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-100 text-gray-500 text-xs">
      <span>{icon}</span>
      {label}
    </span>
  );
}

function MetaRow({ label, value }) {
  return (
    <p>
      <span className="text-gray-500 font-medium">{label}: </span>
      {value}
    </p>
  );
}

function formatDate(date) {
  return new Date(date).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}