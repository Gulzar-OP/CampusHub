
import React, { useEffect, useState } from "react";

import {
  useNavigate,
  useParams,
  Link,
} from "react-router-dom";

import {
  ArrowLeft,
  Pencil,
  MapPin,
  IndianRupee,
  Image as ImageIcon,
  FileText,
  Save,
  Upload,
  X,
  Package,
} from "lucide-react";

import api from "../services/api";

export default function EditItem() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "lost",
    name: "",
    category: "others",
    description: "",
    location: "",
    price: 0,
    status: "open",
  });

  // old Cloudinary image
  const [existingImage, setExistingImage] = useState("");

  // newly selected image
  const [image, setImage] = useState(null);

  // local preview
  const [preview, setPreview] = useState("");

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [error, setError] = useState("");

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

  const statuses = [
    "open",
    "claimed",
    "sold",
  ];

  const set = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  /* ========================================
     LOAD EXISTING ITEM
  ======================================== */

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);

        setError("");

        const res = await api.get(
          `/items/${id}`,
        );

        const item = res.data.item;

        setForm({
          title: item.title || "lost",

          name: item.name || "",

          category:
            item.category || "others",

          description:
            item.description || "",

          location:
            item.location || "",

          price: item.price || 0,

          status: item.status || "open",
        });

        setExistingImage(
          item.image || "",
        );
      } catch (err) {
        console.error(err);

        setError(
          err.response?.data?.message ||
            "Failed to load item",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  /* ========================================
     NEW IMAGE PREVIEW
  ======================================== */

  useEffect(() => {
    if (!image) {
      setPreview("");
      return;
    }

    const objectURL =
      URL.createObjectURL(image);

    setPreview(objectURL);

    return () => {
      URL.revokeObjectURL(
        objectURL,
      );
    };
  }, [image]);

  /* ========================================
     IMAGE SELECT
  ======================================== */

  const handleImage = (e) => {
    const file =
      e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError(
        "Please select a valid image file.",
      );

      return;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      setError(
        "Image size must be less than 5 MB.",
      );

      return;
    }

    setError("");

    setImage(file);
  };

  /* ========================================
     REMOVE NEW SELECTED IMAGE
  ======================================== */

  const removeNewImage = () => {
    setImage(null);

    setPreview("");
  };

  /* ========================================
     UPDATE ITEM
  ======================================== */

  const submit = async (e) => {
    e.preventDefault();

    try {
      setUpdating(true);

      setError("");

      const formData =
        new FormData();

      formData.append(
        "title",
        form.title,
      );

      formData.append(
        "name",
        form.name,
      );

      formData.append(
        "category",
        form.category,
      );

      formData.append(
        "description",
        form.description,
      );

      formData.append(
        "location",
        form.location,
      );

      formData.append(
        "status",
        form.status,
      );

      // price only for sell
      if (
        form.title === "sell"
      ) {
        formData.append(
          "price",
          form.price,
        );
      } else {
        formData.append(
          "price",
          0,
        );
      }

      // only send image when user selects a new one
      if (image) {
        formData.append(
          "image",
          image,
        );
      }

      /* DEBUG */

      for (
        const [key, value]
        of formData.entries()
      ) {
        console.log(
          key,
          value,
        );
      }

      const res = await api.put(
        `/items/${id}`,
        formData,
      );

      navigate(
        `/items/${
          res.data.item?._id ||
          id
        }`,
      );
    } catch (err) {
      console.error(
        "UPDATE ERROR:",
        err,
      );

      setError(
        err.response?.data?.message ||
          "Failed to update item",
      );
    } finally {
      setUpdating(false);
    }
  };

  /* ========================================
     LOADING
  ======================================== */

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="animate-pulse rounded-3xl border border-gray-200 bg-white p-8">
          <div className="h-10 w-48 rounded bg-gray-200" />

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <div className="h-12 rounded-xl bg-gray-100" />

            <div className="h-12 rounded-xl bg-gray-100" />
          </div>

          <div className="mt-5 h-32 rounded-xl bg-gray-100" />
        </div>
      </div>
    );
  }

  /* ========================================
     ERROR
  ======================================== */

  if (
    error &&
    !form.name
  ) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white">
        <Package
          size={40}
          className="text-gray-300"
        />

        <h2 className="mt-4 text-xl font-bold text-gray-900">
          Item not found
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          {error}
        </p>

        <Link
          to="/items"
          className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white"
        >
          Back to items
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">

      {/* ================= BACK ================= */}

      <Link
        to={`/items/${id}`}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-indigo-600"
      >
        <ArrowLeft size={17} />

        Back to item
      </Link>

      {/* ================= HEADER ================= */}

      <div className="mb-8">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <Pencil size={23} />
        </div>

        <h1 className="text-3xl font-bold text-gray-900">
          Edit item
        </h1>

        <p className="mt-2 text-gray-500">
          Update your item information.
        </p>
      </div>

      {/* ================= FORM ================= */}

      <form
        onSubmit={submit}
        encType="multipart/form-data"
        className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8"
      >

        {/* ================= TYPE ================= */}

        <div>
          <label className="mb-3 block text-sm font-semibold text-gray-800">
            Post type
          </label>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {postTypes.map(
              (type) => {
                const active =
                  form.title ===
                  type.value;

                return (
                  <button
                    type="button"
                    key={type.value}
                    onClick={() =>
                      set(
                        "title",
                        type.value,
                      )
                    }
                    className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                      active
                        ? "border-indigo-600 bg-indigo-600 text-white"
                        : "border-gray-200 text-gray-600 hover:bg-indigo-50"
                    }`}
                  >
                    <span>
                      {type.emoji}
                    </span>

                    {type.label}
                  </button>
                );
              },
            )}
          </div>
        </div>

        <div className="my-7 border-t border-gray-100" />

        {/* ================= NAME CATEGORY ================= */}

        <div className="grid gap-5 sm:grid-cols-2">

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Item name *
            </label>

            <input
              type="text"
              required
              value={form.name}
              onChange={(e) =>
                set(
                  "name",
                  e.target.value,
                )
              }
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Category
            </label>

            <select
              value={
                form.category
              }
              onChange={(e) =>
                set(
                  "category",
                  e.target.value,
                )
              }
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-indigo-400"
            >
              {categories.map(
                (category) => (
                  <option
                    key={
                      category
                    }
                    value={
                      category
                    }
                  >
                    {category}
                  </option>
                ),
              )}
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
              value={
                form.description
              }
              onChange={(e) =>
                set(
                  "description",
                  e.target.value,
                )
              }
              className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
            />
          </div>
        </div>

        {/* ================= LOCATION PRICE ================= */}

        <div
          className={`mt-5 grid gap-5 ${
            form.title === "sell"
              ? "sm:grid-cols-2"
              : ""
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
                value={
                  form.location
                }
                onChange={(e) =>
                  set(
                    "location",
                    e.target.value,
                  )
                }
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 outline-none focus:border-indigo-400"
              />
            </div>
          </div>

          {form.title ===
            "sell" && (
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
                  value={
                    form.price
                  }
                  onChange={(e) =>
                    set(
                      "price",
                      Number(
                        e.target
                          .value,
                      ),
                    )
                  }
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 outline-none"
                />
              </div>
            </div>
          )}

        </div>

        {/* ================= STATUS ================= */}

        <div className="mt-5">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Status
          </label>

          <select
            value={form.status}
            onChange={(e) =>
              set(
                "status",
                e.target.value,
              )
            }
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 capitalize outline-none focus:border-indigo-400"
          >
            {statuses.map(
              (status) => (
                <option
                  key={status}
                  value={status}
                >
                  {status}
                </option>
              ),
            )}
          </select>
        </div>

        {/* ================= IMAGE ================= */}

        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Item image
          </label>

          {/* NEW IMAGE PREVIEW */}

          {preview ? (
            <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
              <img
                src={preview}
                alt="New preview"
                className="max-h-80 w-full object-contain"
              />

              <button
                type="button"
                onClick={
                  removeNewImage
                }
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white"
              >
                <X size={17} />
              </button>

              <div className="absolute bottom-3 left-3 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white">
                New image
              </div>
            </div>
          ) : existingImage ? (
            /* EXISTING IMAGE */

            <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
              <img
                src={
                  existingImage
                }
                alt="Current item"
                className="max-h-80 w-full object-contain"
              />

              <div className="absolute bottom-3 left-3 rounded-lg bg-black/60 px-3 py-1.5 text-xs font-semibold text-white">
                Current image
              </div>
            </div>
          ) : (
            <div className="flex min-h-48 items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50">
              <div className="text-center">
                <ImageIcon
                  size={32}
                  className="mx-auto text-gray-300"
                />

                <p className="mt-2 text-sm text-gray-400">
                  No image
                </p>
              </div>
            </div>
          )}

          {/* UPLOAD NEW IMAGE */}

          {!preview && (
            <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600">
              <Upload
                size={18}
              />

              {existingImage
                ? "Change image"
                : "Upload image"}

              <input
                type="file"
                name="image"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={
                  handleImage
                }
                className="hidden"
              />
            </label>
          )}

          <p className="mt-2 text-xs text-gray-400">
            PNG, JPG, JPEG or WEBP
            · Max 5 MB
          </p>
        </div>

        {/* ================= ERROR ================= */}

        {error && (
          <div className="mt-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* ================= ACTIONS ================= */}

        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">

          <Link
            to={`/items/${id}`}
            className="flex items-center justify-center rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={updating}
            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save size={18} />

            {updating
              ? "Saving..."
              : "Save changes"}
          </button>

        </div>
      </form>
    </div>
  );
}

