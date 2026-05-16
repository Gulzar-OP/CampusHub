import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function DetailsPost() {
  const { id } = useParams();
  const [itemDetails, setItemDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/items/${id}`,
            {
          withCredentials: true,
        }
        );
        setItemDetails(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching item details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }
  const handleClaim = async () => {
    try {
        const response = await axios.put(
        `http://localhost:4000/api/items/claim/${id}`,
        {},
        {
            withCredentials: true,
        }
        );

        console.log(response.data);

        // update UI instantly
        setItemDetails(response.data.item);

        alert("Item claimed successfully");
    } catch (error) {
        console.error("Claim error:", error);

        alert(
        error.response?.data?.message || "Failed to claim item"
        );
    }
    };

  if (!itemDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">No item found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 via-white to-gray-50 px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="rounded-3xl bg-white shadow-xl border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="bg-gray-100 h-80 lg:h-full">
              <img
                src={itemDetails.image || "/default.png"}
                alt={itemDetails.name || itemDetails.title}
                className="w-full h-full object-cover object-center"
              />
            </div>

            <div className="p-6 sm:p-8">
              <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700">
                {itemDetails.title?.toUpperCase()}
              </span>

              <h1 className="mt-4 text-3xl font-bold text-gray-900">
                {itemDetails.name}
              </h1>

              {itemDetails.price && (
                <p className="mt-3 text-2xl font-semibold text-gray-900">
                  ₹{itemDetails.price}
                </p>
              )}

              <p className="mt-5 text-gray-600 leading-7">
                {itemDetails.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {itemDetails.category && (
                  <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs">
                    {itemDetails.category}
                  </span>
                )}
                {itemDetails.location && (
                  <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs">
                    📍 {itemDetails.location}
                  </span>
                )}
                {itemDetails.status && (
                  <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs">
                    {itemDetails.status}
                  </span>
                )}
                {itemDetails?.claimedBy && (
                <div>
                    👤 {itemDetails.claimedBy?.name}
                </div>
                )}
              {itemDetails?.claimedBy && (
                <div className="inline-flex flex-wrap items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                    <span className="font-medium">Claimed by:</span>
                    <span>{itemDetails.claimedBy.name || "Unknown"}</span>
                    <span className="text-gray-400">•</span>
                    <span>{itemDetails.claimedBy.email || "Unknown"}</span>
                </div>
                )}
              </div>
              <div className="mt-8">
                {itemDetails.status === "open" ? (
                    <button
                    onClick={handleClaim}
                    className="w-full rounded-2xl bg-teal-600 px-5 py-3 text-white font-semibold shadow-md transition hover:bg-teal-700"
                    >
                    Claim This Item
                    </button>
                ) : (
                    <button
                    disabled
                    className="w-full rounded-2xl bg-gray-200 px-5 py-3 text-gray-500 font-semibold cursor-not-allowed"
                    >
                    Already Claimed
                    </button>
                )}
                </div>
              

              <div className="mt-8 pt-6 border-t border-gray-100 space-y-2 text-sm text-gray-500">
                <p><span className="font-medium text-gray-700">Contact:</span> {itemDetails.contact || "-"}</p>
                <p><span className="font-medium text-gray-700">Created:</span> {itemDetails.createdAt ? formatDate(itemDetails.createdAt) : "-"}</p>
                <p><span className="font-medium text-gray-700">Updated:</span> {itemDetails.updatedAt ? formatDate(itemDetails.updatedAt) : "-"}</p>
              </div>
            </div>
          </div>
        </div>
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