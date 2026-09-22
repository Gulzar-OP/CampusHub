import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  PackagePlus,
  MapPin,
  IndianRupee,
  Image as ImageIcon,
  FileText,
  Upload,
  X,
} from "lucide-react";

import api from "../services/api";

export default function CreateItem() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "lost",
    name: "",
    category: "others",
    description: "",
    location: "",
    price: 0,
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Image preview
  useEffect(() => {
    if (!image) {
      setPreview("");
      return;
    }

    const objectUrl = URL.createObjectURL(image);

    setPreview(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [image]);

  const handleImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // image validation
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    // optional: 5 MB limit
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5 MB.");
      return;
    }

    setError("");
    setImage(file);
  };

  const removeImage = () => {
    setImage(null);
    setPreview("");
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("name", form.name);
      formData.append("category", form.category);
      formData.append("description", form.description);
      formData.append("location", form.location);

      // sell hai tabhi price bhejo
      if (form.title === "sell") {
        formData.append("price", form.price);
      }

      // image selected hai tabhi bhejo
      if (image) {
        formData.append("image", image);
      }

      const res = await api.post("/items", formData);

      navigate(`/items/${res.data.item._id}`);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to create item"
      );
    } finally {
      setLoading(false);
    }
  };

  const postTypes = [
    {
      value: "lost",
      label: "Lost",
      emoji: "🔎",
    },
    {
      value: "found",
      label: "Found",
      emoji: "✅",
    },
    {
      value: "sell",
      label: "Sell",
      emoji: "🛍️",
    },
    {
      value: "needs",
      label: "Need",
      emoji: "🙋",
    },
  ];

  const categories = [
    "books",
    "electronics",
    "cycle",
    "clothes",
    "furniture",
    "keys",
    "others",
  ];

  return (
    <div className="mx-auto max-w-4xl">
      {/* ================= HEADER ================= */}

      <div className="mb-8">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <PackagePlus size={24} />
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Create a new post
        </h1>

        <p className="mt-2 text-sm leading-6 text-gray-500 sm:text-base">
          Help your campus community find, sell or request items.
        </p>
      </div>

      {/* ================= FORM ================= */}

      <form
        onSubmit={submit}
        encType="multipart/form-data"
        className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8"
      >
        {/* ================= POST TYPE ================= */}

        <div>
          <label className="mb-3 block text-sm font-semibold text-gray-800">
            Post type
          </label>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {postTypes.map((type) => {
              const active = form.title === type.value;

              return (
                <button
                  type="button"
                  key={type.value}
                  onClick={() => set("title", type.value)}
                  className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                    active
                      ? "border-indigo-600 bg-indigo-600 text-white shadow-sm"
                      : "border-gray-200 bg-white text-gray-600 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                  }`}
                >
                  <span>{type.emoji}</span>

                  {type.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="my-7 border-t border-gray-100" />

        {/* ================= NAME + CATEGORY ================= */}

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Item name
              <span className="ml-1 text-red-500">*</span>
            </label>

            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Black backpack"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Category
            </label>

            <select
              value={form.category}
              onChange={(e) =>
                set("category", e.target.value)
              }
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm capitalize text-gray-900 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
            >
              {categories.map((category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ================= DESCRIPTION ================= */}

        <div className="mt-5">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Description
          </label>

          <div className="relative">
            <FileText
              size={18}
              className="absolute left-4 top-4 text-gray-400"
            />

            <textarea
              rows={5}
              value={form.description}
              onChange={(e) =>
                set("description", e.target.value)
              }
              placeholder="Describe the item, identifying details, condition, where you saw it, etc."
              className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm leading-6 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
            />
          </div>
        </div>

        {/* ================= LOCATION + PRICE ================= */}

        <div
          className={`mt-5 grid gap-5 ${
            form.title === "sell"
              ? "sm:grid-cols-2"
              : "grid-cols-1"
          }`}
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Location
            </label>

            <div className="relative">
              <MapPin
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={form.location}
                onChange={(e) =>
                  set("location", e.target.value)
                }
                placeholder="Hostel A / Library / CSE Block"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
              />
            </div>
          </div>

          {form.title === "sell" && (
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Price
              </label>

              <div className="relative">
                <IndianRupee
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(e) =>
                    set(
                      "price",
                      Number(e.target.value)
                    )
                  }
                  placeholder="0"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                />
              </div>
            </div>
          )}
        </div>

        {/* ================= IMAGE UPLOAD ================= */}

        <div className="mt-5">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Item image
          </label>

          {!preview ? (
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 px-6 py-10 text-center transition hover:border-indigo-300 hover:bg-indigo-50/40">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Upload size={22} />
              </div>

              <p className="text-sm font-semibold text-gray-700">
                Upload an image
              </p>

              <p className="mt-1 text-xs text-gray-400">
                PNG, JPG, JPEG or WEBP · Max 5 MB
              </p>

              <input
                type="file"
                name="image"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleImage}
                className="hidden"
              />
            </label>
          ) : (
            <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
              <img
                src={preview}
                alt="Item preview"
                className="max-h-80 w-full object-contain"
              />

              <button
                type="button"
                onClick={removeImage}
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black"
              >
                <X size={17} />
              </button>
            </div>
          )}

          <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
            <ImageIcon size={14} />

            Image is optional.
          </div>
        </div>

        {/* ================= ERROR ================= */}

        {error && (
          <div className="mt-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* ================= SUBMIT ================= */}

        <button
          type="submit"
          disabled={loading}
          className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
        >
          <PackagePlus size={18} />

          {loading
            ? "Posting item..."
            : "Post item"}
        </button>
      </form>
    </div>
  );
}