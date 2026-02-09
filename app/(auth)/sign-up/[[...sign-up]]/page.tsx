import { SignUp } from "@clerk/nextjs";

export default function Page() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[#070708]">
            <SignUp appearance={{
                elements: {
                    formButtonPrimary: 'bg-purple-600 hover:bg-purple-700 text-sm normal-case',
                    card: 'bg-zinc-900 border border-zinc-800',
                    headerTitle: 'text-white',
                    headerSubtitle: 'text-zinc-400',
                    socialButtonsBlockButton: 'bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700',
                    formFieldLabel: 'text-zinc-400',
                    formFieldInput: 'bg-zinc-800 border-zinc-700 text-white',
                    footerActionText: 'text-zinc-400',
                    footerActionLink: 'text-purple-400 hover:text-purple-300'
                }
            }} />
        </div>
    );
}
