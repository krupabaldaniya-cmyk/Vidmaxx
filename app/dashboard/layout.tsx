'use client'

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Video,
    BookOpen,
    CreditCard,
    Settings,
    PlusCircle,
    Rocket,
    User,
    Menu
} from 'lucide-react';
import { UserButton } from "@clerk/nextjs";

const sidebarOptions = [
    { name: 'Series', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'Videos', icon: Video, href: '/dashboard/videos' },
    { name: 'Guides', icon: BookOpen, href: '/dashboard/guides' },
    { name: 'Billing', icon: CreditCard, href: '/dashboard/billing' },
    { name: 'Settings', icon: Settings, href: '/dashboard/settings' },
];

const footerOptions = [
    { name: 'Upgrade', icon: Rocket, href: '/dashboard/upgrade' },
    { name: 'Profile Settings', icon: User, href: '/dashboard/profile' },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <div className="flex min-h-screen bg-[#070708] text-zinc-100">
            {/* Sidebar */}
            <aside className="w-72 bg-zinc-950 border-r border-zinc-800 flex flex-col fixed h-full z-30">
                {/* Sidebar Header */}
                <div className="p-6 flex items-center gap-3">
                    <div className="relative w-10 h-10">
                        <Image
                            src="/logo.png"
                            alt="vidmaxx logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <span className="text-2xl font-bold tracking-tight text-white">vidmaxx</span>
                </div>

                {/* Create Button */}
                <div className="px-4 mb-6">
                    <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-purple-500/10 active:scale-95">
                        <PlusCircle className="w-5 h-5" />
                        <span>Create New Series</span>
                    </button>
                </div>

                {/* Sidebar Menu */}
                <nav className="flex-1 px-4 space-y-2">
                    {sidebarOptions.map((option) => (
                        <Link
                            key={option.name}
                            href={option.href}
                            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all group ${pathname === option.href
                                    ? 'bg-zinc-900 border border-zinc-800 text-white shadow-sm'
                                    : 'text-zinc-500 hover:text-white hover:bg-zinc-900/50'
                                }`}
                        >
                            <option.icon className={`w-6 h-6 ${pathname === option.href ? 'text-purple-500' : 'group-hover:text-purple-400'}`} />
                            <span className="text-lg font-medium">{option.name}</span>
                        </Link>
                    ))}
                </nav>

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-zinc-800 space-y-2">
                    {footerOptions.map((option) => (
                        <Link
                            key={option.name}
                            href={option.href}
                            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all group ${pathname === option.href
                                    ? 'bg-zinc-900 border border-zinc-800 text-white'
                                    : 'text-zinc-500 hover:text-white hover:bg-zinc-900/50'
                                }`}
                        >
                            <option.icon className="w-6 h-6 group-hover:text-pink-400" />
                            <span className="text-lg font-medium">{option.name}</span>
                        </Link>
                    ))}
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 ml-72 flex flex-col">
                {/* Header */}
                <header className="h-20 bg-[#070708]/80 backdrop-blur-md border-b border-zinc-800 flex items-center justify-end px-8 sticky top-0 z-20">
                    <div className="flex items-center gap-4">
                        <UserButton afterSignOutUrl="/" />
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
