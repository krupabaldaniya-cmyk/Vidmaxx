"use client";

import React, { useState, useEffect } from "react";
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

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#070708] text-zinc-100 selection:bg-purple-500/30 font-sans selection:text-purple-200">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "glass-dark py-3" : "bg-transparent py-5"}`}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform">
              <Video className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">vidmaxx</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Pricing</a>
            <a href="#about" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">About</a>
            <button className="px-5 py-2.5 rounded-full bg-white text-black text-sm font-semibold hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-white/5">
              Get Started
            </button>
          </div>

          <button className="md:hidden text-zinc-100" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl md:hidden flex flex-col items-center justify-center gap-8 animate-in fade-in zoom-in duration-300">
          <a href="#features" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold text-zinc-400 hover:text-white transition-colors">Features</a>
          <a href="#pricing" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold text-zinc-400 hover:text-white transition-colors">Pricing</a>
          <a href="#about" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold text-zinc-400 hover:text-white transition-colors">About</a>
          <button className="px-10 py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg shadow-xl shadow-purple-500/20">
            Get Started
          </button>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-purple-600/20 blur-[120px] -z-10 rounded-full animate-pulse-slow"></div>
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-pink-600/10 blur-[100px] -z-10 rounded-full"></div>

        <div className="container mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
            AI-Powered Video Generation is here
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight">
            AI Video Generation <br />
            <span className="text-gradient">on Autopilot.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-zinc-400 text-lg md:text-xl mb-12 leading-relaxed">
            Create, schedule, and grow your presence across YouTube, Instagram, and Email. Vidmaxx automates your content workflow from idea to upload.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-black font-bold text-lg flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all hover:scale-105 shadow-xl shadow-white/5 group">
              Start Free Trial
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-zinc-900 text-white font-bold text-lg border border-zinc-800 flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all">
              <Play className="w-5 h-5 fill-current" />
              Watch Demo
            </button>
          </div>

          {/* Product Preview Mockup */}
          <div className="mt-20 relative max-w-5xl mx-auto group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-zinc-950 rounded-2xl border border-zinc-800 overflow-hidden shadow-2xl glass-dark">
              <div className="absolute top-0 left-0 right-0 h-10 bg-zinc-900 border-b border-zinc-800 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-zinc-700"></div>
                <div className="w-3 h-3 rounded-full bg-zinc-700"></div>
                <div className="w-3 h-3 rounded-full bg-zinc-700"></div>
              </div>
              <div className="pt-20 pb-10 px-10 flex flex-col md:flex-row gap-10 items-center">
                <div className="flex-1 space-y-6 text-left">
                  <div className="h-4 w-3/4 bg-zinc-800 rounded-full animate-pulse"></div>
                  <div className="h-4 w-1/2 bg-zinc-800 rounded-full animate-pulse"></div>
                  <div className="h-4 w-5/6 bg-zinc-800 rounded-full animate-pulse"></div>
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="aspect-video bg-zinc-800 rounded-lg animate-pulse"></div>
                    <div className="aspect-video bg-zinc-800 rounded-lg animate-pulse"></div>
                  </div>
                </div>
                <div className="w-full md:w-64 aspect-[9/16] bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl flex items-center justify-center relative overflow-hidden ring-1 ring-zinc-700 animate-float">
                  <Video className="w-12 h-12 text-purple-500/50" />
                  <div className="absolute bottom-4 left-4 right-4 h-2 bg-purple-500/20 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 w-2/3"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Trusted By */}
      <section className="py-20 border-y border-zinc-900">
        <div className="container mx-auto px-6">
          <p className="text-center text-zinc-500 text-sm font-medium uppercase tracking-widest mb-10">Trusted by modern content creators</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="text-2xl font-bold flex items-center gap-2"><Youtube /> UNBOXED</div>
            <div className="text-2xl font-bold flex items-center gap-2"><Instagram /> CREATIVE</div>
            <div className="text-2xl font-bold flex items-center gap-2"><Zap /> FAST CO</div>
            <div className="text-2xl font-bold flex items-center gap-2"><Layout /> TECHFLOW</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-purple-600/5 blur-[100px] -z-10 rounded-full"></div>
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Everything you need to <br /><span className="text-gradient">dominate short-form.</span></h2>
            <p className="text-lg text-zinc-400">We handle the technical heavy lifting so you can focus on the big ideas. AI does the creation, Vidmaxx does the heavy lifting.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Zap className="w-8 h-8 text-purple-500" />}
              title="AI Generator"
              description="Turn text into stunning viral shorts in seconds. No video editing skills required."
            />
            <FeatureCard
              icon={<Calendar className="w-8 h-8 text-pink-500" />}
              title="Auto Scheduler"
              description="Schedule your content weeks in advance for Youtube Shorts and Instagram Reels."
            />
            <FeatureCard
              icon={<Mail className="w-8 h-8 text-indigo-500" />}
              title="Email Integration"
              description="Automatically send your latest videos to your email list subscribers with ease."
            />
            <FeatureCard
              icon={<Clock className="w-8 h-8 text-orange-500" />}
              title="Save 20+ Hours"
              description="Automate the boring parts of content creation and reclaim your most valuable asset."
            />
            <FeatureCard
              icon={<Youtube className="w-8 h-8 text-red-500" />}
              title="Multi-Platform"
              description="One dashboard for all your platforms. Seamless integration with the APIs you Love."
            />
            <FeatureCard
              icon={<Layout className="w-8 h-8 text-green-500" />}
              title="Modern Dashboard"
              description="A premium experience designed for speed and ease of use. Clean and intuitive."
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 bg-zinc-950/50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Simple, transparent <span className="text-gradient">pricing.</span></h2>
            <p className="text-zinc-400">Choose the plan that fits your growth strategy. No hidden fees.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <PriceCard
              tier="Starter"
              price="0"
              description="Perfect for experimenting"
              features={["5 AI Videos / month", "YouTube Integration", "Basic Analytics", "Community Support"]}
            />
            <PriceCard
              tier="Pro"
              price="29"
              description="For serious creators"
              popular={true}
              features={["50 AI Videos / month", "All Integrations", "Advanced Analytics", "Priority Support", "Schedule Unlimited"]}
            />
            <PriceCard
              tier="Enterprise"
              price="99"
              description="For brands and agencies"
              features={["Unlimited Videos", "Custom Branding", "API Access", "Dedicated Manager", "Team Collaboration"]}
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-10">About Vidmaxx</h2>
          <p className="max-w-2xl mx-auto text-zinc-400 text-lg leading-relaxed">
            Vidmaxx was born from a simple observation: content creators spend too much time on repetitive tasks. Our mission is to empower the next generation of creators with AI-driven tools that handle the heavy lifting of video generation and distribution.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32">
        <div className="container mx-auto px-6">
          <div className="glass-dark rounded-[40px] p-12 md:p-24 text-center relative overflow-hidden border border-zinc-800">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/20 blur-[100px] -z-10 rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-600/10 blur-[100px] -z-10 rounded-full"></div>

            <h2 className="text-4xl md:text-6xl font-black mb-8">Ready to automate your <br /> content growth?</h2>
            <p className="text-zinc-400 text-lg mb-12 max-w-2xl mx-auto">Join 5,000+ creators who are already saving hundreds of hours every month with Vidmaxx.</p>
            <button className="px-12 py-5 rounded-full bg-white text-black font-bold text-xl hover:bg-zinc-200 transition-all hover:scale-105 shadow-2xl">
              Get Started for Free
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-zinc-900 bg-[#070708]">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                  <Video className="text-white w-5 h-5" />
                </div>
                <span className="text-xl font-bold tracking-tight">vidmaxx</span>
              </div>
              <p className="text-zinc-500 text-sm leading-relaxed">
                The leading AI short video generator and scheduler for modern creators who value their time.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Product</h4>
              <ul className="space-y-4 text-sm text-zinc-500">
                <li><a href="#" className="hover:text-purple-400 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Changelog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-zinc-500">
                <li><a href="#" className="hover:text-purple-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Legal</h4>
              <ul className="space-y-4 text-sm text-zinc-500">
                <li><a href="#" className="hover:text-purple-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between pt-10 border-t border-zinc-900 gap-6">
            <p className="text-zinc-500 text-sm">© 2026 Vidmaxx AI. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-zinc-500 hover:text-white transition-colors"><Youtube className="w-5 h-5" /></a>
              <a href="#" className="text-zinc-500 hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="text-zinc-500 hover:text-white transition-colors"><Zap className="w-5 h-5" /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="group p-8 rounded-[32px] bg-zinc-900/50 border border-zinc-800 hover:border-purple-500/50 transition-all duration-500 hover:translate-y-[-5px]">
      <div className="mb-6 p-3 rounded-2xl bg-zinc-950 w-fit ring-1 ring-zinc-800 group-hover:scale-110 transition-transform duration-500">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
      <p className="text-zinc-500 leading-relaxed text-sm group-hover:text-zinc-400 transition-colors">{description}</p>
    </div>
  );
}

function PriceCard({ tier, price, description, features, popular = false }: { tier: string, price: string, description: string, features: string[], popular?: boolean }) {
  return (
    <div className={`relative p-8 rounded-[32px] border transition-all duration-500 hover:translate-y-[-5px] ${popular ? "bg-zinc-900 border-purple-500 shadow-2xl shadow-purple-500/10 scale-105 z-10" : "bg-zinc-900/50 border-zinc-800"}`}>
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-[10px] font-bold uppercase tracking-widest text-white shadow-lg shadow-purple-500/20">
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
      <button className={`w-full py-4 rounded-2xl font-bold transition-all ${popular ? "bg-white text-black hover:bg-zinc-200 shadow-xl shadow-white/5" : "bg-zinc-800 text-white hover:bg-zinc-700"}`}>
        Get Started
      </button>
    </div>
  );
}
