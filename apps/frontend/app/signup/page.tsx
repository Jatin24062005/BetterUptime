"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Github, Mail, Lock, User, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react"
import axios from "axios"
import { BACKEND_URL } from "@/lib/utils"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call

    try{
      const response = await axios.post(`${BACKEND_URL}/user/signup`,{
         username : formData.email,
         password : formData.password
      })

      toast.success("Account Created Successfully !",{
        description: "Welcome to the BetterUptime ",
      });
      router.push("/");

      console.log("signUp SuccessFull Response : ",response);

    }catch(e){
     console.log("SignUp failed !",e);
    }

    setIsLoading(false)
    // Redirect to dashboard or verification page
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const getPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    return strength
  }

  const passwordStrength = getPasswordStrength(formData.password)
  const strengthColors = ["bg-red-500", "bg-red-400", "bg-yellow-500", "bg-green-400", "bg-green-500"]
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong"]

  useEffect(()=>{
    const token = Cookies.get("token")
    if(token){
      router.push('/dashoboard')
    }
  },[])

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
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#6366f1]/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 left-1/4 w-80 h-80 bg-green-500/8 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 right-0 w-64 h-64 bg-purple-500/6 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/3 left-0 w-72 h-72 bg-blue-500/8 rounded-full blur-3xl animate-pulse"
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
                <span className="text-2xl font-bold text-white">BetterUptime</span>
              </div>

              <CardTitle className="text-3xl font-bold text-white mb-2">Create your account</CardTitle>
              <CardDescription className="text-gray-400 text-lg">
                Start monitoring your websites in 30 seconds
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
             

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300 text-sm font-medium">
                    Full name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="pl-11 h-12 bg-[#0f1419] border-gray-700 text-white placeholder-gray-500 focus:border-[#6366f1] focus:ring-[#6366f1] transition-all"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300 text-sm font-medium">
                    Email address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="pl-11 h-12 bg-[#0f1419] border-gray-700 text-white placeholder-gray-500 focus:border-[#6366f1] focus:ring-[#6366f1] transition-all"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-300 text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
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
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="space-y-2">
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-all ${
                              i < passwordStrength ? strengthColors[passwordStrength - 1] : "bg-gray-700"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-400">
                        Password strength:{" "}
                        <span
                          className={`${passwordStrength >= 3 ? "text-green-400" : passwordStrength >= 2 ? "text-yellow-400" : "text-red-400"}`}
                        >
                          {strengthLabels[passwordStrength - 1] || "Very Weak"}
                        </span>
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-300 text-sm font-medium">
                    Confirm password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      className="pl-11 pr-11 h-12 bg-[#0f1419] border-gray-700 text-white placeholder-gray-500 focus:border-[#6366f1] focus:ring-[#6366f1] transition-all"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-xs text-red-400">Passwords do not match</p>
                  )}
                </div>

                <div className="flex items-start space-x-2">
                  <input
                    id="acceptTerms"
                    type="checkbox"
                    checked={formData.acceptTerms}
                    onChange={(e) => handleInputChange("acceptTerms", e.target.checked)}
                    className="w-4 h-4 text-[#6366f1] bg-[#0f1419] border-gray-700 rounded focus:ring-[#6366f1] focus:ring-2 mt-1"
                    disabled={isLoading}
                    required
                  />
                  <Label htmlFor="acceptTerms" className="text-sm text-gray-400 leading-relaxed">
                    I agree to the{" "}
                    <Link href="/terms" className="text-[#6366f1] hover:text-[#5855eb] transition-colors">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-[#6366f1] hover:text-[#5855eb] transition-colors">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#6366f1] hover:bg-[#5855eb] text-white font-semibold py-3 h-12 transition-all hover:scale-[1.02] disabled:hover:scale-100"
                  disabled={isLoading || formData.password !== formData.confirmPassword || !formData.acceptTerms}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating account...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>Create your account</span>
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  )}
                </Button>
              </form>

              {/* Switch to Sign In */}
              <div className="text-center pt-4 border-t border-gray-800">
                <span className="text-gray-400 text-sm">Already have an account? </span>
                <Link
                  href="/signin"
                  className="text-[#6366f1] hover:text-[#5855eb] text-sm font-medium transition-colors"
                >
                  Sign in
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Features preview */}
          <div className="mt-8">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center space-x-3 text-gray-400 text-sm">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>10 monitors and heartbeats included</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400 text-sm">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>3-minute check intervals</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400 text-sm">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>Free status page included</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
