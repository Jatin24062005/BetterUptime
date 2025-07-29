"use client";

import type React from "react";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Eye,
  EyeOff,
  Github,
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { BACKEND_URL } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    try {
      const response = await axios.post(`${BACKEND_URL}/user/signin`, {
        username: formData.email,
        password: formData.password,
      });

      toast.success("SignIn  Successfully !", {
        description: "Welcome Back  to the BetterUptime ",
      });
      const token = response.data.token;

      if (formData.remember) {
        Cookies.set("token", token, {
          expires: 1,
        });
      } else {
        Cookies.set("token", token, {
          // ⬇️ security / scope
          path: "/", // send on every route
          sameSite: "lax", // or 'strict' / 'none' (if cross‑site over HTTPS)
          secure: true, // true as long as your site is served over HTTPS
        });
      }
      router.push("/dashboard");

      console.log("Response From SignIn Successfully : ", response);
    } catch (error) {
      console.log("SignIn failed: ", error);
      toast.error("SignIn failed !");
    }

    setIsLoading(false);
    // Redirect to dashboard or home
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      router.push("/dashboard");
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0f1419] relative overflow-hidden">
      {/* Vignette Glow Background */}
      <div className="absolute inset-0">
        {/* Main vignette effect */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 50% 40%, 
                rgba(99, 102, 241, 0.15) 0%, 
                rgba(99, 102, 241, 0.08) 25%, 
                rgba(15, 20, 25, 0.95) 60%, 
                rgba(15, 20, 25, 1) 100%
              )
            `,
          }}
        />

        {/* Additional glow effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#6366f1]/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-500/8 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-0 w-64 h-64 bg-purple-500/6 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/3 right-0 w-72 h-72 bg-indigo-500/8 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "0.5s" }}
        ></div>

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Back to home link */}
          <Link
            href="/"
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to home
          </Link>

          <Card className="bg-[#1a1f2e]/80 backdrop-blur-xl border-gray-800/50 shadow-2xl">
            <CardHeader className="text-center pb-8">
              {/* Logo */}
              <div className="flex items-center justify-center space-x-2 mb-6">
                <div className="w-10 h-10 bg-white rounded-sm flex items-center justify-center">
                  <div className="w-8 h-8 bg-[#1a1f2e] rounded-sm flex items-center justify-center">
                    <div className="w-4 h-4 bg-white rounded-sm"></div>
                  </div>
                </div>
                <span className="text-2xl font-bold text-white">
                  BetterUptime
                </span>
              </div>

              <CardTitle className="text-3xl font-bold text-white mb-2">
                Welcome back
              </CardTitle>
              <CardDescription className="text-gray-400 text-lg">
                Sign in to your account to continue monitoring
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-gray-300 text-sm font-medium"
                  >
                    Email address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className="pl-11 h-12 bg-[#0f1419] border-gray-700 text-white placeholder-gray-500 focus:border-[#6366f1] focus:ring-[#6366f1] transition-all"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-gray-300 text-sm font-medium"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      className="pl-11 pr-11 h-12 bg-[#0f1419] border-gray-700 text-white placeholder-gray-500 focus:border-[#6366f1] focus:ring-[#6366f1] transition-all"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      id="remember"
                      type="checkbox"
                      checked={formData.remember}
                      onChange={(e) =>
                        handleInputChange("remember", e.target.checked)
                      }
                      className="w-4 h-4 text-[#6366f1] bg-[#0f1419] border-gray-700 rounded focus:ring-[#6366f1] focus:ring-2"
                      disabled={isLoading}
                    />
                    <Label htmlFor="remember" className="text-sm text-gray-400">
                      Remember me
                    </Label>
                  </div>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-[#6366f1] hover:text-[#5855eb] transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#6366f1] hover:bg-[#5855eb] text-white font-semibold py-3 h-12 transition-all hover:scale-[1.02] disabled:hover:scale-100"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>Sign in to your account</span>
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  )}
                </Button>
              </form>

              {/* Switch to Sign Up */}
              <div className="text-center pt-4 border-t border-gray-800">
                <span className="text-gray-400 text-sm">
                  Don't have an account?{" "}
                </span>
                <Link
                  href="/signup"
                  className="text-[#6366f1] hover:text-[#5855eb] text-sm font-medium transition-colors"
                >
                  Sign up for free
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Trust indicators */}
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center space-x-6 text-gray-500 text-sm">
              <div className="flex items-center space-x-2">
                <span>🔒</span>
                <span>Secure login</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>⚡</span>
                <span>Instant access</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>🌍</span>
                <span>Global monitoring</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
