"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserName } from "@/hooks/useUserName";
import { supabase } from "@/lib/supabase/client";
import { Bell, Shield, Crown, Check, X } from "lucide-react";

export default function SettingsPage() {
  const name = useUserName();
  const router = useRouter();
  const [email, setEmail] = useState("");

  // Edit profile state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Delete account state
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data?.user?.email ?? "");
    });
  }, []);

  function openEditProfile() {
    setEditName(name);
    setProfileError(null);
    setIsEditingProfile(true);
  }

  async function handleSaveProfile() {
    const trimmed = editName.trim();
    if (!trimmed) return;
    setIsSavingProfile(true);
    setProfileError(null);
    const { error } = await supabase.auth.updateUser({
      data: { first_name: trimmed, full_name: trimmed },
    });
    setIsSavingProfile(false);
    if (error) {
      setProfileError("Could not save changes. Please try again.");
      return;
    }
    setIsEditingProfile(false);
  }

  async function handleDeleteAccount() {
    setIsDeletingAccount(true);
    setDeleteError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Delete failed");
      await supabase.auth.signOut();
      router.replace("/login");
    } catch {
      setIsDeletingAccount(false);
      setDeleteError("Could not delete your account. Please try again.");
    }
  }

  const [notificationSettings, setNotificationSettings] = useState([
    { title: "Daily mood check-in", subtitle: "Prompt at 8:30 AM each morning", enabled: true },
    { title: "Pre-interview alert", subtitle: "2 hours before each booked interview", enabled: true },
    { title: "Streak reminders", subtitle: "If you haven't opened the app by 7 PM", enabled: true },
    { title: "Session nudges", subtitle: "Suggested moments to reset your mind", enabled: false },
  ]);

  function toggleNotification(title: string) {
    setNotificationSettings((prev) =>
      prev.map((item) => item.title === title ? { ...item, enabled: !item.enabled } : item)
    );
  }

  const formatRenewalDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    } catch {
      return dateString;
    }
  };

  const tierColors: Record<string, { bg: string; text: string; badge: string }> = {
    free: { bg: "bg-gray-50", text: "text-gray-900", badge: "bg-gray-200 text-gray-800" },
    pro: { bg: "bg-[#EAF8F4]", text: "text-[#0C6B58]", badge: "bg-[#DDF4EE] text-[#0C6B58]" },
    premium: { bg: "bg-amber-50", text: "text-amber-900", badge: "bg-amber-200 text-amber-800" },
  };

  const plans = [
    {
      name: "Free",
      price: "$0",
      features: ["3 sessions per month", "Basic mood tracking", "1 interview tracked"],
      current: false,
    },
    {
      name: "Pro",
      price: "$12/mo",
      features: ["Unlimited sessions", "Full insights & trends", "Unlimited interviews", "Coach notes & history"],
      current: true,
    },
    {
      name: "Premium",
      price: "$24/mo",
      features: ["Everything in Pro", "1:1 human coach calls", "Custom session packs", "Priority support"],
      current: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F6F6F4] px-4 py-6 md:px-8 lg:px-10 md:py-8">

      {/* Header */}
      <div className="mb-8 md:mb-10">
        <p className="text-sm text-gray-500">Settings</p>
        <h1 className="mt-2 text-3xl md:text-4xl font-semibold text-[#111111]">Settings</h1>
      </div>

      {/* Profile */}
      <div className="rounded-3xl border border-gray-200 bg-white p-5 md:p-6 shadow-sm">
        <p className="mb-5 text-xs font-semibold uppercase tracking-wide text-gray-400">Profile</p>
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#0C6B58] bg-[#DDF4EE] text-sm font-semibold text-[#0C6B58]">
              {name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#111111]">{name}</h2>
              <p className="text-sm text-gray-500 break-all">{email || "Loading..."}</p>
            </div>
          </div>
          <button
            onClick={openEditProfile}
            className="min-h-[44px] w-full md:w-auto rounded-xl border border-gray-200 px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            Edit profile
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="mt-6 md:mt-8 rounded-3xl border border-gray-200 bg-white p-5 md:p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <Bell size={20} className="text-[#0C6B58]" />
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Notification Preferences
          </p>
        </div>
        <div className="divide-y divide-gray-100">
          {notificationSettings.map((item) => (
            <div key={item.title} className="flex items-start gap-4 py-5 justify-between">
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-[#111111]">{item.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{item.subtitle}</p>
              </div>
              <button
                onClick={() => toggleNotification(item.title)}
                className={`relative h-7 w-12 shrink-0 rounded-full transition duration-300 ${
                  item.enabled ? "bg-[#0C6B58]" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all duration-300 ${
                    item.enabled ? "right-1" : "left-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Account */}
      <div className="mt-6 md:mt-8 rounded-3xl border border-gray-200 bg-white p-5 md:p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <Shield size={20} className="text-[#0C6B58]" />
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Accounts</p>
        </div>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-[#111111]">Delete account</h3>
            <p className="mt-1 text-sm text-gray-500">Permanently remove your account and all data.</p>
          </div>
          <button
            onClick={() => { setDeleteError(null); setIsConfirmingDelete(true); }}
            className="min-h-[44px] w-full md:w-auto rounded-xl bg-red-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-red-600"
          >
            Delete account
          </button>
        </div>
      </div>

      {/* Plans */}
      <div className="mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-3xl border p-5 md:p-6 shadow-sm transition ${
              plan.current ? "border-[#0C6B58] bg-[#EAF8F4]" : "border-gray-200 bg-white"
            }`}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-[#111111]">{plan.name}</h2>
                <p className="mt-2 text-3xl font-bold text-[#0C6B58]">{plan.price}</p>
              </div>
              {plan.current && (
                <div className="flex items-center gap-2 rounded-full bg-[#DDF4EE] px-3 py-1 text-xs font-semibold text-[#0C6B58]">
                  <Crown size={14} />
                  Current Plan
                </div>
              )}
            </div>
            <div className="mt-8 space-y-4">
              {plan.features.map((feature) => (
                <div key={feature} className="flex items-start gap-3">
                  <Check size={16} className="mt-1 shrink-0 text-[#0C6B58]" />
                  <p className="text-sm text-gray-700">{feature}</p>
                </div>
              ))}
            </div>
            {!plan.current && (
              <button className="mt-8 min-h-[44px] w-full rounded-xl bg-[#0C6B58] py-3 text-sm font-medium text-white transition hover:bg-[#095746]">
                Upgrade
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-[#111111]">Edit profile</h2>
              <button
                onClick={() => setIsEditingProfile(false)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSaveProfile()}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-[#0C6B58] focus:outline-none"
                  placeholder="Your name"
                  autoFocus
                />
              </div>
              {profileError && (
                <p className="text-sm text-red-500">{profileError}</p>
              )}
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setIsEditingProfile(false)}
                className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={isSavingProfile || !editName.trim()}
                className="flex-1 rounded-xl bg-[#0C6B58] py-3 text-sm font-medium text-white transition hover:bg-[#095746] disabled:opacity-50"
              >
                {isSavingProfile ? "Saving…" : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {isConfirmingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[#111111]">Delete your account?</h2>
              <button
                onClick={() => setIsConfirmingDelete(false)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              This will permanently delete your account and all your data — sessions, interviews, and progress. This cannot be undone.
            </p>
            {deleteError && (
              <p className="mb-4 text-sm text-red-500">{deleteError}</p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setIsConfirmingDelete(false)}
                className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeletingAccount}
                className="flex-1 rounded-xl bg-red-500 py-3 text-sm font-medium text-white transition hover:bg-red-600 disabled:opacity-50"
              >
                {isDeletingAccount ? "Deleting…" : "Yes, delete my account"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
