import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, Plus, PackageSearch } from "lucide-react";

import api from "../services/api";
import ItemCard from "../components/ItemCard";

export default function Items() {
  const [params, setParams] = useSearchParams();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const title = params.get("title") || "all";
  const q = params.get("q") || "";

  const [search, setSearch] = useState(q);

  const tabs = ["all", "lost", "found", "sell", "needs"];

  // keep input synced with URL
  useEffect(() => {
    setSearch(q);
  }, [q]);

  // fetch items
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);

        const res = await api.get("/items", {
          params: {
            title,
            q,
            status: "all",
            limit: 30,
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
  }, [title, q]);

  // change category
  const handleTabChange = (tab) => {
    const nextParams = {};

    if (tab !== "all") {
      nextParams.title = tab;
    }

    if (q) {
      nextParams.q = q;
    }

    setParams(nextParams);
  };

  // search
  const handleSearch = () => {
    const value = search.trim();

    setParams({
      ...(title !== "all" ? { title } : {}),
      ...(value ? { q: value } : {}),
    });
  };

  return (
    <div className="min-h-screen">
      {/* ================= HEADER ================= */}

      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Browse items
          </h1>

          <p className="mt-2 text-sm text-gray-500 md:text-base">
            Lost & found, marketplace and student needs.
          </p>
        </div>

        <Link
          to="/create-item"
          className="inline-flex w-fit items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md"
        >
          <Plus size={18} />
          Post item
        </Link>
      </div>

      {/* ================= FILTER + SEARCH ================= */}

      <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
            {tabs.map((tab) => {
              const active = title === tab;

              return (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium capitalize transition ${
                    active
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="relative w-full lg:w-80">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search items..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
            />
          </div>
        </div>
      </div>

      {/* ================= RESULT INFO ================= */}

      {!loading && (
        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-gray-800">
              {items.length}
            </span>{" "}
            {items.length === 1 ? "item" : "items"} found
          </p>

          {q && (
            <button
              onClick={() =>
                setParams(title !== "all" ? { title } : {})
              }
              className="text-sm font-medium text-indigo-600 transition hover:text-indigo-800"
            >
              Clear search
            </button>
          )}
        </div>
      )}

      {/* ================= LOADING ================= */}

      {loading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <div
              key={item}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
            >
              <div className="h-48 animate-pulse bg-gray-200" />

              <div className="space-y-3 p-5">
                <div className="h-5 w-20 animate-pulse rounded bg-gray-200" />

                <div className="h-6 w-3/4 animate-pulse rounded bg-gray-200" />

                <div className="h-4 w-full animate-pulse rounded bg-gray-100" />

                <div className="h-4 w-2/3 animate-pulse rounded bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= ITEMS ================= */}

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

      {/* ================= EMPTY ================= */}

      {!loading && items.length === 0 && (
        <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white px-6 text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
            <PackageSearch size={30} />
          </div>

          <h2 className="text-xl font-bold text-gray-900">
            No items found
          </h2>

          <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
            We couldn't find any items matching your current category or
            search.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {(title !== "all" || q) && (
              <button
                onClick={() => setParams({})}
                className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Clear filters
              </button>
            )}

            <Link
              to="/create-item"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              <Plus size={17} />
              Post item
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}