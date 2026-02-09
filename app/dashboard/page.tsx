import { UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { syncUser } from "@/actions/user";

export default async function DashboardPage() {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId) {
        redirect("/sign-in");
    }

    // Sync user with Supabase
    await syncUser();

    return (
        <div className="max-w-7xl mx-auto">
            <header className="mb-12">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-zinc-400">Welcome back, {user?.firstName}!</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
                    <h3 className="font-bold mb-2">Total Videos</h3>
                    <p className="text-4xl font-black">0</p>
                </div>
                <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
                    <h3 className="font-bold mb-2">Credits Remaining</h3>
                    <p className="text-4xl font-black">5</p>
                </div>
                <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
                    <h3 className="font-bold mb-2">Plan</h3>
                    <p className="text-xl font-bold text-purple-500">Starter</p>
                </div>
            </div>

            <div className="mt-12 p-12 rounded-[32px] border border-zinc-800 border-dashed flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mb-6">
                    <span className="text-2xl">🎬</span>
                </div>
                <h2 className="text-2xl font-bold mb-2">No videos yet</h2>
                <p className="text-zinc-500 mb-8 max-w-sm">Create your first AI-generated video to see it here.</p>
                <button className="px-8 py-3 rounded-full bg-white text-black font-bold hover:bg-zinc-200 transition-all">
                    Create Video
                </button>
            </div>
        </div>
    );
}
