import { UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { syncUser } from "@/actions/user";
import SeriesList from "@/components/dashboard/series-list";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function DashboardPage() {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId) {
        redirect("/sign-in");
    }

    // Sync user with Supabase
    const syncResult = await syncUser();
    if ((syncResult as any)?.error) {
        console.error("DashboardPage: syncUser failed", syncResult);
    }

    return (
        <div className="max-w-7xl mx-auto pb-20">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-white mb-2 uppercase">My Scheduled Series</h1>
                    <p className="text-zinc-500 font-medium italic">Manage your automated content channels and track performance.</p>
                </div>
                <Link
                    href="/dashboard/create"
                    className="flex items-center gap-3 px-8 py-4 rounded-full bg-white text-black font-black text-sm hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all hover:-translate-y-1 active:scale-95 w-fit"
                >
                    <Plus className="w-5 h-5" />
                    Create New Series
                </Link>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                <div className="p-8 rounded-[32px] bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-sm group hover:border-purple-500/30 transition-all duration-500">
                    <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-4 group-hover:text-purple-400">Total Videos</h3>
                    <p className="text-5xl font-black text-white">0</p>
                </div>
                <div className="p-8 rounded-[32px] bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-sm group hover:border-purple-500/30 transition-all duration-500">
                    <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-4 group-hover:text-purple-400">Credits Remaining</h3>
                    <p className="text-5xl font-black text-white">5</p>
                </div>
                <div className="p-8 rounded-[32px] bg-gradient-to-br from-purple-600/10 to-transparent border border-purple-500/20 backdrop-blur-sm group hover:border-purple-500/50 transition-all duration-500 relative overflow-hidden">
                    <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-purple-600/10 blur-3xl rounded-full" />
                    <h3 className="text-xs font-black text-purple-400/80 uppercase tracking-widest mb-4">Current Plan</h3>
                    <p className="text-2xl font-black text-white uppercase tracking-tight">Free Starter</p>
                    <button className="mt-4 text-[10px] font-black uppercase tracking-widest text-purple-400 hover:text-white transition-colors">Upgrade Now →</button>
                </div>
            </div>

            <SeriesList />
        </div>
    );
}
