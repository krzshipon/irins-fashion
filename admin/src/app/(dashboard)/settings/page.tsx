"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
    User,
    Store,
    Bell,
    Lock,
    Save,
    Check,
    AlertCircle,
} from "lucide-react";

type TabType = "profile" | "store" | "notifications" | "security";

export default function SettingsPage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<TabType>("profile");
    const [saved, setSaved] = useState(false);
    const [profileData, setProfileData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.mobile || "",
    });
    const [storeData, setStoreData] = useState({
        storeName: "Irin's Fashion",
        tagline: "Modest & Elegant Fashion",
        email: "contact@irinsfashion.com",
        phone: "+880 1700-000000",
        address: "House 12, Road 5, Dhanmondi, Dhaka 1209",
        currency: "BDT",
        language: "en",
    });
    const [notificationSettings, setNotificationSettings] = useState({
        orderNotifications: true,
        lowStockAlerts: true,
        customerMessages: true,
        weeklyReports: false,
    });

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const tabs = [
        { id: "profile" as TabType, label: "Profile", icon: User },
        { id: "store" as TabType, label: "Store", icon: Store },
        { id: "notifications" as TabType, label: "Notifications", icon: Bell },
        { id: "security" as TabType, label: "Security", icon: Lock },
    ];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-playfair">Settings</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Manage your account and store settings
                    </p>
                </div>
            </div>

            {/* Content Card */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="flex">
                    {/* Sidebar */}
                    <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
                        <nav className="space-y-1">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id
                                            ? "bg-white text-emerald-700 shadow-sm"
                                            : "text-gray-600 hover:bg-gray-100"
                                            }`}
                                    >
                                        <Icon size={18} className={activeTab === tab.id ? "text-emerald-600" : "text-gray-400"} />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6">
                        {/* Profile Tab */}
                        {activeTab === "profile" && (
                            <div className="max-w-xl space-y-6">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900 mb-1">Profile Settings</h2>
                                    <p className="text-sm text-gray-500">Update your personal information</p>
                                </div>

                                <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-xl">
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-2xl font-bold">
                                        {profileData.name.charAt(0) || "A"}
                                    </div>
                                    <div>
                                        <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                            Change Avatar
                                        </button>
                                        <p className="text-xs text-gray-500 mt-2">JPG, PNG. Max 2MB.</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            value={profileData.name}
                                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                        <input
                                            type="email"
                                            value={profileData.email}
                                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                        <input
                                            type="tel"
                                            value={profileData.phone}
                                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={handleSave}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm"
                                >
                                    {saved ? <Check size={18} /> : <Save size={18} />}
                                    {saved ? "Saved!" : "Save Changes"}
                                </button>
                            </div>
                        )}

                        {/* Store Tab */}
                        {activeTab === "store" && (
                            <div className="max-w-xl space-y-6">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900 mb-1">Store Settings</h2>
                                    <p className="text-sm text-gray-500">Configure your store information</p>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
                                        <input
                                            type="text"
                                            value={storeData.storeName}
                                            onChange={(e) => setStoreData({ ...storeData, storeName: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
                                        <input
                                            type="text"
                                            value={storeData.tagline}
                                            onChange={(e) => setStoreData({ ...storeData, tagline: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                                            <input
                                                type="email"
                                                value={storeData.email}
                                                onChange={(e) => setStoreData({ ...storeData, email: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                                            <input
                                                type="tel"
                                                value={storeData.phone}
                                                onChange={(e) => setStoreData({ ...storeData, phone: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                        <textarea
                                            value={storeData.address}
                                            onChange={(e) => setStoreData({ ...storeData, address: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none resize-none"
                                            rows={2}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                                            <select
                                                value={storeData.currency}
                                                onChange={(e) => setStoreData({ ...storeData, currency: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                                            >
                                                <option value="BDT">BDT (৳)</option>
                                                <option value="USD">USD ($)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                                            <select
                                                value={storeData.language}
                                                onChange={(e) => setStoreData({ ...storeData, language: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                                            >
                                                <option value="en">English</option>
                                                <option value="bn">বাংলা</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleSave}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm"
                                >
                                    {saved ? <Check size={18} /> : <Save size={18} />}
                                    {saved ? "Saved!" : "Save Changes"}
                                </button>
                            </div>
                        )}

                        {/* Notifications Tab */}
                        {activeTab === "notifications" && (
                            <div className="max-w-xl space-y-6">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900 mb-1">Notification Preferences</h2>
                                    <p className="text-sm text-gray-500">Choose what notifications you receive</p>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        { key: "orderNotifications", label: "Order Notifications", description: "Get notified when a new order is placed" },
                                        { key: "lowStockAlerts", label: "Low Stock Alerts", description: "Receive alerts when products are running low" },
                                        { key: "customerMessages", label: "Customer Messages", description: "Get notified about new customer inquiries" },
                                        { key: "weeklyReports", label: "Weekly Reports", description: "Receive weekly sales and performance reports" },
                                    ].map((item) => (
                                        <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                            <div>
                                                <p className="font-medium text-gray-900 text-sm">{item.label}</p>
                                                <p className="text-xs text-gray-500">{item.description}</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={notificationSettings[item.key as keyof typeof notificationSettings]}
                                                    onChange={(e) => setNotificationSettings({
                                                        ...notificationSettings,
                                                        [item.key]: e.target.checked,
                                                    })}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                                            </label>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={handleSave}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm"
                                >
                                    {saved ? <Check size={18} /> : <Save size={18} />}
                                    {saved ? "Saved!" : "Save Changes"}
                                </button>
                            </div>
                        )}

                        {/* Security Tab */}
                        {activeTab === "security" && (
                            <div className="max-w-xl space-y-6">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900 mb-1">Security Settings</h2>
                                    <p className="text-sm text-gray-500">Manage your account security</p>
                                </div>

                                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                                    <AlertCircle className="text-amber-600 shrink-0" size={20} />
                                    <div>
                                        <p className="text-sm font-medium text-amber-800">Password Security</p>
                                        <p className="text-xs text-amber-700 mt-1">
                                            We recommend using a strong password with a mix of letters, numbers, and symbols.
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                        <input
                                            type="password"
                                            placeholder="Enter current password"
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                        <input
                                            type="password"
                                            placeholder="Enter new password"
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                        <input
                                            type="password"
                                            placeholder="Confirm new password"
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={handleSave}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm"
                                >
                                    {saved ? <Check size={18} /> : <Save size={18} />}
                                    {saved ? "Password Updated!" : "Update Password"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
