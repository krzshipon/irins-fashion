"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Package, MapPin, LogOut, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import styles from "./account.module.css";

export default function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, loading, logout } = useAuth();

    // Route protection: Redirect to login if not authenticated
    useEffect(() => {
        if (!loading && !user) {
            router.replace("/login");
        }
    }, [user, loading, router]);

    const navItems = [
        { href: "/account/overview", label: "Overview", icon: LayoutDashboard },
        { href: "/account/orders", label: "My Orders", icon: Package },
        { href: "/account/addresses", label: "Addresses", icon: MapPin },
    ];

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const handleLogout = async () => {
        await logout();
        router.push("/");
    };

    // Show loading state while checking auth
    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <Loader2 className={styles.loadingIcon} size={32} />
            </div>
        );
    }

    // Don't render protected content if not authenticated
    if (!user) {
        return null;
    }

    return (
        <div className={styles.layout}>
            <aside className={styles.sidebar}>
                {/* User Info */}
                <div className={styles.userInfo}>
                    <div className={styles.avatar}>
                        {getInitials(user.name || "User")}
                    </div>
                    <div>
                        <p className={styles.userName}>{user.name || "Guest"}</p>
                        <p className={styles.userMobile}>{user.mobile}</p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className={styles.nav}>
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
                            >
                                <item.icon size={18} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout */}
                <button onClick={handleLogout} className={styles.logoutBtn}>
                    <LogOut size={18} />
                    Log Out
                </button>
            </aside>

            <main className={styles.content}>{children}</main>
        </div>
    );
}
