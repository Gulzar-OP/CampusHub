import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  MessageCircle,
  ArrowRight,
  PlusCircle,
} from "lucide-react";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import ItemCard from "../components/ItemCard";

export default function Home() {
  const { user } = useAuth();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);

        const res = await api.get("/items", {
          params: {
            limit: 4,
            status: "all",
          },
        });

        setItems(res.data.items || []);
      } catch (error) {
        console.error("Failed to fetch items:", error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const quickActions = [
    {
      to: "/create-item",
      icon: PlusCircle,
      title: "Post an Item",
      subtitle: "Lost, found, sell or need",
    },
    {
      to: "/discussions",
      icon: MessageCircle,
      title: "Discuss",
      subtitle: "Ask, share and connect",
    },
  ];

  return (
    <div>
      {/* ================= HERO ================= */}

      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-700 px-6 py-12 text-white shadow-lg md:px-12 md:py-16">
        {/* Decorations */}

        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10" />

        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-white/5" />

        <div className="relative z-10 flex flex-col items-center justify-between gap-10 md:flex-row">
          {/* Left */}

          <div className="max-w-2xl">
            <p className="mb-4 text-xs font-bold tracking-[0.25em] text-indigo-200 md:text-sm">
              WELCOME TO CAMPUSHUB
            </p>

            <h1 className="mb-6 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
              Same Campus.
              <br />
              More Possibilities.
            </h1>

            <p className="mb-8 max-w-xl text-base leading-7 text-indigo-100 md:text-lg">
              Find lost items, buy or sell products, request things and connect
              with students around your campus.
            </p>

            <Link
              to="/items"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-indigo-600 shadow-md transition-all duration-300 hover:-translate-y-1 hover:bg-gray-100 hover:shadow-xl"
            >
              Explore CampusHub

              <ArrowRight size={18} />
            </Link>
          </div>

          {/* Right */}

          <div className="flex h-44 w-44 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/10 text-8xl shadow-2xl backdrop-blur-sm md:h-56 md:w-56 md:text-9xl">
            🎓
          </div>
        </div>
      </section>

      {/* ================= QUICK ACTIONS ================= */}

      <section className="mt-12">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Quick actions
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            What would you like to do?
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {quickActions.map(
            ({
              to,
              icon: Icon,
              title,
              subtitle,
            }) => (
              <Link
                to={to}
                key={title}
                className="group flex items-center gap-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
                  <Icon size={23} />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {title}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    {subtitle}
                  </p>
                </div>

                <ArrowRight
                  size={18}
                  className="text-gray-300 transition group-hover:translate-x-1 group-hover:text-indigo-600"
                />
              </Link>
            ),
          )}
        </div>
      </section>

      {/* ================= LATEST ITEMS ================= */}

      <section className="mt-14">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Latest on campus
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Recently posted items from students
            </p>
          </div>

          <Link
            to="/items"
            className="flex shrink-0 items-center gap-1 text-sm font-semibold text-indigo-600 transition hover:text-indigo-800"
          >
            View all

            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Loading */}

        {loading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
              >
                <div className="h-48 animate-pulse bg-gray-200" />

                <div className="space-y-3 p-5">
                  <div className="h-5 w-20 animate-pulse rounded bg-gray-200" />

                  <div className="h-6 w-2/3 animate-pulse rounded bg-gray-200" />

                  <div className="h-4 w-full animate-pulse rounded bg-gray-100" />

                  <div className="h-4 w-3/4 animate-pulse rounded bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Items */}

        {!loading && items.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((item) => (
              <ItemCard
                key={item._id}
                item={item}
              />
            ))}
          </div>
        )}

        {/* Empty */}

        {!loading && items.length === 0 && (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white px-6 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
              <Search size={28} />
            </div>

            <h3 className="text-lg font-semibold text-gray-900">
              No items yet
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Be the first student to post something.
            </p>

            <Link
              to="/create-item"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              <PlusCircle size={17} />

              Post Item
            </Link>
          </div>
        )}
      </section>

      {/* ================= REGISTER CALLOUT ================= */}

      {!user && (
        <section className="my-14">
          <div className="relative overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50 p-7">
            <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-indigo-100/50" />

            <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  New to CampusHub? 👋
                </h3>

                <p className="mt-2 max-w-xl text-sm leading-6 text-gray-600">
                  Create an account to post lost & found items, sell products,
                  request things and chat with other students.
                </p>
              </div>

              <Link
                to="/register"
                className="whitespace-nowrap rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md"
              >
                Create account
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}