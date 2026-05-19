import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Bell,
  Shield,
  Sliders,
  Camera,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  ChevronRight,
  Eye,
  EyeOff,
  Check,
  Trash2,
  LogOut,
  Moon,
  Sun,
  Globe,
  Lock,
  Smartphone,
  AlertTriangle,
  Save,
} from "lucide-react";

const tabs = [
  { id: "profile",       label: "Profile",       icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security",      label: "Security",      icon: Shield },
  { id: "preferences",   label: "Preferences",   icon: Sliders },
];

const SectionCard = ({ children, className = "" }) => (
  <div className={`rounded-2xl border border-black/5 bg-white p-6 shadow-sm ${className}`}>
    {children}
  </div>
);

const SectionTitle = ({ children }) => (
  <h3 className="mb-5 text-[13px] font-bold uppercase tracking-widest text-slate-400">
    {children}
  </h3>
);

const InputField = ({ label, icon: Icon, type = "text", placeholder, defaultValue, hint }) => (
  <div className="space-y-1.5">
    <label className="text-[13px] font-semibold text-slate-600">{label}</label>
    <div className="relative">
      {Icon && (
        <Icon
          size={15}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          strokeWidth={2}
        />
      )}
      <input
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className={`w-full rounded-[13px] border border-black/8 bg-slate-50 py-2.5 text-[13.5px] text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-500/10 ${
          Icon ? "pl-9 pr-4" : "px-4"
        }`}
      />
    </div>
    {hint && <p className="text-[12px] text-slate-400">{hint}</p>}
  </div>
);

const Toggle = ({ label, description, defaultChecked = false }) => {
  const [on, setOn] = useState(defaultChecked);
  return (
    <div className="flex items-center justify-between gap-4 py-3.5 border-b border-black/5 last:border-0">
      <div>
        <p className="text-[13.5px] font-semibold text-slate-700">{label}</p>
        {description && <p className="mt-0.5 text-[12px] text-slate-400">{description}</p>}
      </div>
      <button
        onClick={() => setOn((v) => !v)}
        className={`relative h-6 w-11 flex-shrink-0 rounded-full transition-colors duration-200 ${
          on ? "bg-teal-500" : "bg-slate-200"
        }`}
      >
        <motion.span
          animate={{ x: on ? 20 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute top-[3px] h-[18px] w-[18px] rounded-full bg-white shadow-sm"
        />
      </button>
    </div>
  );
};

/* ─── TAB: PROFILE ─── */
function ProfileTab() {
  return (
    <div className="space-y-5">
      {/* Avatar */}
      <SectionCard>
        <SectionTitle>Profile Photo</SectionTitle>
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-700 flex items-center justify-center shadow-lg shadow-teal-500/20">
              <User size={34} color="white" strokeWidth={1.5} />
            </div>
            <button className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-teal-500 shadow-md transition-transform hover:scale-110">
              <Camera size={12} color="white" />
            </button>
          </div>
          <div>
            <p className="text-[14px] font-semibold text-slate-700">Upload a new photo</p>
            <p className="mt-0.5 text-[12px] text-slate-400">JPG, PNG or GIF · Max 2MB</p>
            <div className="mt-3 flex gap-2">
              <button className="rounded-[10px] bg-teal-500 px-4 py-1.5 text-[12.5px] font-semibold text-white transition-all hover:bg-teal-600">
                Upload
              </button>
              <button className="rounded-[10px] border border-black/8 bg-slate-50 px-4 py-1.5 text-[12.5px] font-semibold text-slate-600 transition-all hover:bg-slate-100">
                Remove
              </button>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Personal Info */}
      <SectionCard>
        <SectionTitle>Personal Information</SectionTitle>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputField label="First Name" icon={User} placeholder="John" defaultValue="John" />
          <InputField label="Last Name" icon={User} placeholder="Doe" defaultValue="Doe" />
          <InputField label="Email Address" icon={Mail} type="email" placeholder="john@college.edu" defaultValue="john@college.edu" hint="Used for login and notifications" />
          <InputField label="Phone Number" icon={Phone} type="tel" placeholder="+91 98765 43210" />
          <InputField label="Location" icon={MapPin} placeholder="Siliguri, West Bengal" />
          <InputField label="Department / Course" icon={GraduationCap} placeholder="B.Tech CSE" />
        </div>
        <div className="mt-4">
          <InputField label="Bio" placeholder="Tell others about yourself..." />
        </div>
      </SectionCard>

      {/* Academic Info */}
      <SectionCard>
        <SectionTitle>Academic Details</SectionTitle>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputField label="College / University" icon={GraduationCap} defaultValue="NIT Silchar" />
          <InputField label="Student ID" icon={User} placeholder="2023XXXXX" />
          <div className="space-y-1.5">
            <label className="text-[13px] font-semibold text-slate-600">Year of Study</label>
            <select className="w-full rounded-[13px] border border-black/8 bg-slate-50 px-4 py-2.5 text-[13.5px] text-slate-800 outline-none transition-all focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-500/10">
              {["1st Year","2nd Year","3rd Year","4th Year","Postgraduate"].map((y) => (
                <option key={y}>{y}</option>
              ))}
            </select>
          </div>
          <InputField label="Graduation Year" placeholder="2027" />
        </div>
      </SectionCard>

      <div className="flex justify-end">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 rounded-[13px] bg-gradient-to-br from-teal-500 to-teal-700 px-6 py-2.5 text-[13.5px] font-bold text-white shadow-[0_4px_16px_rgba(13,148,136,0.3)] transition-all hover:shadow-[0_6px_20px_rgba(13,148,136,0.4)]"
        >
          <Save size={15} />
          Save Changes
        </motion.button>
      </div>
    </div>
  );
}

/* ─── TAB: NOTIFICATIONS ─── */
function NotificationsTab() {
  return (
    <div className="space-y-5">
      <SectionCard>
        <SectionTitle>Email Notifications</SectionTitle>
        <Toggle label="New message received"      description="Get notified when someone messages you" defaultChecked />
        <Toggle label="Item sold"                 description="When your listed item gets purchased"    defaultChecked />
        <Toggle label="Price drop alerts"         description="Items on your watchlist drop in price"   defaultChecked />
        <Toggle label="New listing in my category"description="Matching posts from others"                           />
        <Toggle label="Weekly digest"             description="A summary of activity on CampusHub"      defaultChecked />
      </SectionCard>

      <SectionCard>
        <SectionTitle>Push Notifications</SectionTitle>
        <Toggle label="Browser push alerts"       description="Allow browser notifications"             defaultChecked />
        <Toggle label="Order status updates"      description="Shipping & pickup reminders"             defaultChecked />
        <Toggle label="Chat notifications"        description="New messages from buyers / sellers"      defaultChecked />
        <Toggle label="Promotional updates"       description="Deals, tips and platform news"                         />
      </SectionCard>

      <SectionCard>
        <SectionTitle>Notification Frequency</SectionTitle>
        <div className="space-y-3">
          {["Instantly", "Daily digest", "Weekly digest"].map((opt) => (
            <label key={opt} className="flex cursor-pointer items-center gap-3 rounded-[13px] border border-black/5 bg-slate-50/80 px-4 py-3 transition-all hover:border-teal-400/30 hover:bg-teal-500/5">
              <input type="radio" name="freq" defaultChecked={opt === "Instantly"} className="accent-teal-500" />
              <span className="text-[13.5px] font-medium text-slate-700">{opt}</span>
            </label>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

/* ─── TAB: SECURITY ─── */
function SecurityTab() {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [show2FA, setShow2FA] = useState(false);

  return (
    <div className="space-y-5">
      {/* Change Password */}
      <SectionCard>
        <SectionTitle>Change Password</SectionTitle>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[13px] font-semibold text-slate-600">Current Password</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showOld ? "text" : "password"}
                placeholder="••••••••"
                className="w-full rounded-[13px] border border-black/8 bg-slate-50 py-2.5 pl-9 pr-10 text-[13.5px] text-slate-800 outline-none transition-all focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-500/10"
              />
              <button onClick={() => setShowOld((v) => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showOld ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-semibold text-slate-600">New Password</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showNew ? "text" : "password"}
                placeholder="••••••••"
                className="w-full rounded-[13px] border border-black/8 bg-slate-50 py-2.5 pl-9 pr-10 text-[13.5px] text-slate-800 outline-none transition-all focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-500/10"
              />
              <button onClick={() => setShowNew((v) => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            <div className="mt-2 flex gap-1.5">
              {["Weak", "Fair", "Strong"].map((s, i) => (
                <div key={s} className={`h-1 flex-1 rounded-full ${i === 0 ? "bg-red-400" : i === 1 ? "bg-amber-400" : "bg-slate-200"}`} />
              ))}
              <span className="ml-1 text-[11px] font-semibold text-red-400">Weak</span>
            </div>
          </div>

          <InputField label="Confirm New Password" icon={Lock} type="password" placeholder="••••••••" />

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 rounded-[13px] bg-gradient-to-br from-teal-500 to-teal-700 px-6 py-2.5 text-[13.5px] font-bold text-white shadow-[0_4px_16px_rgba(13,148,136,0.25)]"
          >
            <Check size={15} />
            Update Password
          </motion.button>
        </div>
      </SectionCard>

      {/* 2FA */}
      <SectionCard>
        <SectionTitle>Two-Factor Authentication</SectionTitle>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[12px] bg-teal-500/10">
              <Smartphone size={18} className="text-teal-600" />
            </div>
            <div>
              <p className="text-[13.5px] font-semibold text-slate-700">Authenticator App</p>
              <p className="mt-0.5 text-[12px] text-slate-400">Add an extra layer of security to your account using an authenticator app.</p>
            </div>
          </div>
          <button
            onClick={() => setShow2FA((v) => !v)}
            className={`flex-shrink-0 rounded-[10px] px-4 py-1.5 text-[12.5px] font-semibold transition-all ${
              show2FA
                ? "bg-red-50 text-red-500 hover:bg-red-100"
                : "bg-teal-500/10 text-teal-600 hover:bg-teal-500/20"
            }`}
          >
            {show2FA ? "Disable" : "Enable"}
          </button>
        </div>
      </SectionCard>

      {/* Active Sessions */}
      <SectionCard>
        <SectionTitle>Active Sessions</SectionTitle>
        <div className="space-y-3">
          {[
            { device: "Chrome on Windows", location: "Siliguri, IN", time: "Now", current: true },
            { device: "Safari on iPhone",  location: "Siliguri, IN", time: "2 hours ago",  current: false },
            { device: "Firefox on Mac",    location: "Kolkata, IN",  time: "3 days ago",   current: false },
          ].map(({ device, location, time, current }) => (
            <div key={device} className="flex items-center justify-between rounded-[13px] border border-black/5 bg-slate-50/80 px-4 py-3">
              <div className="flex items-center gap-3">
                <Globe size={16} className="text-slate-400" />
                <div>
                  <p className="text-[13px] font-semibold text-slate-700">
                    {device}
                    {current && (
                      <span className="ml-2 rounded-full bg-teal-500/10 px-2 py-0.5 text-[10px] font-bold text-teal-600">
                        Current
                      </span>
                    )}
                  </p>
                  <p className="text-[11.5px] text-slate-400">{location} · {time}</p>
                </div>
              </div>
              {!current && (
                <button className="text-[12px] font-semibold text-red-400 hover:text-red-600">
                  Revoke
                </button>
              )}
            </div>
          ))}
        </div>
        <button className="mt-4 flex items-center gap-2 text-[12.5px] font-semibold text-red-400 hover:text-red-600">
          <LogOut size={14} />
          Sign out all other sessions
        </button>
      </SectionCard>

      {/* Danger Zone */}
      <SectionCard className="border-red-100 bg-red-50/30">
        <SectionTitle>Danger Zone</SectionTitle>
        <div className="flex items-start gap-3 rounded-[13px] border border-red-100 bg-white p-4">
          <AlertTriangle size={18} className="mt-0.5 flex-shrink-0 text-red-400" />
          <div className="flex-1">
            <p className="text-[13.5px] font-semibold text-slate-800">Delete Account</p>
            <p className="mt-0.5 text-[12px] text-slate-500">
              Permanently delete your account and all your listings. This action cannot be undone.
            </p>
          </div>
          <button className="flex flex-shrink-0 items-center gap-1.5 rounded-[10px] border border-red-200 bg-red-50 px-4 py-1.5 text-[12.5px] font-semibold text-red-500 transition-all hover:bg-red-100">
            <Trash2 size={13} />
            Delete
          </button>
        </div>
      </SectionCard>
    </div>
  );
}

/* ─── TAB: PREFERENCES ─── */
function PreferencesTab() {
  const [theme, setTheme] = useState("light");
  const [lang, setLang] = useState("English");
  const [currency, setCurrency] = useState("INR ₹");

  return (
    <div className="space-y-5">
      {/* Appearance */}
      <SectionCard>
        <SectionTitle>Appearance</SectionTitle>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: "light", label: "Light",  icon: Sun  },
            { id: "dark",  label: "Dark",   icon: Moon },
            { id: "auto",  label: "System", icon: Sliders },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTheme(id)}
              className={`flex flex-col items-center gap-2 rounded-[14px] border-2 py-4 transition-all ${
                theme === id
                  ? "border-teal-500 bg-teal-500/8 shadow-[0_0_0_4px_rgba(13,148,136,0.08)]"
                  : "border-black/6 bg-slate-50 hover:border-teal-300/50"
              }`}
            >
              <Icon size={20} className={theme === id ? "text-teal-600" : "text-slate-400"} />
              <span className={`text-[12.5px] font-semibold ${theme === id ? "text-teal-700" : "text-slate-500"}`}>
                {label}
              </span>
              {theme === id && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-teal-500">
                  <Check size={10} color="white" strokeWidth={3} />
                </span>
              )}
            </button>
          ))}
        </div>
      </SectionCard>

      {/* Language & Region */}
      <SectionCard>
        <SectionTitle>Language & Region</SectionTitle>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-[13px] font-semibold text-slate-600">Language</label>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="w-full rounded-[13px] border border-black/8 bg-slate-50 px-4 py-2.5 text-[13.5px] text-slate-800 outline-none transition-all focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-500/10"
            >
              {["English", "Hindi", "Bengali", "Tamil", "Telugu"].map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[13px] font-semibold text-slate-600">Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full rounded-[13px] border border-black/8 bg-slate-50 px-4 py-2.5 text-[13.5px] text-slate-800 outline-none transition-all focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-500/10"
            >
              {["INR ₹", "USD $", "EUR €", "GBP £"].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </SectionCard>

      {/* Marketplace Preferences */}
      <SectionCard>
        <SectionTitle>Marketplace Preferences</SectionTitle>
        <Toggle label="Show only verified sellers"  description="Filter listings to trusted accounts"   defaultChecked />
        <Toggle label="Enable price negotiation"    description="Allow buyers to make offers"           defaultChecked />
        <Toggle label="Show sold items"             description="Include sold listings in search"                     />
        <Toggle label="Auto-renew listings"         description="Re-list expired items automatically"   defaultChecked />
      </SectionCard>

      {/* Privacy */}
      <SectionCard>
        <SectionTitle>Privacy</SectionTitle>
        <Toggle label="Show my profile publicly"    description="Anyone on CampusHub can view you"     defaultChecked />
        <Toggle label="Show online status"          description="Let others see when you're active"    defaultChecked />
        <Toggle label="Allow direct messages"       description="Receive DMs from any user"            defaultChecked />
        <Toggle label="Share activity data"         description="Help improve CampusHub with analytics"             />
      </SectionCard>

      <div className="flex justify-end">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 rounded-[13px] bg-gradient-to-br from-teal-500 to-teal-700 px-6 py-2.5 text-[13.5px] font-bold text-white shadow-[0_4px_16px_rgba(13,148,136,0.3)]"
        >
          <Save size={15} />
          Save Preferences
        </motion.button>
      </div>
    </div>
  );
}

/* ─── MAIN ─── */
export default function Setting() {
  const [activeTab, setActiveTab] = useState("profile");

  const tabContent = {
    profile:       <ProfileTab />,
    notifications: <NotificationsTab />,
    security:      <SecurityTab />,
    preferences:   <PreferencesTab />,
  };

  return (
    <div className="min-h-screen bg-slate-50/60 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[26px] font-bold tracking-tight text-slate-900">
            Account <span className="text-teal-600">Settings</span>
          </h1>
          <p className="mt-1 text-[14px] text-slate-400">
            Manage your profile, security, and preferences
          </p>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Sidebar tabs */}
          <aside className="flex flex-row gap-1 overflow-x-auto rounded-2xl border border-black/5 bg-white p-2 shadow-sm lg:h-fit lg:w-56 lg:flex-col">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`relative flex min-w-max flex-1 items-center gap-2.5 rounded-[13px] px-4 py-2.5 text-[13px] font-semibold transition-all lg:min-w-0 lg:flex-none ${
                  activeTab === id
                    ? "bg-teal-500/10 text-teal-700"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                }`}
              >
                <Icon size={16} strokeWidth={activeTab === id ? 2.5 : 2} />
                {label}
                {activeTab === id && (
                  <ChevronRight size={14} className="ml-auto hidden text-teal-500 lg:block" />
                )}
              </button>
            ))}
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
              >
                {tabContent[activeTab]}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}