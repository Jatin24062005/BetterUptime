"use client";

import type React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { Bricolage_Grotesque, Instrument_Sans } from "next/font/google";
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BACKEND_URL } from "@/lib/utils";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});
const body = Instrument_Sans({ subsets: ["latin"], variable: "--font-body" });

const inputCls =
  "h-12 rounded-xl border-white/10 bg-white/[0.04] pl-11 text-[15px] text-white placeholder:text-zinc-600 focus-visible:border-emerald-400/50 focus-visible:ring-emerald-400/20";

// Decorative heartbeat strip for the brand panel
const DEMO = [40, 55, 35, 60, 45, 50, 38, 65, 42, 100, 48, 52, 36, 58, 44, 49, 61, 39, 54, 47, 43, 57, 41, 50];

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "", remember: false });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(`${BACKEND_URL}/user/signin`, {
        username: formData.email,
        password: formData.password,
      });

      toast.success("Signed in", { description: "Welcome back to BetterUptime." });
      const token = response.data.token;

      if (formData.remember) {
        Cookies.set("token", token, { expires: 1 });
      } else {
        Cookies.set("token", token, {
          path: "/",
          sameSite: "lax",
          secure: true,
        });
      }
      router.push("/dashboard");
    } catch (error) {
      console.log("SignIn failed: ", error);
      toast.error("Sign in failed. Check your email and password.");
    }

    setIsLoading(false);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) router.push("/dashboard");
  }, [router]);

  return (
    <div
      className={`${display.variable} ${body.variable} grid min-h-screen bg-[#07090d] font-[family-name:var(--font-body)] text-zinc-300 antialiased selection:bg-emerald-400/30 lg:grid-cols-[1.05fr_1fr]`}
    >
      {/* Brand panel */}
      <aside className="relative hidden overflow-hidden border-r border-white/[0.06] lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_30%_100%,rgba(52,211,153,0.16),transparent),radial-gradient(ellipse_50%_40%_at_80%_0%,rgba(20,184,166,0.08),transparent)]"
        />
        <Link href="/" className="relative flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-emerald-300 to-teal-500 shadow-[0_0_28px_-4px_rgba(52,211,153,0.6)]">
            <span className="h-3.5 w-3.5 rounded-full bg-[#06100d]" />
          </span>
          <span className="font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight text-white">
            BetterUptime
          </span>
        </Link>

        <div className="relative max-w-lg">
          <h2 className="font-[family-name:var(--font-display)] text-5xl font-semibold leading-[1.05] tracking-tight text-white">
            Know it&apos;s down before your users do.
          </h2>
          <p className="mt-5 text-lg text-zinc-400">
            Uptime checks, response times and incident history for every website you run.
          </p>

          <div className="mt-10 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="relative inline-flex h-2.5 w-2.5">
                  <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative h-full w-full rounded-full bg-emerald-400" />
                </span>
                <span className="font-medium text-white">example.com</span>
              </div>
              <span className="text-sm text-emerald-300">124 ms</span>
            </div>
            <div className="mt-4 flex h-10 items-end gap-[3px]" aria-hidden>
              {DEMO.map((h, i) => (
                <span
                  key={i}
                  style={{ height: `${h}%` }}
                  className={`flex-1 rounded-full ${h === 100 ? "bg-rose-500" : "bg-emerald-400/90"}`}
                />
              ))}
            </div>
          </div>
        </div>

        <p className="relative text-sm text-zinc-500">Checks run around the clock from multiple regions.</p>
      </aside>

      {/* Form */}
      <main className="relative flex items-center justify-center p-6 sm:p-10">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_60%_100%_at_50%_0%,rgba(52,211,153,0.09),transparent)] lg:hidden"
        />
        <div className="relative w-full max-w-[400px]">
          <Link
            href="/"
            className="group mb-10 inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back to home
          </Link>

          <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-white">
            Welcome back
          </h1>
          <p className="mt-2 text-zinc-400">Sign in to keep an eye on your websites.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-zinc-300">
                Email
              </Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-zinc-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={inputCls}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium text-zinc-300">
                  Password
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-zinc-400 transition-colors hover:text-emerald-300"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-zinc-500" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className={`${inputCls} pr-11`}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors hover:text-zinc-200"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                </button>
              </div>
            </div>

            <label htmlFor="remember" className="flex cursor-pointer items-center gap-2.5 text-sm text-zinc-400">
              <input
                id="remember"
                type="checkbox"
                checked={formData.remember}
                onChange={(e) => handleInputChange("remember", e.target.checked)}
                className="h-4 w-4 rounded border-white/20 bg-white/5 accent-emerald-400"
                disabled={isLoading}
              />
              Keep me signed in
            </label>

            <Button
              type="submit"
              disabled={isLoading}
              className="h-12 w-full rounded-xl bg-emerald-400 text-[15px] font-semibold text-[#04120c] shadow-[0_8px_30px_-8px_rgba(52,211,153,0.6)] transition-colors hover:bg-emerald-300 disabled:opacity-60"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#04120c] border-t-transparent" />
                  Signing in
                </span>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-zinc-500">
            New to BetterUptime?{" "}
            <Link href="/signup" className="font-medium text-emerald-300 hover:text-emerald-200">
              Create a free account
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}