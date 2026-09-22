
import React, { useEffect, useState } from "react";
import {
  Users,
  CalendarDays,
  MapPin,
  MessageCircle,
  Heart,
  Plus,
  Sparkles,
} from "lucide-react";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

/* =========================================================
   CLUBS
========================================================= */

export function Clubs() {
  const { user } = useAuth();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joiningId, setJoiningId] = useState(null);

  const load = async () => {
    try {
      const res = await api.get("/community/clubs");

      setData(res.data.clubs || []);
    } catch (error) {
      console.error("Failed to load clubs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const join = async (id) => {
    if (!user) {
      return alert("Login first");
    }

    try {
      setJoiningId(id);

      await api.post(
        `/community/clubs/${id}/join`,
      );

      await load();
    } catch (error) {
      console.error(
        "Failed to update club membership:",
        error,
      );
    } finally {
      setJoiningId(null);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <Users size={24} />
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Clubs & Societies
        </h1>

        <p className="mt-2 text-sm text-gray-500 sm:text-base">
          Discover communities that match your interests.
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(
            (item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl border border-gray-200 bg-white p-6"
              >
                <div className="mb-5 h-14 w-14 rounded-2xl bg-gray-200" />

                <div className="h-6 w-2/3 rounded bg-gray-200" />

                <div className="mt-3 h-5 w-24 rounded-full bg-gray-100" />

                <div className="mt-5 h-4 w-full rounded bg-gray-100" />

                <div className="mt-2 h-4 w-3/4 rounded bg-gray-100" />
              </div>
            ),
          )}
        </div>
      )}

      {/* Clubs */}
      {!loading && data.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((club) => {
            const joined =
              club.members?.includes(
                user?._id,
              );

            return (
              <div
                key={club._id}
                className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Icon */}
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-3xl transition group-hover:bg-indigo-100">
                  {club.icon || "🎓"}
                </div>

                {/* Name */}
                <h3 className="text-xl font-bold text-gray-900">
                  {club.name}
                </h3>

                {/* Category */}
                <span className="mt-3 w-fit rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                  {club.category}
                </span>

                {/* Description */}
                <p className="mt-4 flex-1 text-sm leading-6 text-gray-500">
                  {club.description ||
                    "No description provided."}
                </p>

                {/* Members */}
                <div className="mt-5 flex items-center gap-2 text-sm text-gray-500">
                  <Users size={16} />

                  <span>
                    {club.members?.length ||
                      0}{" "}
                    members
                  </span>
                </div>

                {/* Button */}
                <button
                  onClick={() =>
                    join(club._id)
                  }
                  disabled={
                    joiningId === club._id
                  }
                  className={`mt-6 w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                    joined
                      ? "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  } disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  {joiningId === club._id
                    ? "Please wait..."
                    : joined
                    ? "Leave"
                    : "Join"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty */}
      {!loading && data.length === 0 && (
        <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white text-center">
          <Users
            size={40}
            className="mb-4 text-gray-300"
          />

          <h2 className="text-lg font-semibold text-gray-800">
            No clubs yet
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Campus clubs will appear here.
          </p>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   EVENTS
========================================================= */

export function Events() {
  const { user } = useAuth();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joiningId, setJoiningId] = useState(null);

  const load = async () => {
    try {
      const res = await api.get(
        "/community/events",
      );

      setData(res.data.events || []);
    } catch (error) {
      console.error(
        "Failed to load events:",
        error,
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const join = async (id) => {
    if (!user) {
      return alert("Login first");
    }

    try {
      setJoiningId(id);

      await api.post(
        `/community/events/${id}/join`,
      );

      await load();
    } catch (error) {
      console.error(
        "Failed to update event RSVP:",
        error,
      );
    } finally {
      setJoiningId(null);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <CalendarDays size={24} />
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Campus Events
        </h1>

        <p className="mt-2 text-sm text-gray-500 sm:text-base">
          Workshops, culture, career and community events.
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(
            (item) => (
              <div
                key={item}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
              >
                <div className="h-48 animate-pulse bg-gray-200" />

                <div className="space-y-3 p-5">
                  <div className="h-5 w-20 animate-pulse rounded bg-gray-100" />

                  <div className="h-6 w-3/4 animate-pulse rounded bg-gray-200" />

                  <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
                </div>
              </div>
            ),
          )}
        </div>
      )}

      {/* Events */}
      {!loading && data.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {data.map((event) => {
            const joined =
              event.attendees?.includes(
                user?._id,
              );

            return (
              <div
                key={event._id}
                className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Cover */}
                <div className="flex h-52 items-center justify-center overflow-hidden bg-gray-100">
                  {event.image ? (
                    <img
                      src={event.image}
                      alt={event.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <span className="text-7xl">
                      🎉
                    </span>
                  )}
                </div>

                {/* Body */}
                <div className="p-5">
                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                    {event.category}
                  </span>

                  <h3 className="mt-4 text-xl font-bold text-gray-900">
                    {event.title}
                  </h3>

                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-500">
                    {event.description ||
                      "No description provided."}
                  </p>

                  {/* Date */}
                  <div className="mt-5 flex items-start gap-3 text-sm text-gray-600">
                    <CalendarDays
                      size={17}
                      className="mt-0.5 shrink-0 text-indigo-500"
                    />

                    <span>
                      {new Date(
                        event.date,
                      ).toLocaleDateString(
                        "en-IN",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        },
                      )}

                      {event.time &&
                        ` · ${event.time}`}
                    </span>
                  </div>

                  {/* Location */}
                  <div className="mt-3 flex items-start gap-3 text-sm text-gray-600">
                    <MapPin
                      size={17}
                      className="mt-0.5 shrink-0 text-indigo-500"
                    />

                    <span>
                      {event.location ||
                        "Campus"}
                    </span>
                  </div>

                  {/* Attendees */}
                  <div className="mt-3 flex items-center gap-3 text-sm text-gray-500">
                    <Users
                      size={17}
                      className="text-indigo-500"
                    />

                    <span>
                      {event.attendees
                        ?.length || 0}{" "}
                      attending
                    </span>
                  </div>

                  {/* Join */}
                  <button
                    onClick={() =>
                      join(event._id)
                    }
                    disabled={
                      joiningId ===
                      event._id
                    }
                    className={`mt-6 w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                      joined
                        ? "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                    } disabled:cursor-not-allowed disabled:opacity-50`}
                  >
                    {joiningId ===
                    event._id
                      ? "Please wait..."
                      : joined
                      ? "Cancel RSVP"
                      : "Join event"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty */}
      {!loading && data.length === 0 && (
        <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white text-center">
          <CalendarDays
            size={40}
            className="mb-4 text-gray-300"
          />

          <h2 className="text-lg font-semibold text-gray-800">
            No events yet
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Upcoming campus events will appear here.
          </p>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   DISCUSSIONS
========================================================= */

export function Discussions() {
  const { user } = useAuth();

  const [data, setData] = useState([]);

  const [form, setForm] = useState({
    title: "",
    body: "",
    category: "General",
  });

  const [loading, setLoading] =
    useState(true);

  const [posting, setPosting] =
    useState(false);

  const load = async () => {
    try {
      const res = await api.get(
        "/community/discussions",
      );

      setData(
        res.data.discussions || [],
      );
    } catch (error) {
      console.error(
        "Failed to load discussions:",
        error,
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();

    if (!user) {
      return alert("Login first");
    }

    try {
      setPosting(true);

      await api.post(
        "/community/discussions",
        form,
      );

      setForm({
        title: "",
        body: "",
        category: "General",
      });

      await load();
    } catch (error) {
      console.error(
        "Failed to create discussion:",
        error,
      );
    } finally {
      setPosting(false);
    }
  };

  const categories = [
    "General",
    "Academic",
    "Career",
    "Technology",
    "Campus",
    "Help",
  ];

  return (
    <div className="mx-auto max-w-5xl">

      {/* Header */}
      <div className="mb-8">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <MessageCircle size={24} />
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Discussions
        </h1>

        <p className="mt-2 text-sm text-gray-500 sm:text-base">
          Ask questions, share ideas and help other students.
        </p>
      </div>

      {/* ================= CREATE DISCUSSION ================= */}

      {user && (
        <form
          onSubmit={submit}
          className="mb-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"
        >
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold uppercase text-white">
              {user?.name?.[0] || "U"}
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-900">
                Start a discussion
              </p>

              <p className="text-xs text-gray-400">
                Share something with your campus
              </p>
            </div>
          </div>

          {/* Title */}
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) =>
              setForm({
                ...form,
                title: e.target.value,
              })
            }
            placeholder="Discussion title"
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
          />

          {/* Body */}
          <textarea
            rows={4}
            required
            value={form.body}
            onChange={(e) =>
              setForm({
                ...form,
                body: e.target.value,
              })
            }
            placeholder="What do you want to discuss?"
            className="mt-4 w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-gray-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
          />

          {/* Bottom */}
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <select
              value={form.category}
              onChange={(e) =>
                setForm({
                  ...form,
                  category:
                    e.target.value,
                })
              }
              className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
            >
              {categories.map(
                (category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                ),
              )}
            </select>

            <button
              type="submit"
              disabled={posting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus size={17} />

              {posting
                ? "Posting..."
                : "Post discussion"}
            </button>
          </div>
        </form>
      )}

      {/* ================= LOGIN MESSAGE ================= */}

      {!user && (
        <div className="mb-8 flex items-center gap-4 rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
          <Sparkles
            size={22}
            className="shrink-0 text-indigo-600"
          />

          <p className="text-sm text-indigo-700">
            Login to start a new discussion.
          </p>
        </div>
      )}

      {/* ================= LOADING ================= */}

      {loading && (
        <div className="space-y-5">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="animate-pulse rounded-2xl border border-gray-200 bg-white p-6"
            >
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-full bg-gray-200" />

                <div className="space-y-2">
                  <div className="h-4 w-28 rounded bg-gray-200" />

                  <div className="h-3 w-20 rounded bg-gray-100" />
                </div>
              </div>

              <div className="mt-5 h-6 w-2/3 rounded bg-gray-200" />

              <div className="mt-3 h-4 w-full rounded bg-gray-100" />

              <div className="mt-2 h-4 w-3/4 rounded bg-gray-100" />
            </div>
          ))}
        </div>
      )}

      {/* ================= DISCUSSIONS ================= */}

      {!loading && data.length > 0 && (
        <div className="space-y-5">
          {data.map((discussion) => (
            <article
              key={discussion._id}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6"
            >
              {/* User + Category */}
              <div className="flex items-start justify-between gap-4">

                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold uppercase text-white">
                    {discussion.author
                      ?.name?.[0] || "U"}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {discussion.author
                        ?.name ||
                        "Student"}
                    </p>

                    <p className="mt-0.5 truncate text-xs text-gray-400">
                      {discussion.author
                        ?.course ||
                        "CampusHub"}
                    </p>
                  </div>
                </div>

                <span className="shrink-0 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                  {discussion.category}
                </span>
              </div>

              {/* Content */}
              <div className="mt-5">
                <h3 className="text-lg font-bold text-gray-900">
                  {discussion.title}
                </h3>

                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-gray-600">
                  {discussion.body}
                </p>
              </div>

              {/* Footer */}
              <div className="mt-5 flex items-center gap-5 border-t border-gray-100 pt-4 text-sm text-gray-500">
                <div className="flex items-center gap-1.5">
                  <Heart
                    size={17}
                    className="text-gray-400"
                  />

                  <span>
                    {discussion.likes
                      ?.length || 0}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <MessageCircle
                    size={17}
                    className="text-gray-400"
                  />

                  <span>
                    {discussion.comments
                      ?.length || 0}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && data.length === 0 && (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white text-center">
          <MessageCircle
            size={40}
            className="mb-4 text-gray-300"
          />

          <h2 className="font-semibold text-gray-800">
            No discussions yet
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Be the first student to start a discussion.
          </p>
        </div>
      )}
    </div>
  );
}

