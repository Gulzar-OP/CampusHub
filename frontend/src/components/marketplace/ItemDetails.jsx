import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const ItemDetails = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const { data } = await axios.get(`http://localhost:4000/api/items/${id}`);
        setItem(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchItem();
  }, [id]);

  if (!item)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0c0c0e]">
        <motion.div
          className="flex gap-2"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-3 h-3 rounded-full bg-amber-400"
              variants={{
                hidden: { opacity: 0.2, y: 0 },
                visible: {
                  opacity: [0.2, 1, 0.2],
                  y: [0, -10, 0],
                  transition: { duration: 1, repeat: Infinity, delay: i * 0.15 },
                },
              }}
            />
          ))}
        </motion.div>
      </div>
    );

  return (
    <div
      className="min-h-screen bg-white text-black"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,700;1,400&display=swap');
        .grain::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 50;
        }
        .tag-pill {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          backdrop-filter: blur(8px);
        }
        .contact-btn {
          background: linear-gradient(135deg, #f59e0b, #ef4444);
          position: relative;
          overflow: hidden;
        }
        .contact-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #fbbf24, #f97316);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .contact-btn:hover::after { opacity: 1; }
        .contact-btn span { position: relative; z-index: 1; }
      `}</style>

      <div className="grain" />

      {/* Ambient background glow */}
      <div
        className="fixed top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%)",
          transform: "translate(20%, -20%)",
        }}
      />
      <div
        className="fixed bottom-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(239,68,68,0.05) 0%, transparent 70%)",
          transform: "translate(-30%, 30%)",
        }}
      />

      {/* Back nav */}
      <motion.div
        className="max-w-6xl mx-auto px-6 pt-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-white/40 hover:text-white/80 transition-colors text-sm tracking-wide"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M19 12H5M5 12l7-7M5 12l7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to listings
        </button>
      </motion.div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* ── Image column ── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            {/* Decorative frame */}
            <div
              className="absolute -inset-px rounded-2xl pointer-events-none"
              style={{
                background: "linear-gradient(135deg, rgba(245,158,11,0.25), rgba(239,68,68,0.1), transparent)",
                padding: "1px",
              }}
            />

            <div className="relative rounded-2xl overflow-hidden bg-white/5 aspect-[4/3]">
              <AnimatePresence>
                {!imgLoaded && (
                  <motion.div
                    key="skeleton"
                    className="absolute inset-0 bg-white/5"
                    exit={{ opacity: 0 }}
                    style={{
                      background: "linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%)",
                      backgroundSize: "200% 100%",
                      animation: "shimmer 1.5s infinite",
                    }}
                  />
                )}
              </AnimatePresence>

              <motion.img
                src={item?.image || "default.png"}
                alt={item?.name}
                className="w-full h-full object-cover"
                onLoad={() => setImgLoaded(true)}
                initial={{ scale: 1.05, opacity: 0 }}
                animate={{ scale: imgLoaded ? 1 : 1.05, opacity: imgLoaded ? 1 : 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                whileHover={{ scale: 1.03 }}
              />

              {/* Price badge overlay */}
              <motion.div
                className="absolute top-4 left-4 tag-pill rounded-full px-4 py-1.5 text-sm font-semibold text-amber-400 flex items-center gap-1.5"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                <span className="text-base">₹</span>
                {item.price?.toLocaleString("en-IN")}
              </motion.div>
            </div>

            {/* Subtle reflection */}
            <div
              className="absolute bottom-0 left-0 right-0 h-20 rounded-b-2xl pointer-events-none"
              style={{
                background: "linear-gradient(to bottom, transparent, rgba(12,12,14,0.6))",
              }}
            />
          </motion.div>

          {/* ── Details column ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-6"
          >
            {/* Category + Type pills */}
            <motion.div
              className="flex flex-wrap gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {item.category && (
                <span className="tag-pill text-xs tracking-widest uppercase px-3 py-1.5 rounded-full text-black/50">
                  {item.category}
                </span>
              )}
              {item.title && (
                <span className="tag-pill text-xs tracking-widest uppercase px-3 py-1.5 rounded-full text-amber-400/70">
                  {item.title}
                </span>
              )}
            </motion.div>

            {/* Name */}
            <motion.h1
              style={{ fontFamily: "'Playfair Display', serif" }}
              className="text-4xl md:text-5xl font-bold leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
            >
              {item.name}
            </motion.h1>

            {/* Divider */}
            <motion.div
              className="h-px w-12 bg-gradient-to-r from-amber-400 to-red-500"
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            />

            {/* Description */}
            <motion.p
              className="text-black/50 leading-relaxed text-base font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
            >
              {item.description}
            </motion.p>

            {/* Price */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-baseline gap-1"
            >
              <span className="text-black/30 text-xl font-light">₹</span>
              <span
                className="text-5xl font-bold"
                style={{
                  background: "linear-gradient(135deg, #f59e0b, #ef4444)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {item.price?.toLocaleString("en-IN")}
              </span>
            </motion.div>

            {/* Meta info */}
            <motion.div
              className="grid grid-cols-2 gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
            >
              {[
                { label: "Category", value: item.category },
                { label: "Type", value: item.title },
              ].map(({ label, value }) =>
                value ? (
                  <div
                    key={label}
                    className="rounded-xl p-4"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                  >
                    <p className="text-black/30 text-xs uppercase tracking-widest mb-1">{label}</p>
                    <p className="text-black/80 text-sm font-medium">{value}</p>
                  </div>
                ) : null
              )}
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75, duration: 0.5 }}
              className="pt-2"
            >
              <motion.button
                className="contact-btn w-full py-4 rounded-xl text-black font-semibold tracking-wide text-sm uppercase"
                whileHover={{ scale: 1.02, boxShadow: "0 8px 40px rgba(245,158,11,0.25)" }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="flex items-center justify-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.45 2 2 0 0 1 3.59 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.16 6.16l1.02-.93a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Contact Seller
                </span>
              </motion.button>

              <p className="text-center text-black/20 text-xs mt-3 tracking-wide">
                Seller typically responds within 24 hours
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;