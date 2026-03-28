"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  Video,
  Calendar,
  Mail,
  ArrowRight,
  CheckCircle2,
  Play,
  Youtube,
  Instagram,
  Check,
  Menu,
  X,
  Zap,
  Clock,
  Layout
} from "lucide-react";
import {
  SignInButton,
  SignUpButton,
  UserButton,
  SignedIn,
  SignedOut,
  useUser
} from "@clerk/nextjs";
import { syncUser } from "@/actions/user";
import Link from "next/link";

// --- Sub-components ---

const LoadingScreen = () => (
  <div className="fixed inset-0 z-[100] bg-[#070708] flex items-center justify-center">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <Video className="w-6 h-6 text-purple-500 animate-pulse" />
      </div>
    </div>
  </div>
);

const NavLink = ({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) => (
  <a 
    href={href} 
    onClick={onClick}
    className="text-sm font-medium text-zinc-400 hover:text-white transition-colors relative group"
  >
    {children}
    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transition-all group-hover:w-full"></span>
  </a>
);

const Navbar = ({ scrolled, isMenuOpen, setIsMenuOpen }: { scrolled: boolean; isMenuOpen: boolean; setIsMenuOpen: (o: boolean) => void }) => (
  <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "glass-dark py-3 border-b border-white/5" : "bg-transparent py-6"}`}>
    <div className="container mx-auto px-6 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2 group cursor-pointer">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform duration-500">
          <Video className="text-white w-6 h-6" />
        </div>
        <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">vidmaxx</span>
      </Link>

      <div className="hidden md:flex items-center gap-8">
        <NavLink href="#features">Features</NavLink>
        <NavLink href="#pricing">Pricing</NavLink>
        <NavLink href="#about">About</NavLink>
        <SignedIn>
          <Link href="/dashboard" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors relative group">
            Dashboard
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transition-all group-hover:w-full"></span>
          </Link>
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <button className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
              Sign In
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="px-6 py-2.5 rounded-full bg-white text-black text-sm font-bold hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/5">
              Get Started
            </button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <div className="scale-110 hover:scale-125 transition-transform duration-300">
            <UserButton afterSignOutUrl="/" />
          </div>
        </SignedIn>
      </div>

      <button className="md:hidden text-zinc-100 p-2 hover:bg-white/5 rounded-lg transition-colors" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        {isMenuOpen ? <X /> : <Menu />}
      </button>
    </div>
  </nav>
);

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="group p-8 rounded-[32px] bg-zinc-900/40 border border-white/5 hover:border-purple-500/50 transition-all duration-500 hover:translate-y-[-8px] hover:shadow-2xl hover:shadow-purple-500/10">
    <div className="mb-6 p-4 rounded-2xl bg-zinc-950 w-fit ring-1 ring-white/10 group-hover:scale-110 group-hover:ring-purple-500/50 transition-all duration-500">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3 text-white group-hover:text-purple-400 transition-colors">{title}</h3>
    <p className="text-zinc-500 leading-relaxed text-sm group-hover:text-zinc-400 transition-colors">{description}</p>
  </div>
);

const PriceCard = ({ tier, price, description, features, popular = false }: { tier: string, price: string, description: string, features: string[], popular?: boolean }) => (
  <div className={`relative p-8 rounded-[32px] border transition-all duration-500 hover:translate-y-[-8px] ${popular ? "bg-[#0c0c0e] border-purple-500 shadow-2xl shadow-purple-500/20 scale-105 z-10" : "bg-zinc-900/40 border-white/5 hover:border-white/10"}`}>
    {popular && (
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-[10px] font-bold uppercase tracking-widest text-white shadow-lg shadow-purple-500/30">
        Most Popular
      </div>
    )}
    <div className="mb-8">
      <h3 className="text-xl font-bold text-white mb-2">{tier}</h3>
      <p className="text-zinc-500 text-sm">{description}</p>
    </div>
    <div className="mb-8">
      <div className="flex items-baseline gap-1">
        <span className="text-4xl font-black text-white">${price}</span>
        <span className="text-zinc-500">/mo</span>
      </div>
    </div>
    <ul className="space-y-4 mb-10">
      {features.map((feature, i) => (
        <li key={i} className="flex items-center gap-3 text-sm text-zinc-400">
          <CheckCircle2 className={`w-5 h-5 ${popular ? "text-purple-500" : "text-zinc-600"}`} />
          {feature}
        </li>
      ))}
    </ul>
    <button className={`w-full py-4 rounded-2xl font-bold transition-all duration-300 ${popular ? "bg-white text-black hover:bg-zinc-200 shadow-xl shadow-white/10" : "bg-zinc-800 text-white hover:bg-zinc-700 hover:scale-[1.02]"}`}>
      Get Started
    </button>
  </div>
);

// --- Main Page ---

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sync = async () => {
      if (isLoaded && isSignedIn) {
        try {
          await syncUser();
        } catch (error) {
          console.error("Failed to sync user:", error);
        }
      }
    };
    sync();
  }, [isLoaded, isSignedIn]);

  if (!isLoaded) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-[#070708] text-zinc-100 selection:bg-purple-500/30 font-sans selection:text-purple-200 scroll-smooth">
      <Navbar scrolled={scrolled} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-black/98 backdrop-blur-2xl md:hidden flex flex-col items-center justify-center gap-10 animate-in fade-in zoom-in duration-500">
          <button className="absolute top-6 right-6 p-2 text-zinc-400 hover:text-white" onClick={() => setIsMenuOpen(false)}>
            <X className="w-8 h-8" />
          </button>
          <div className="flex flex-col items-center gap-8">
            <NavLink href="#features" onClick={() => setIsMenuOpen(false)}>Features</NavLink>
            <NavLink href="#pricing" onClick={() => setIsMenuOpen(false)}>Pricing</NavLink>
            <NavLink href="#about" onClick={() => setIsMenuOpen(false)}>About</NavLink>
            <SignedIn>
              <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold text-zinc-400 hover:text-white">
                Dashboard
              </Link>
            </SignedIn>
          </div>
          <div className="flex flex-col items-center gap-4 w-full px-10">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="w-full py-4 text-xl font-bold text-zinc-400 hover:text-white">Sign In</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="w-full py-5 rounded-3xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xl shadow-2xl shadow-purple-500/40">
                  Get Started
                </button>
              </SignUpButton>
            </SignedOut>
          </div>
        </div>
      )}

      <main>
        {/* Hero Section */}
        <section className="relative pt-40 pb-24 md:pt-56 md:pb-32 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[700px] bg-purple-600/15 blur-[140px] -z-10 rounded-full animate-pulse-slow"></div>
          <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-pink-600/10 blur-[120px] -z-10 rounded-full"></div>
          
          <div className="container mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-xs font-semibold mb-10 hover:bg-white/10 transition-colors cursor-default">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping"></span>
              AI Video Generation on Steroids
            </div>

            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 tracking-tighter leading-[0.9]">
              AI Video <br />
              <span className="text-gradient drop-shadow-2xl">Simplified.</span>
            </h1>

            <p className="max-w-3xl mx-auto text-zinc-400 text-xl md:text-2xl mb-14 leading-relaxed font-medium">
              Turn your ideas into viral short-form content. Vidmaxx handles the script, voice, and visuals while you grow your brand.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <SignedOut>
                <SignUpButton mode="modal">
                  <button className="w-full sm:w-auto px-10 py-5 rounded-full bg-white text-black font-bold text-xl flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.15)] group">
                    Start Creating Free
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform" />
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard" className="w-full sm:w-auto px-10 py-5 rounded-full bg-white text-black font-bold text-xl flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.15)] group">
                  My Dashboard
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform" />
                </Link>
              </SignedIn>
              <button className="w-full sm:w-auto px-10 py-5 rounded-full bg-zinc-900/50 text-white font-bold text-xl border border-white/10 flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all backdrop-blur-xl">
                <Play className="w-6 h-6 fill-current text-purple-500" />
                See How It Works
              </button>
            </div>

            {/* Product Mockup */}
            <div className="mt-28 relative max-w-6xl mx-auto group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-[40px] blur-2xl opacity-15 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative bg-[#0c0c0e] rounded-[36px] border border-white/10 overflow-hidden shadow-2xl glass-dark">
                <div className="h-12 bg-white/5 border-b border-white/5 flex items-center px-6 gap-2">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500/50"></div>
                  </div>
                  <div className="mx-auto bg-white/5 px-4 py-1 rounded-full text-[10px] text-zinc-500 font-mono">vidmaxx.ai/dashboard</div>
                </div>
                <div className="p-1.5 overflow-hidden rounded-b-[36px]">
                  <div className="bg-[#070708] rounded-[30px] p-10 flex flex-col md:flex-row gap-12 items-center">
                    <div className="flex-1 space-y-8 text-left">
                      <div className="space-y-4">
                        <div className="h-2 w-24 bg-purple-500/50 rounded-full"></div>
                        <div className="h-8 w-3/4 bg-white/5 rounded-2xl"></div>
                        <div className="h-4 w-1/2 bg-white/5 rounded-xl"></div>
                      </div>
                      <div className="grid grid-cols-2 gap-6 pt-4">
                        <div className="aspect-[4/5] bg-white/5 rounded-3xl animate-pulse"></div>
                        <div className="aspect-[4/5] bg-white/5 rounded-3xl animate-pulse delay-700"></div>
                      </div>
                    </div>
                    <div className="w-full md:w-72 aspect-[9/16] bg-gradient-to-br from-zinc-800 to-zinc-950 rounded-[40px] flex items-center justify-center relative shadow-3xl ring-8 ring-white/5 animate-float overflow-hidden">
                      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80')] bg-cover opacity-20 scale-110"></div>
                      <div className="relative flex flex-col items-center gap-4 text-center px-6">
                        <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center">
                          <Play className="w-8 h-8 fill-white" />
                        </div>
                        <p className="text-sm font-bold text-white/50 tracking-widest uppercase">Rendering...</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-24 border-y border-white/5 bg-white/[0.02]">
          <div className="container mx-auto px-6">
            <p className="text-center text-zinc-500 text-xs font-bold uppercase tracking-[0.3em] mb-14">Empowering the next generation</p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all duration-700 cursor-default">
              <div className="text-lg font-black flex items-center gap-3"><Youtube className="w-6 h-6" /> UNBOXED</div>
              <div className="text-lg font-black flex items-center gap-3"><Instagram className="w-6 h-6" /> CREATIVE</div>
              <div className="text-lg font-black flex items-center gap-3"><Zap className="w-6 h-6" /> FAST CO</div>
              <div className="text-lg font-black flex items-center gap-3"><Layout className="w-6 h-6" /> TECHFLOW</div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-40 relative">
          <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-purple-600/5 blur-[120px] -z-10 rounded-full"></div>
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mb-24">
              <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight">Tools to <br /><span className="text-gradient">conquer short-form.</span></h2>
              <p className="text-xl text-zinc-400 max-w-2xl font-medium leading-relaxed">Stop wasting hours on manual editing. Let AI handle the heavy lifting while you focus on scaling your brand across all platforms.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 md:gap-12">
              <FeatureCard
                icon={<Zap className="w-8 h-8 text-purple-500" />}
                title="AI Engine"
                description="Our proprietary pipeline converts simple ideas into high-engagement video assets in seconds."
              />
              <FeatureCard
                icon={<Calendar className="w-8 h-8 text-pink-500" />}
                title="Unified Scheduler"
                description="Queue content for weeks. We auto-post to YouTube Shorts and Instagram Reels."
              />
              <FeatureCard
                icon={<Mail className="w-8 h-8 text-indigo-500" />}
                title="Smart Distribution"
                description="Reach your audience wherever they are. Integrated email marketing for maximum impact."
              />
              <FeatureCard
                icon={<Clock className="w-8 h-8 text-orange-500" />}
                title="Time Arbitrage"
                description="Reclaim 20+ hours every week by automating the most redundant parts of creation."
              />
              <FeatureCard
                icon={<Youtube className="w-8 h-8 text-red-500" />}
                title="Omni-Channel"
                description="Optimized for every platform's algorithm. Native integration with YouTube, TikTok, and Meta."
              />
              <FeatureCard
                icon={<Layout className="w-8 h-8 text-emerald-500" />}
                title="Modern UX"
                description="Designed for high-speed workflows. A premium, glassmorphic interface that breathes."
              />
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-40 bg-white/[0.01]">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-24">
              <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight">Fair, scalable <span className="text-gradient">pricing.</span></h2>
              <p className="text-xl text-zinc-400 font-medium">Choose a plan that grows with your audience. No hidden costs, cancel any time.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-10 max-w-7xl mx-auto items-center">
              <PriceCard
                tier="Starter"
                price="0"
                description="For enthusiasts and small testers"
                features={["5 AI Videos / month", "YouTube Integration", "720p Export", "Community Support"]}
              />
              <PriceCard
                tier="Pro"
                price="29"
                description="The sweet spot for growing creators"
                popular={true}
                features={["50 AI Videos / month", "All Platform Integrations", "1080p HD Quality", "Priority AI Queue", "Advanced Analytics Dashboard"]}
              />
              <PriceCard
                tier="Enterprise"
                price="99"
                description="Scaling for teams and agencies"
                features={["Unlimited AI Generation", "Custom Brand Kits", "4K Rendering", "Dedicated Success Manager", "API Access"]}
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-40">
          <div className="container mx-auto px-6">
            <div className="glass-dark rounded-[60px] p-16 md:p-32 text-center relative overflow-hidden border border-white/10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/15 blur-[140px] -z-10 rounded-full animate-pulse-slow"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-600/10 blur-[140px] -z-10 rounded-full"></div>

              <h2 className="text-5xl md:text-8xl font-black mb-10 tracking-tighter">Scale your brand <br /> with AI today.</h2>
              <p className="text-zinc-400 text-xl md:text-2xl mb-16 max-w-3xl mx-auto font-medium">Join thousands of creators who are automating their content and reclaiming their time.</p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <SignedOut>
                  <SignUpButton mode="modal">
                    <button className="px-14 py-6 rounded-full bg-white text-black font-black text-2xl hover:bg-zinc-200 transition-all hover:scale-105 shadow-3xl shadow-white/5 active:scale-95">
                      Get Started Now
                    </button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <Link href="/dashboard" className="px-14 py-6 rounded-full bg-white text-black font-black text-2xl hover:bg-zinc-200 transition-all hover:scale-105 shadow-3xl shadow-white/5 active:scale-95">
                    Launch Dashboard
                  </Link>
                </SignedIn>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-24 border-t border-white/5 bg-[#070708]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-16 mb-24">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-8 group">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                  <Video className="text-white w-6 h-6" />
                </div>
                <span className="text-2xl font-bold tracking-tight">vidmaxx</span>
              </Link>
              <p className="text-zinc-500 text-sm leading-relaxed max-w-xs font-medium">
                The most advanced AI video automation suite for modern short-form creators. Built for speed and visual excellence.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-8 uppercase tracking-widest text-xs">Product</h4>
              <ul className="space-y-4 text-sm font-medium text-zinc-500">
                <li><a href="#features" className="hover:text-purple-400 transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-purple-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Roadmap</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Changelog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-8 uppercase tracking-widest text-xs">Platform</h4>
              <ul className="space-y-4 text-sm font-medium text-zinc-500">
                <li><a href="#" className="hover:text-purple-400 transition-colors">YouTube Shorts</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Instagram Reels</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">TikTok Ads</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Email Newsletters</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-8 uppercase tracking-widest text-xs">Legal</h4>
              <ul className="space-y-4 text-sm font-medium text-zinc-500">
                <li><a href="#" className="hover:text-purple-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Security</a></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between pt-12 border-t border-white/5 gap-8">
            <p className="text-zinc-500 text-sm font-medium">© 2026 Vidmaxx AI. Engineering the future of content.</p>
            <div className="flex items-center gap-8">
              <a href="#" className="text-zinc-500 hover:text-white transition-all hover:scale-110"><Youtube className="w-6 h-6" /></a>
              <a href="#" className="text-zinc-500 hover:text-white transition-all hover:scale-110"><Instagram className="w-6 h-6" /></a>
              <a href="#" className="text-zinc-500 hover:text-white transition-all hover:scale-110"><Zap className="w-6 h-6" /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

