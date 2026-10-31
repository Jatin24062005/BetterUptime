"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { Bricolage_Grotesque, Instrument_Sans } from "next/font/google";
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Check } from "lucide-react";
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

const perks = [
  "10 monitors and heartbeats included",
  "3-minute check intervals",
  "Free status page included",
];

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(`${BACKEND_URL}/user/signup`, {
        username: formData.email,
        password: formData.password,
      });
      Cookies.set("token", response.data.token, { expires: 7 });
      toast.success("Account created", { description: "Welcome to BetterUptime." });
      router.push("/dashboard");
      console.log("signUp SuccessFull Response : ", response);
    } catch (err) {
      console.log("SignUp failed !", err);
      toast.error("Couldn't create your account. Try a different email.");
    }

    setIsLoading(false);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const strengthColors = ["bg-rose-500", "bg-rose-400", "bg-amber-400", "bg-emerald-400", "bg-emerald-400"];
  const strengthLabels = ["Very weak", "Weak", "Fair", "Good", "Strong"];
  const strengthText =
    passwordStrength >= 4 ? "text-emerald-300" : passwordStrength >= 3 ? "text-emerald-300" : passwordStrength >= 2 ? "text-amber-300" : "text-rose-300";

  const mismatch = !!formData.confirmPassword && formData.password !== formData.confirmPassword;

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
            Start monitoring your websites in 30 seconds.
          </h2>
          <ul className="mt-10 space-y-4">
            {perks.map((p) => (
              <li key={p} className="flex items-center gap-3 text-zinc-300">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-400/15">
                  <Check className="h-3.5 w-3.5 text-emerald-300" />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-sm text-zinc-500">No credit card needed.</p>
      </aside>

      {/* Form */}
      <main className="relative flex items-center justify-center p-6 sm:p-10">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_60%_100%_at_50%_0%,rgba(52,211,153,0.09),transparent)] lg:hidden"
        />
        <div className="relative w-full max-w-[420px] py-6">
          <Link
            href="/"
            className="group mb-8 inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back to home
          </Link>

          <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-white">
            Create your account
          </h1>
          <p className="mt-2 text-zinc-400">Free to start. Set up your first monitor in a minute.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-zinc-300">
                Full name
              </Label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-zinc-500" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Alex Morgan"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={inputCls}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

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
              <Label htmlFor="password" className="text-sm font-medium text-zinc-300">
                Password
              </Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-zinc-500" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 8 characters"
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

              {formData.password && (
                <div className="space-y-1.5 pt-1">
                  <div className="flex gap-1.5">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          i < passwordStrength ? strengthColors[passwordStrength - 1] : "bg-white/10"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-zinc-500">
                    Strength:{" "}
                    <span className={strengthText}>{strengthLabels[passwordStrength - 1] || "Very weak"}</span>
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-zinc-300">
                Confirm password
              </Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-zinc-500" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Repeat your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  className={`${inputCls} pr-11 ${mismatch ? "border-rose-500/60 focus-visible:border-rose-500/60 focus-visible:ring-rose-500/20" : ""}`}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors hover:text-zinc-200"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                </button>
              </div>
              {mismatch && <p className="text-xs text-rose-300">Passwords don&apos;t match.</p>}
            </div>

            <label htmlFor="acceptTerms" className="flex cursor-pointer items-start gap-2.5 text-sm leading-relaxed text-zinc-400">
              <input
                id="acceptTerms"
                type="checkbox"
                checked={formData.acceptTerms}
                onChange={(e) => handleInputChange("acceptTerms", e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-white/20 bg-white/5 accent-emerald-400"
                disabled={isLoading}
                required
              />
              <span>
                I agree to the{" "}
                <Link href="/terms" className="text-emerald-300 hover:text-emerald-200">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-emerald-300 hover:text-emerald-200">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>

            <Button
              type="submit"
              disabled={isLoading || mismatch || !formData.acceptTerms}
              className="h-12 w-full rounded-xl bg-emerald-400 text-[15px] font-semibold text-[#04120c] shadow-[0_8px_30px_-8px_rgba(52,211,153,0.6)] transition-colors hover:bg-emerald-300 disabled:opacity-50 disabled:shadow-none"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#04120c] border-t-transparent" />
                  Creating account
                </span>
              ) : (
                "Create account"
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-zinc-500">
            Already have an account?{" "}
            <Link href="/signin" className="font-medium text-emerald-300 hover:text-emerald-200">
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}