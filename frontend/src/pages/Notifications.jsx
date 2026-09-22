
import React, { useEffect, useMemo, useState } from "react";

import {
  Bell,
  BellRing,
  CheckCheck,
} from "lucide-react";

import api from "../services/api";

export default function Notifications() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);

  const load = async () => {
    try {
      const res = await api.get("/notifications");

      setData(
        res.data.notifications || [],
      );
    } catch (error) {
      console.error(
        "Failed to load notifications:",
        error,
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const markAllRead = async () => {
    try {
      setMarkingAll(true);

      await api.patch(
        "/notifications/read-all",
      );

      await load();
    } catch (error) {
      console.error(
        "Failed to mark notifications as read:",
        error,
      );
    } finally {
      setMarkingAll(false);
    }
  };

  const unreadCount = useMemo(
    () =>
      data.filter(
        (notification) =>
          !notification.read,
      ).length,
    [data],
  );

  return (
    <div className="mx-auto max-w-5xl">

      {/* ================= HEADER ================= */}

      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <Bell size={24} />
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Notifications
          </h1>

          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            Recent activity from CampusHub.
          </p>

          {!loading &&
            unreadCount > 0 && (
              <p className="mt-2 text-sm font-medium text-indigo-600">
                {unreadCount} unread{" "}
                {unreadCount === 1
                  ? "notification"
                  : "notifications"}
              </p>
            )}
        </div>

        {/* Mark all */}
        <button
          type="button"
          onClick={markAllRead}
          disabled={
            markingAll ||
            unreadCount === 0
          }
          className="inline-flex w-fit items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <CheckCheck size={17} />

          {markingAll
            ? "Marking..."
            : "Mark all read"}
        </button>
      </div>

      {/* ================= LOADING ================= */}

      {loading && (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(
            (item) => (
              <div
                key={item}
                className="flex animate-pulse gap-4 rounded-2xl border border-gray-200 bg-white p-5"
              >
                <div className="h-11 w-11 shrink-0 rounded-xl bg-gray-200" />

                <div className="flex-1 space-y-3">
                  <div className="h-4 w-40 rounded bg-gray-200" />

                  <div className="h-4 w-3/4 rounded bg-gray-100" />

                  <div className="h-3 w-32 rounded bg-gray-100" />
                </div>
              </div>
            ),
          )}
        </div>
      )}

      {/* ================= NOTIFICATIONS ================= */}

      {!loading && data.length > 0 && (
        <div className="space-y-4">
          {data.map(
            (notification) => {
              const unread =
                !notification.read;

              return (
                <div
                  key={notification._id}
                  className={`relative flex gap-4 rounded-2xl border p-5 shadow-sm transition hover:shadow-md sm:p-6 ${
                    unread
                      ? "border-indigo-100 bg-indigo-50/50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  {/* Unread indicator */}
                  {unread && (
                    <span className="absolute right-4 top-4 h-2.5 w-2.5 rounded-full bg-indigo-600" />
                  )}

                  {/* Icon */}
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                      unread
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {unread ? (
                      <BellRing
                        size={20}
                      />
                    ) : (
                      <Bell
                        size={20}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1 pr-4">
                    <h3
                      className={`text-sm font-semibold sm:text-base ${
                        unread
                          ? "text-gray-900"
                          : "text-gray-700"
                      }`}
                    >
                      {notification.title ||
                        "Notification"}
                    </h3>

                    <p className="mt-1.5 text-sm leading-6 text-gray-500">
                      {notification.message}
                    </p>

                    <p className="mt-3 text-xs text-gray-400">
                      {notification.createdAt
                        ? new Date(
                            notification.createdAt,
                          ).toLocaleString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute:
                                "2-digit",
                            },
                          )
                        : ""}
                    </p>
                  </div>
                </div>
              );
            },
          )}
        </div>
      )}

      {/* ================= EMPTY ================= */}

      {!loading &&
        data.length === 0 && (
          <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white px-6 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
              <Bell size={28} />
            </div>

            <h2 className="text-lg font-semibold text-gray-900">
              No notifications yet
            </h2>

            <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
              When something happens on
              CampusHub, your notifications
              will appear here.
            </p>
          </div>
        )}
    </div>
  );
}

