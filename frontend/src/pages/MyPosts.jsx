import axios from "axios";
import React, { useEffect, useState } from "react";

export default function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const response = await axios.get(
          `${API}/api/items/my-posts`,
          { withCredentials: true }
        );
        setPosts(response.data);
      } catch (error) {
        console.log("Error fetching my posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 via-white to-gray-50 px-4 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            My Posts
          </h1>
          <p className="mt-2 text-gray-500">
            All items you have posted on the marketplace.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="h-80 rounded-2xl bg-white border border-gray-100 animate-pulse"
              />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-white/80 p-10 text-center text-gray-500">
            You have not posted anything yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {posts.map((item) => (
              <div
                key={item._id}
                className="group rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                <div className="h-44 bg-gray-100 overflow-hidden">
                  <img
                    src={item.image || "/default.png"}
                    alt={item.name || item.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700">
                      {item.title?.toUpperCase()}
                    </span>
                    {item.price ? (
                      <span className="text-sm font-semibold text-gray-900">
                        ₹{item.price}
                      </span>
                    ) : null}
                  </div>

                  <h3 className="mt-4 text-lg font-semibold text-gray-900">
                    {item.name}
                  </h3>

                  <p className="mt-2 text-sm text-gray-500 line-clamp-3">
                    {item.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.category && (
                      <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs">
                        {item.category}
                      </span>
                    )}
                    {item.location && (
                      <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs">
                        📍 {item.location}
                      </span>
                    )}
                    {item.status && (
                      <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs">
                        {item.status}
                      </span>
                    )}
                  </div>

                  <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                    <span>{item.createdAt ? formatDate(item.createdAt) : ""}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
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