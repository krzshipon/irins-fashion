"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Settings,
    LogOut,
    Menu,
    Bell,
    Search,
    FolderTree,
    Image,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { logout, user } = useAuth();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const navItems = [
        { name: "Overview", href: "/", icon: LayoutDashboard },
        { name: "Products", href: "/products", icon: Package },
        { name: "Categories", href: "/categories", icon: FolderTree },
        { name: "Orders", href: "/orders", icon: ShoppingCart },
        { name: "Banners", href: "/banners", icon: Image },
        { name: "Users", href: "/users", icon: Users },
        { name: "Settings", href: "/settings", icon: Settings },
    ];

    return (
        <div className="flex h-screen bg-gray-900 overflow-hidden">
            {/* Sidebar */}
            <aside
                className={`bg-gray-800/50 backdrop-blur-xl border-r border-white/10 transition-all duration-300 ease-in-out flex flex-col ${isSidebarOpen ? 'w-64' : 'w-20'
                    }`}
            >
                {/* Logo Area */}
                <div className="h-16 flex items-center justify-center border-b border-white/10">
                    <h1 className={`font-playfair font-bold text-xl text-white transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
                        Irins Fashion
                    </h1>
                    {!isSidebarOpen && (
                        <span className="font-playfair font-bold text-xl text-white">IF</span>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${isActive
                                    ? 'bg-emerald-600/20 text-emerald-400 font-medium'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }`}
                                title={!isSidebarOpen ? item.name : undefined}
                            >
                                <Icon size={20} className={isActive ? 'text-emerald-400' : 'text-gray-500 group-hover:text-gray-300'} />
                                <span className={`whitespace-nowrap transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                {/* User Profile & Logout */}
                <div className="p-4 border-t border-white/10">
                    <div className={`flex items-center gap-3 ${!isSidebarOpen && 'justify-center'}`}>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold shrink-0">
                            {user?.name?.[0] || 'A'}
                        </div>
                        <div className={`flex-1 min-w-0 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
                            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.role}</p>
                        </div>
                        {isSidebarOpen && (
                            <button
                                onClick={() => logout()}
                                className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            >
                                <LogOut size={18} />
                            </button>
                        )}
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-gray-800/50 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-6 z-10">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 text-gray-400 hover:bg-white/5 hover:text-white rounded-lg transition-colors"
                        >
                            <Menu size={20} />
                        </button>

                        {/* Search Bar */}
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="text"
                                placeholder="Search products, orders..."
                                className="pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg text-sm w-64 text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/30 focus:outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="relative p-2 text-gray-400 hover:bg-white/5 hover:text-white rounded-lg transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-gray-800"></span>
                        </button>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-auto p-6 scroll-smooth bg-gray-900">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
