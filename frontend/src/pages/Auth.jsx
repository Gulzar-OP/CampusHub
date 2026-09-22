import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  GraduationCap,
  Mail,
  Lock,
  User,
  BookOpen,
  CalendarDays,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await login(form);

      navigate("/");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Login failed. Please check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your CampusHub account"
    >
      <form onSubmit={submit} className="mt-8 space-y-5">
        {/* Email */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Email
          </label>

          <div className="relative">
            <Mail
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="email"
              required
              value={form.email}
              placeholder="you@college.edu"
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Password
          </label>

          <div className="relative">
            <Lock
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="password"
              required
              value={form.password}
              placeholder="Enter your password"
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value,
                })
              }
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Login"}
        </button>

        {/* Register */}
        <p className="text-center text-sm text-gray-500">
          No account?{" "}
          <Link
            to="/register"
            className="font-semibold text-indigo-600 transition hover:text-indigo-700"
          >
            Sign up
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    course: "B.Tech CSE",
    year: "3rd Year",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await register(form);

      navigate("/");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join your campus community"
    >
      <form onSubmit={submit} className="mt-8 space-y-5">
        {/* Name */}
        <InputField
          label="Name"
          icon={User}
          value={form.name}
          placeholder="Your full name"
          required
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
        />

        {/* Email */}
        <InputField
          label="Email"
          icon={Mail}
          type="email"
          value={form.email}
          placeholder="you@college.edu"
          required
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value,
            })
          }
        />

        {/* Password */}
        <InputField
          label="Password"
          icon={Lock}
          type="password"
          value={form.password}
          placeholder="Create a strong password"
          required
          onChange={(e) =>
            setForm({
              ...form,
              password: e.target.value,
            })
          }
        />

        {/* Course */}
        <InputField
          label="Course"
          icon={BookOpen}
          value={form.course}
          placeholder="B.Tech CSE"
          onChange={(e) =>
            setForm({
              ...form,
              course: e.target.value,
            })
          }
        />

        {/* Year */}
        <InputField
          label="Year"
          icon={CalendarDays}
          value={form.year}
          placeholder="3rd Year"
          onChange={(e) =>
            setForm({
              ...form,
              year: e.target.value,
            })
          }
        />

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>

        {/* Login */}
        <p className="text-center text-sm text-gray-500">
          Already registered?{" "}
          <Link
            to="/login"
            className="font-semibold text-indigo-600 transition hover:text-indigo-700"
          >
            Login
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}

function InputField({
  label,
  icon: Icon,
  type = "text",
  value,
  placeholder,
  required = false,
  onChange,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <div className="relative">
        <Icon
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type={type}
          value={value}
          required={required}
          placeholder={placeholder}
          onChange={onChange}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
        />
      </div>
    </div>
  );
}

function AuthShell({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-gray-50 lg:grid lg:grid-cols-2">

      {/* ================= LEFT FORM ================= */}

      <div className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:px-12">

        <div className="w-full max-w-md">

          {/* Brand */}
          <Link
            to="/"
            className="mb-10 inline-flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
              <GraduationCap size={25} />
            </div>

            <span className="text-xl font-semibold text-gray-900">
              Campus
              <span className="font-bold text-indigo-600">
                Hub
              </span>
            </span>
          </Link>

          {/* Heading */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {title}
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-500 sm:text-base">
              {subtitle}
            </p>
          </div>

          {children}

        </div>

      </div>

      {/* ================= RIGHT ART ================= */}

      <div className="relative hidden min-h-screen overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-700 lg:flex lg:items-center lg:justify-center">

        {/* Decorations */}
        <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-white/10" />

        <div className="absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-white/10" />

        <div className="absolute left-1/4 top-1/4 h-40 w-40 rounded-full bg-white/5" />

        {/* Content */}
        <div className="relative z-10 max-w-lg px-12 text-center text-white">

          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-white/10 backdrop-blur-md">
            <GraduationCap size={54} />
          </div>

          <h2 className="text-4xl font-bold leading-tight xl:text-5xl">
            Same Campus.
            <br />
            More Possibilities.
          </h2>

          <p className="mt-6 text-lg text-indigo-100">
            Find. Connect. Grow.
          </p>

          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-indigo-100/80">
            A single place for students to find lost items, buy and sell,
            discuss ideas, connect with others and stay active on campus.
          </p>

        </div>

      </div>

    </div>
  );
}