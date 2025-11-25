"use client";

import { useState, useEffect, useRef, useLayoutEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Play, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import VideoModal from "@/components/videoModal";

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const [email, setEmail] = useState("");
  const [currentFeature, setCurrentFeature] = useState(0);
  const [videoOpen, setVideoOpen] = useState(false);
  const features = [
    "99.9% uptime SLA guaranteed",
    "30-second monitoring intervals",
    "Global monitoring locations",
    "Instant alert notifications",
  ];

  // 🔗 Refs for GSAP
  const sectionRef = useRef<HTMLElement | null>(null);
  const badgeRef = useRef<HTMLDivElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const subRef = useRef<HTMLParagraphElement | null>(null);
  const formRef = useRef<HTMLDivElement | null>(null);
  const secondaryCtaRef = useRef<HTMLDivElement | null>(null);
  const rotatingFeatureRef = useRef<HTMLParagraphElement | null>(null);
  const dashboardRef = useRef<HTMLDivElement | null>(null);
  const trustRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLDivElement | null>(null);

  const handleOpenVideo = () => {
    if (secondaryCtaRef.current) {
      secondaryCtaRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }

    // small delay so scroll finishes before modal appears
    setTimeout(() => {
      setVideoOpen(true);
    }, 200);
  };
  // 🎯 Rotating feature text (existing behaviour)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [features.length]);

  // 💫 Hero intro, parallax blobs, floating dashboard, trust stats
  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Main hero entrance timeline
      const tl = gsap.timeline({
        defaults: { ease: "power3.out", duration: 1 },
      });

      tl.from(sectionRef.current, { opacity: 0, y: 40, duration: 0.7 })
        .from(badgeRef.current, { opacity: 0, y: 20 }, "-=0.4")
        .from(headingRef.current, { opacity: 0, y: 40 }, "-=0.3")
        .from(subRef.current, { opacity: 0, y: 30 }, "-=0.3")
        .from(formRef.current, { opacity: 0, y: 30 }, "-=0.25")
        .from(secondaryCtaRef.current, { opacity: 0, y: 20 }, "-=0.3")
        .from(
          dashboardRef.current,
          {
            opacity: 0,
            y: 50,
            scale: 0.96,
            duration: 1.1,
          },
          "-=0.2"
        );

      // Background blobs parallax
      const blobs = gsap.utils.toArray<HTMLElement>(".hero-blob");
      blobs.forEach((blob, i) => {
        gsap.to(blob, {
          yPercent: i === 0 ? 25 : -20,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      // Floating dashboard subtle animation
      if (dashboardRef.current) {
        gsap.to(dashboardRef.current, {
          y: -12,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
        });
      }

      // Trust indicators stagger on scroll
      if (trustRef.current) {
        const cards = trustRef.current.querySelectorAll("[data-trust-card]");
        gsap.from(cards, {
          opacity: 0,
          y: 24,
          stagger: 0.12,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: trustRef.current,
            start: "top 80%",
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // 🔁 Animate rotating feature text each time it changes
  useEffect(() => {
    if (!rotatingFeatureRef.current) return;
    gsap.fromTo(
      rotatingFeatureRef.current,
      { opacity: 0, y: 10 },
      {
        opacity: 1,
        y: 0,
        duration: 0.45,
        ease: "power2.out",
      }
    );
  }, [currentFeature]);

  return (
    <section
      ref={sectionRef}
      className="pt-32 pb-20 bg-[#0f1419] relative overflow-hidden"
    >
      {/* Background gradient effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="hero-blob absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-[#6366f1]/5 rounded-full blur-3xl" />
        <div className="hero-blob absolute bottom-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div ref={badgeRef}>
            <Badge
              variant="outline"
              className="border-gray-700 text-gray-300 mb-6 px-4 py-2 inline-flex items-center"
            >
              <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
              Trusted by 50,000+ websites worldwide
            </Badge>
          </div>

          <h1
            ref={headingRef}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8 leading-tight text-white"
          >
            The most reliable
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
              uptime monitoring
            </span>
          </h1>

          <p
            ref={subRef}
            className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Get 10 monitors, 10 heartbeats and a status page
            <br />
            with 3-minute checks totally free.
          </p>

          <div
            ref={formRef}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 max-w-lg mx-auto"
          >
            <input
              type="email"
              placeholder="Your work e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full sm:flex-1 px-4 py-3 bg-[#1a1f2e] border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent transition-all"
            />
            <Button
              className="w-full sm:w-auto bg-[#6366f1] hover:bg-[#5855eb] text-white px-8 py-3 rounded-md font-medium whitespace-nowrap transition-all hover:scale-105"
              asChild
            >
              <Link href="/signup">
                Get started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div
            ref={secondaryCtaRef}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8"
          >
            <Button
              variant="outline"
              className="border-gray-700 text-gray-300 hover:bg-gray-800/50 hover:text-white px-6 py-2 bg-transparent"
              onClick={handleOpenVideo}
            >
              <Play className="mr-2 h-4 w-4" />
              Watch 50-sec demo
            </Button>

            <p className="text-gray-500 text-sm">
              Looking for an enterprise solution?{" "}
              <a
              onClick={handleOpenVideo}
                className="text-gray-400 hover:text-white underline transition-colors"
              >
                Book a demo
              </a>
            </p>
          </div>

          {/* Rotating features */}
          <div className="mb-12">
            <div className="h-8 flex items-center justify-center">
              <p ref={rotatingFeatureRef} className="text-gray-400">
                {features[currentFeature]}
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="max-w-5xl mx-auto">
          <div
            ref={dashboardRef}
            className="bg-[#1a1f2e] rounded-lg border border-gray-800 overflow-hidden shadow-2xl"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-[#151a23]">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center">
                    <div className="w-3 h-3 bg-[#1a1f2e] rounded-sm" />
                  </div>
                  <span className="text-white font-medium">
                    Uptime Dashboard
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                <div className="w-3 h-3 bg-green-500 rounded-full" />
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
                <div className="flex items-center space-x-2 text-gray-400 p-2 rounded border border-gray-800">
                  <div className="w-4 h-4 border border-gray-600 rounded" />
                  <span className="text-sm">Monitors</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400 p-2 rounded border border-gray-800">
                  <div className="w-4 h-4 border border-gray-600 rounded" />
                  <span className="text-sm">Heartbeats</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400 p-2 rounded border border-gray-800">
                  <div className="w-4 h-4 border border-gray-600 rounded" />
                  <span className="text-sm">On-call</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400 p-2 rounded border border-gray-800">
                  <div className="w-4 h-4 border border-gray-600 rounded" />
                  <span className="text-sm">Incidents</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400 p-2 rounded border border-gray-800">
                  <div className="w-4 h-4 border border-gray-600 rounded" />
                  <span className="text-sm">Status pages</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-[#0f1419] rounded-lg p-4 border border-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-white font-medium">
                        example.com
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span>Up</span>
                      <span>•</span>
                      <span>Checked every 30 seconds</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>⚠️ Send a test alert</span>
                    <span>📊 Incidents</span>
                    <span>⏸️ Pause this monitor</span>
                    <span>⚙️ Configure</span>
                    <div className="ml-auto">
                      <span>🎥 Cameron is currently on-call</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0f1419] rounded-lg p-4 border border-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-white font-medium">
                        api.example.com
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span>Up</span>
                      <span>•</span>
                      <span>Response time: 124ms</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>🔍 View logs</span>
                    <span>📈 Performance</span>
                    <span>🔧 Settings</span>
                  </div>
                </div>

                <div className="bg-[#0f1419] rounded-lg p-4 border border-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      <span className="text-white font-medium">
                        staging.example.com
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span className="text-red-400">Down</span>
                      <span>•</span>
                      <span>Last checked 2 minutes ago</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span className="text-red-400">🚨 Alert sent</span>
                    <span>📸 Screenshot taken</span>
                    <span>🔍 Error logs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust indicators */}
        <div ref={trustRef} className="mt-16 text-center">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-3xl mx-auto">
            <div className="text-center" data-trust-card>
              <div className="text-2xl font-bold text-white mb-1">99.99%</div>
              <div className="text-gray-400 text-sm">Uptime SLA</div>
            </div>
            <div className="text-center" data-trust-card>
              <div className="text-2xl font-bold text-white mb-1">30s</div>
              <div className="text-gray-400 text-sm">Check interval</div>
            </div>
            <div className="text-center" data-trust-card>
              <div className="text-2xl font-bold text-white mb-1">15+</div>
              <div className="text-gray-400 text-sm">Global locations</div>
            </div>
            <div className="text-center" data-trust-card>
              <div className="text-2xl font-bold text-white mb-1">50K+</div>
              <div className="text-gray-400 text-sm">Websites monitored</div>
            </div>
          </div>
        </div>
      </div>
      <VideoModal open={videoOpen} onClose={() => setVideoOpen(false)} />
    </section>
  );
}
