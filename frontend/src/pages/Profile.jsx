import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Mail, MapPin, GraduationCap, Package, BookMarked,
  Star, ShoppingBag, Edit3, ChevronRight, Plus,
  TrendingUp, Clock, CheckCircle2, Award, Phone
} from "lucide-react";

/* ── Helpers ── */
const ORDINAL = ["", "1st", "2nd", "3rd", "4th", "5th"];

function normaliseUser(raw) {
  const yearLabel = ORDINAL[raw.year] ?? `${raw.year}th`;
  // "Computer Science and Engineering (AIML)" → "CSE (AIML)"  (optional abbreviation)
  const branchShort = raw.branch ?? "";
  const joinedAt = raw.createdAt
    ? new Date(raw.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
    : "–";

  return {
    name:           raw.name            ?? "Unknown",
    email:          raw.email           ?? "",
    phone:          raw.phone           ?? "",
    college:        raw.college         ?? "",
    location:       raw.address         ?? "",          // address → location
    year:           `${yearLabel} Year · ${branchShort}`,
    joinedAt,
    avatar:         raw.avatar          ?? null,
    isVerified:     raw.isVerified      ?? false,
    role:           raw.role            ?? "student",
    // Stats — API doesn't return these yet; keep as 0 until wired
    listings:       raw.listingsCount   ?? 0,
    sold:           raw.soldCount       ?? 0,
    saved:          raw.savedItems?.length ?? 0,
    rating:         raw.rating          ?? "–",
    reviews:        raw.reviewsCount    ?? 0,
    recentListings: raw.recentListings  ?? [],
    posts:         raw.posts            ?? [],
  };
}

/* ── Fallback mock (shown when API is unreachable) ── */
const MOCK_USER_RAW = {
  name: "Aarav Sharma",
  email: "aarav@campus.edu",
  phone: "9876543210",
  college: "IIT Siliguri",
  address: "Siliguri, WB",
  branch: "Computer Science and Engineering",
  year: 3,
  role: "student",
  isVerified: true,
  savedItems: [{}, {}, {}, {}, {}, {}, {}, {}],
  createdAt: "2023-08-01T00:00:00.000Z",
  listingsCount: 12,
  soldCount: 5,
  rating: 4.8,
  reviewsCount: 14,
  recentListings: [
    { id: 1, name: "Mechanical Keyboard",       price: 1800, status: "active", category: "Electronics" },
    { id: 2, name: "Engineering Maths Textbook", price: 250,  status: "sold",   category: "Books" },
    { id: 3, name: "Desk Lamp",                  price: 400,  status: "active", category: "Furniture" },
  ],
};

/* ── Stat card ── */
function StatCard({ icon: Icon, label, value, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex-1 rounded-2xl p-4 flex flex-col items-center gap-1"
      style={{
        background: "rgba(255,255,255,0.7)",
        border: "1px solid rgba(255,255,255,0.9)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
      }}
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-1 ${color}`}>
        <Icon size={17} />
      </div>
      <span className="text-xl font-bold text-gray-800">{value}</span>
      <span className="text-[11px] text-gray-400 uppercase tracking-widest font-medium">{label}</span>
    </motion.div>
  );
}

/* ── Listing row ── */
function ListingRow({ item, delay }) {
  const isActive = item.status === "active";
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="flex items-center gap-4 p-3 rounded-xl hover:bg-teal-50/60 transition-all group cursor-pointer"
    >
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-100 to-teal-50 flex items-center justify-center shrink-0 border border-teal-100">
        <Package size={16} className="text-teal-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
        <p className="text-xs text-gray-400">{item.category}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-sm font-bold text-gray-800">₹{item.price}</p>
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
          isActive ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-500"
        }`}>
          {isActive ? "Active" : "Sold"}
        </span>
      </div>
      <ChevronRight size={14} className="text-gray-300 group-hover:text-teal-500 transition-colors" />
    </motion.div>
  );
}

/* ── Main Component ── */
export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("listings");
  // const [posts, setPosts] = useState([]);
  const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`${API}/api/auth/me`, {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          // console.log("User profile fetched successfully:", data.posts);
          // API may return { savedUser: {...} } on register, or the user object directly on /me
          const raw = data.savedUser ?? data.user ?? data;
          setUser(normaliseUser(raw));
        } else {
          setUser(normaliseUser(MOCK_USER_RAW));
        }
      } catch {
        setUser(normaliseUser(MOCK_USER_RAW));
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  // setPosts(user?.posts);
  const totalPosts = user?.posts?.reduce((sum) => sum + 1, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-teal-50 via-white to-gray-50 flex items-center justify-center">
        <motion.div className="flex gap-2" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.2, repeat: Infinity }}>
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-2.5 h-2.5 rounded-full bg-teal-400" />
          ))}
        </motion.div>
      </div>
    );
  }

  const u = user;
  const initials = u.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-teal-50 via-white to-gray-50 px-4 py-10"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700&display=swap');`}</style>

      <div className="max-w-2xl mx-auto space-y-5">

        {/* ── Hero card ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-3xl overflow-hidden relative"
          style={{
            background: "rgba(255,255,255,0.75)",
            border: "1px solid rgba(255,255,255,0.9)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 8px 40px rgba(13,148,136,0.10), 0 1px 0 rgba(255,255,255,0.8) inset",
          }}
        >
          {/* Gradient banner */}
          <div
            className="h-28 relative"
            style={{ background: "linear-gradient(135deg, #0d9488 0%, #0f766e 50%, #134e4a 100%)" }}
          >
            <div className="absolute top-4 right-8 w-20 h-20 rounded-full bg-white/10" />
            <div className="absolute -top-2 right-20 w-12 h-12 rounded-full bg-white/10" />
            <div className="absolute top-8 right-32 w-6 h-6 rounded-full bg-white/15" />

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 text-white text-xs font-medium backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all"
            >
              <Edit3 size={12} />
              Edit Profile
            </motion.button>
          </div>

          {/* Avatar + info */}
          <div className="px-6 pb-6">
            <div className="flex items-end gap-4 -mt-10 mb-5">
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5, type: "spring", bounce: 0.3 }}
                className="relative shrink-0"
              >
                <div
                  className="w-20 h-20 rounded-2xl border-4 border-white flex items-center justify-center text-xl font-bold text-white overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, #14b8a6, #0f766e)",
                    boxShadow: "0 4px 20px rgba(13,148,136,0.3)",
                  }}
                >
                  {u.avatar
                    ? <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                    : initials}
                </div>
                {/* Green dot = online / verified */}
                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 border-2 border-white" />
              </motion.div>

              <div className="pb-1 flex-1">
                <div className="flex relative items-center justify-between flex-wrap gap-2">
                  <div>
                    <h1 className="z-999 -top-10 absolute text-2xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {u.name}
                    </h1>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star size={12} className="text-amber-400 fill-amber-400" />
                      <span className="text-sm font-semibold text-gray-700">{u.rating}</span>
                      <span className="text-xs text-gray-400">({u.reviews} reviews)</span>
                    </div>
                  </div>
                  <span className="text-[11px] px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 font-semibold border border-teal-100">
                    {u.isVerified ? "✅ Verified Student" : "🎓 Student"}
                  </span>
                </div>
              </div>
            </div>

            {/* Meta info — now includes phone from API */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: Mail,          text: u.email,    show: !!u.email },
                { icon: Phone,         text: u.phone,    show: !!u.phone },
                { icon: GraduationCap, text: u.year,     show: !!u.year },
                { icon: MapPin,        text: u.location, show: !!u.location },
                { icon: Clock,         text: `Joined ${u.joinedAt}`, show: true },
                { icon: GraduationCap, text: u.college,  show: !!u.college },
              ]
                .filter((m) => m.show)
                .map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-gray-500 text-xs">
                    <Icon size={13} className="text-teal-500 shrink-0" />
                    <span className="truncate">{text}</span>
                  </div>
                ))}
            </div>
          </div>
        </motion.div>

        {/* ── Stats row ── */}
        <div className="flex gap-3">
          <StatCard icon={Package}     label="Posts" value={totalPosts} color="bg-teal-100 text-teal-600"      delay={0.2}  />
          <StatCard icon={CheckCircle2} label="Sold"    value={u.sold}     color="bg-emerald-100 text-emerald-600" delay={0.28} />
          <StatCard icon={BookMarked}  label="Saved"    value={u.saved}    color="bg-amber-100 text-amber-600"     delay={0.36} />
          <StatCard icon={Award}       label="Rating"   value={u.rating}   color="bg-indigo-100 text-indigo-600"   delay={0.44} />
        </div>

        {/* ── Listings & Activity ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="rounded-3xl overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.75)",
            border: "1px solid rgba(255,255,255,0.9)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
          }}
        >
          <div className="flex border-b border-gray-100 px-4 pt-4 gap-1">
            {[
              { id: "listings", label: "My Listings", icon: Package },
              { id: "activity", label: "Activity",    icon: TrendingUp },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-xl transition-all border-b-2 -mb-px ${
                  activeTab === id
                    ? "border-teal-600 text-teal-700 bg-teal-50/60"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>

          <div className="p-4">
            {activeTab === "listings" ? (
              <>
                {u.recentListings?.length > 0 ? (
                  <div className="space-y-1">
                    {u.recentListings.map((item, i) => (
                      <ListingRow key={item.id ?? item._id} item={item} delay={0.1 + i * 0.07} />
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-gray-400 text-sm">No listings yet.</div>
                )}

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-4 flex gap-2"
                >
                  <Link
                    to="/my-posts"
                    className="flex-1 text-center text-sm py-2.5 rounded-xl border border-teal-200 text-teal-700 font-medium hover:bg-teal-50 transition-all"
                  >
                    View All
                  </Link>
                  <Link
                    to="/create-listing"
                    className="flex items-center justify-center gap-2 flex-1 text-sm py-2.5 rounded-xl bg-teal-600 text-white font-medium hover:bg-teal-700 transition-all shadow-md shadow-teal-200"
                  >
                    <Plus size={14} />
                    New Listing
                  </Link>
                </motion.div>
              </>
            ) : (
              <div className="space-y-3 py-1">
                {[
                  { icon: ShoppingBag,  color: "bg-teal-100 text-teal-600",       label: "Listed Mechanical Keyboard",      time: "2 hrs ago" },
                  { icon: Star,         color: "bg-amber-100 text-amber-500",      label: "Received a 5-star review",        time: "Yesterday" },
                  { icon: CheckCircle2, color: "bg-emerald-100 text-emerald-600",  label: "Sold Engineering Maths Textbook", time: "3 days ago" },
                ].map(({ icon: Icon, color, label, time }, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                    className="flex items-center gap-3"
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                      <Icon size={15} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700">{label}</p>
                      <p className="text-xs text-gray-400">{time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* ── Quick actions ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5 }}
          className="grid grid-cols-2 gap-3"
        >
          {[
            { label: "Saved Items", icon: BookMarked,  to: "/saved",   color: "from-amber-50 to-yellow-50",  border: "border-amber-100",  text: "text-amber-700",  iconBg: "bg-amber-100 text-amber-600" },
            { label: "My Orders",   icon: ShoppingBag, to: "/orders",  color: "from-indigo-50 to-blue-50",   border: "border-indigo-100", text: "text-indigo-700", iconBg: "bg-indigo-100 text-indigo-600" },
          ].map(({ label, icon: Icon, to, color, border, text, iconBg }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-br ${color} border ${border} hover:shadow-md transition-all group`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
                <Icon size={17} />
              </div>
              <div>
                <p className={`text-sm font-semibold ${text}`}>{label}</p>
                <p className="text-xs text-gray-400">View all</p>
              </div>
              <ChevronRight size={14} className="ml-auto text-gray-300 group-hover:text-gray-500 transition-colors" />
            </Link>
          ))}
        </motion.div>

      </div>
    </div>
  );
}