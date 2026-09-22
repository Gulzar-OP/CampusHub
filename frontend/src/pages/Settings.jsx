
import React, { useEffect, useState } from "react";

import {
  User,
  BookOpen,
  CalendarDays,
  MapPin,
  Building2,
  Image as ImageIcon,
  FileText,
  Save,
  Settings as SettingsIcon,
} from "lucide-react";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Settings() {
  const { user, setUser } = useAuth();

  const [form, setForm] = useState({
    name: "",
    bio: "",
    course: "",
    year: "",
    hostel: "",
    location: "",
    avatar: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!user) return;

    setForm({
      name: user.name || "",
      bio: user.bio || "",
      course: user.course || "",
      year: user.year || "",
      hostel: user.hostel || "",
      location: user.location || "",
      avatar: user.avatar || "",
    });
  }, [user]);

  const set = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

    setSuccess("");
  };

  const save = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const res = await api.put(
        "/users/me/profile",
        form,
      );

      setUser(res.data.user);

      setSuccess("Profile updated successfully.");
    } catch (err) {
      console.error(
        "Failed to update profile:",
        err,
      );

      setError(
        err.response?.data?.message ||
          "Failed to update profile.",
      );
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      key: "name",
      label: "Name",
      icon: User,
      placeholder: "Your full name",
    },
    {
      key: "course",
      label: "Course",
      icon: BookOpen,
      placeholder: "e.g. B.Tech CSE",
    },
    {
      key: "year",
      label: "Year",
      icon: CalendarDays,
      placeholder: "e.g. 3rd Year",
    },
    {
      key: "hostel",
      label: "Hostel",
      icon: Building2,
      placeholder: "e.g. Hostel A",
    },
    {
      key: "location",
      label: "Location",
      icon: MapPin,
      placeholder: "Campus / City",
    },
    {
      key: "avatar",
      label: "Avatar URL",
      icon: ImageIcon,
      placeholder: "https://example.com/avatar.jpg",
    },
  ];

  return (
    <div className="mx-auto max-w-5xl">

      {/* ================= HEADER ================= */}

      <div className="mb-8">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <SettingsIcon size={24} />
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Account Settings
        </h1>

        <p className="mt-2 text-sm text-gray-500 sm:text-base">
          Update your profile and campus information.
        </p>
      </div>

      {/* ================= FORM ================= */}

      <form
        onSubmit={save}
        className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8"
      >
        {/* Profile preview */}
        <div className="mb-8 flex flex-col gap-5 border-b border-gray-100 pb-7 sm:flex-row sm:items-center">

          {/* Avatar */}
          {form.avatar ? (
            <img
              src={form.avatar}
              alt={form.name || "Profile"}
              className="h-24 w-24 rounded-3xl border border-gray-200 object-cover shadow-sm"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 text-3xl font-bold uppercase text-white shadow-sm">
              {form.name?.[0] || "U"}
            </div>
          )}

          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {form.name || "Your profile"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {form.course || "Student"}

              {form.year &&
                ` · ${form.year}`}
            </p>

            <p className="mt-2 text-xs text-gray-400">
              This information will be visible on your CampusHub profile.
            </p>
          </div>
        </div>

        {/* ================= FORM GRID ================= */}

        <div className="grid gap-5 sm:grid-cols-2">
          {fields.map(
            ({
              key,
              label,
              icon: Icon,
              placeholder,
            }) => (
              <div key={key}>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {label}
                </label>

                <div className="relative">
                  <Icon
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type={
                      key === "avatar"
                        ? "url"
                        : "text"
                    }
                    value={form[key] || ""}
                    onChange={(e) =>
                      set(
                        key,
                        e.target.value,
                      )
                    }
                    placeholder={placeholder}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                  />
                </div>
              </div>
            ),
          )}
        </div>

        {/* ================= BIO ================= */}

        <div className="mt-5">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Bio
          </label>

          <div className="relative">
            <FileText
              size={18}
              className="absolute left-4 top-4 text-gray-400"
            />

            <textarea
              rows={5}
              value={form.bio || ""}
              onChange={(e) =>
                set("bio", e.target.value)
              }
              placeholder="Tell other students a little about yourself..."
              className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm leading-6 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
            />
          </div>
        </div>

        {/* ================= ERROR ================= */}

        {error && (
          <div className="mt-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* ================= SUCCESS ================= */}

        {success && (
          <div className="mt-6 rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        {/* ================= SAVE ================= */}

        <div className="mt-7 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            <Save size={18} />

            {loading
              ? "Saving..."
              : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

