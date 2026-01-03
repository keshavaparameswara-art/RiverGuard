'use client';

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import styles from "./Shell.module.css";
import { ShieldAlert, LayoutDashboard, Map, FileText, Settings, LogOut, Menu } from "lucide-react";

interface ShellProps {
    children: ReactNode;
}

const NAV_ITEMS = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/map", label: "Live Map", icon: Map },
    { href: "/dashboard/cases", label: "Cases", icon: FileText },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function Shell({ children }: ShellProps) {
    const pathname = usePathname();

    return (
        <div className={styles.shell}>
            <aside className={styles.sidebar}>
                <div className={styles.logo}>
                    <ShieldAlert className={styles.icon} />
                    <span>RiverGuard</span>
                </div>

                <nav className={styles.nav}>
                    {NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(styles.navItem, isActive && styles.active)}
                            >
                                <Icon size={20} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className={styles.footer}>
                    <button className={styles.logoutBtn}>
                        <LogOut size={20} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            <main className={styles.main}>
                <header className={styles.header}>
                    <h1 className={styles.pageTitle}>Dashboard</h1>
                    <div className={styles.userProfile}>
                        <div className={styles.avatar}>A</div>
                        <span>Admin User</span>
                    </div>
                </header>
                <div className={styles.content}>
                    {children}
                </div>
            </main>
        </div>
    );
}
