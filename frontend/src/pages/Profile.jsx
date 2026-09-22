
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import {
  Pencil,
  FileText,
  Users,
  CalendarDays,
  User,
  Trash2,
} from "lucide-react";

import api from "../services/api";
import ItemCard from "../components/ItemCard";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { id } = useParams();
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({});
  const [items, setItems] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // delete loading
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const [profileRes, itemsRes] = await Promise.all([
          api.get(`/users/${id}`),

          api.get("/items", {
            params: {
              mine: id,
              status: "all",
              limit: 20,
            },
          }),
        ]);

        setProfile(profileRes.data.user);
        setStats(profileRes.data.stats || {});
        setItems(itemsRes.data.items || []);
      } catch (err) {
        console.error("Failed to load profile:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load profile.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [id]);

  const isOwnProfile =
    user?._id === profile?._id;

  // ==========================================
  // DELETE ITEM
  // ==========================================

  const handleDelete = async (itemId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this item?",
    );

    if (!confirmed) return;

    try {
      setDeletingId(itemId);

      await api.delete(`/items/${itemId}`);

      // UI se instantly remove
      setItems((prev) =>
        prev.filter(
          (item) => item._id !== itemId,
        ),
      );

      // post count decrease
      setStats((prev) => ({
        ...prev,
        posts: Math.max(
          0,
          (prev.posts || 0) - 1,
        ),
      }));
    } catch (err) {
      console.error(
        "Failed to delete item:",
        err,
      );

      alert(
        err.response?.data?.message ||
          "Failed to delete item",
      );
    } finally {
      setDeletingId(null);
    }
  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div>
        <div className="animate-pulse rounded-3xl border border-gray-200 bg-white p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row">
            <div className="h-28 w-28 rounded-full bg-gray-200" />

            <div className="flex-1 space-y-4">
              <div className="h-8 w-56 rounded bg-gray-200" />

              <div className="h-4 w-40 rounded bg-gray-100" />

              <div className="h-4 w-3/4 rounded bg-gray-100" />

              <div className="flex gap-3">
                <div className="h-16 w-24 rounded-xl bg-gray-100" />
                <div className="h-16 w-24 rounded-xl bg-gray-100" />
                <div className="h-16 w-24 rounded-xl bg-gray-100" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ================= ERROR ================= */

  if (error || !profile) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white px-6 text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
          <User size={28} />
        </div>

        <h2 className="text-xl font-bold text-gray-900">
          Profile not found
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          {error ||
            "This user profile is unavailable."}
        </p>

        <Link
          to="/"
          className="mt-6 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* ================= PROFILE ================= */}

      <section className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-indigo-50" />

        <div className="absolute -bottom-20 right-32 h-40 w-40 rounded-full bg-purple-50" />

        <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-start">

          {/* Avatar */}

          <div className="shrink-0">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt={profile.name}
                className="h-28 w-28 rounded-3xl border-4 border-white object-cover shadow-md sm:h-32 sm:w-32"
              />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 text-4xl font-bold uppercase text-white shadow-md sm:h-32 sm:w-32">
                {profile.name?.[0] || "U"}
              </div>
            )}
          </div>

          {/* Information */}

          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

              <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                  {profile.name}
                </h1>

                <p className="mt-2 text-sm font-medium text-indigo-600 sm:text-base">
                  {profile.course || "Student"}

                  {profile.year &&
                    ` · ${profile.year}`}
                </p>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
                  {profile.bio ||
                    "Student at CampusHub"}
                </p>
              </div>

              {isOwnProfile && (
                <Link
                  to="/settings"
                  className="inline-flex w-fit items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                >
                  <Pencil size={16} />

                  Edit profile
                </Link>
              )}

            </div>

            {/* ================= STATS ================= */}

            <div className="mt-7 grid max-w-lg grid-cols-3 gap-3">

              {/* Posts */}

              <div className="rounded-2xl bg-gray-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-gray-400">
                  <FileText size={16} />

                  <span className="hidden text-xs sm:inline">
                    Posts
                  </span>
                </div>

                <p className="text-xl font-bold text-gray-900">
                  {stats.posts || 0}
                </p>

                <p className="mt-1 text-xs text-gray-500 sm:hidden">
                  Posts
                </p>
              </div>

              {/* Clubs */}

              <div className="rounded-2xl bg-gray-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-gray-400">
                  <Users size={16} />

                  <span className="hidden text-xs sm:inline">
                    Clubs
                  </span>
                </div>

                <p className="text-xl font-bold text-gray-900">
                  {stats.clubs || 0}
                </p>

                <p className="mt-1 text-xs text-gray-500 sm:hidden">
                  Clubs
                </p>
              </div>

              {/* Events */}

              <div className="rounded-2xl bg-gray-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-gray-400">
                  <CalendarDays size={16} />

                  <span className="hidden text-xs sm:inline">
                    Events
                  </span>
                </div>

                <p className="text-xl font-bold text-gray-900">
                  {stats.events || 0}
                </p>

                <p className="mt-1 text-xs text-gray-500 sm:hidden">
                  Events
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ================= POSTS ================= */}

      <section className="mt-10">

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Posts
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Items posted by {profile.name}
            </p>
          </div>

          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
            {items.length}{" "}
            {items.length === 1
              ? "post"
              : "posts"}
          </span>
        </div>

        {/* ================= ITEMS ================= */}

        {items.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((item) => (
              <div
                key={item._id}
                className="flex flex-col"
              >
                {/* Item Card */}

                <ItemCard item={item} />

                {/* ==========================================
                    OWNER ACTIONS
                ========================================== */}

                {isOwnProfile && (
                  <div className="mt-3 grid grid-cols-2 gap-2">

                    {/* UPDATE */}

                    <Link
                      to={`/items/${item._id}/edit`}
                      className="flex items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-600 hover:text-white"
                    >
                      <Pencil size={16} />

                      Update
                    </Link>

                    {/* DELETE */}

                    <button
                      type="button"
                      disabled={
                        deletingId === item._id
                      }
                      onClick={() =>
                        handleDelete(item._id)
                      }
                      className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Trash2 size={16} />

                      {deletingId === item._id
                        ? "Deleting..."
                        : "Delete"}
                    </button>

                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* ================= EMPTY ================= */

          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white px-6 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
              <FileText size={28} />
            </div>

            <h3 className="text-lg font-semibold text-gray-900">
              No posts yet
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
              {isOwnProfile
                ? "You haven't posted anything yet."
                : `${profile.name} hasn't posted anything yet.`}
            </p>

            {isOwnProfile && (
              <Link
                to="/create-item"
                className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                Create your first post
              </Link>
            )}
          </div>
        )}

      </section>
    </div>
  );
}

