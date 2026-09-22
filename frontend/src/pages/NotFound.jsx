
import React from "react";
import { Link } from "react-router-dom";
import { Home, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-xl rounded-3xl border border-gray-200 bg-white px-6 py-12 text-center shadow-sm sm:px-10">

        {/* Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-50 text-indigo-600">
          <SearchX size={36} />
        </div>

        {/* 404 */}
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-indigo-600">
          Error 404
        </p>

        <h1 className="mt-3 text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Page not found
        </h1>

        <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-gray-500 sm:text-base">
          The page you're looking for doesn't exist, may have been removed,
          or the URL might be incorrect.
        </p>

        {/* Home Button */}
        <Link
          to="/"
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md"
        >
          <Home size={18} />
          Go Home
        </Link>
      </div>
    </div>
  );
}

