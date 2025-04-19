"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValue, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Download,
  Zap,
  Smartphone,
  Sparkles,
  Code,
  Star,
  Users,
  MessageSquare,
  CheckCircle,
  Clock,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMobile } from "@/hooks/use-mobile";
import { ParticleBackground } from "@/components/particle-background";
// import { DeviceMockup } from "@/components/device-mockup"
// import { VideoDemo } from "@/components/video-demo"
// import { IntegrationLogos } from "@/components/integration-logos"
import { DeviceMockup } from "@/components/device-mockup";
import { VideoDemo } from "@/components/video-demo";
import { IntegrationLogos } from "@/components/integration-logos";
export default function LandingPage() {
  const isMobile = useMobile();
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const workflowRef = useRef<HTMLDivElement>(null);
  const showcaseRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 100], [1, 0.9]);
  const lastScrollY = useRef(0);
  const headerY = useMotionValue(0);

  useEffect(() => {
    return scrollY.on("change", (y) => {
      const isScrollingDown = y > lastScrollY.current;
      headerY.set(isScrollingDown ? -80 : 0); // Adjust -80 to your header height
      lastScrollY.current = y;
    });
  }, []);
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-black text-white">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-b from-black via-gray-900 to-black opacity-80" />

      {/* Particle background */}
      {/* <ParticleBackground /> */}

      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute -top-[30%] left-[10%] h-[500px] w-[500px] rounded-full bg-purple-700/20 blur-[120px]" />
        <div className="absolute -bottom-[10%] right-[20%] h-[400px] w-[400px] rounded-full bg-rose-700/20 blur-[100px]" />
        <div className="absolute left-[40%] top-[30%] h-[300px] w-[300px] rounded-full bg-blue-700/20 blur-[80px]" />
      </div>

      {/* Header */}
      <motion.header
        style={{
          y: headerY,
          opacity: headerOpacity,
        }}
        className="fixed top-0 left-20 right-20 z-50 h-20 bg-gradient-to-r opacity-90   backdrop-blur-2xl  transition-all duration-500"
      >
        {" "}
        <div className="container flex h-20 items-center justify-between">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2"
          >
            <div className="relative">
              <Sparkles className="h-8 w-8 text-rose-500" />
              <div className="absolute -inset-1 animate-pulse rounded-full bg-rose-500/30 blur-sm" />
            </div>
            <span className="text-2xl font-bold tracking-tight">AppCraft</span>
          </motion.div>
          <nav className="hidden md:flex items-center gap-8">
            {[
              "Features",
              "Workflow",
              "Showcase",
              "Pricing",
              "Testimonials",
              "FAQ",
            ].map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * i }}
              >
                <Link
                  href={`#${item.toLowerCase()}`}
                  className="group relative text-sm font-medium text-gray-300 transition-colors hover:text-white"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 h-[1px] w-0 bg-gradient-to-r from-rose-500 to-purple-600 transition-all duration-300 group-hover:w-full" />
                </Link>
              </motion.div>
            ))}
          </nav>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex items-center gap-4"
          >
            <Link
              href="#pricing"
              className="hidden rounded-full bg-gradient-to-r from-rose-500 to-purple-600 px-6 py-2 text-sm font-medium text-white transition-transform hover:scale-105 sm:inline-flex"
            >
              Get Premium
            </Link>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-700 bg-black/50 text-white hover:bg-black/80 hover:text-rose-400"
            >
              Sign In
            </Button>
          </motion.div>
        </div>
      </motion.header>

      <main className="relative z-10 flex-1 ">
        {/* Hero Section */}
        <section
          ref={heroRef}
          className="relative overflow-hidden py-20 md:py-32 mx-10"
        >
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="space-y-8"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="inline-block rounded-full bg-gradient-to-r from-rose-500/20 to-purple-600/20 px-4 py-1.5 text-sm font-medium text-rose-300"
                >
                  Premium App Builder
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl"
                >
                  Build React Native Apps{" "}
                  <span className="bg-gradient-to-r from-rose-400 to-purple-500 bg-clip-text text-transparent">
                    Without Coding
                  </span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="max-w-[600px] text-gray-400 md:text-xl/relaxed"
                >
                  Create, preview, and download production-ready mobile apps in
                  minutes, not months. The most advanced app builder for
                  technical and non-technical users.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <Link
                    href="/build"
                    className="rounded-full bg-gradient-to-r from-rose-500 to-purple-600 px-8 py-3 text-sm font-medium text-white transition-transform hover:scale-105 flex items-center justify-center"
                  >
                    Start Building my app
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                  <Link
                    href="#demo"
                    className="inline-flex h-12 items-center justify-center rounded-full border border-gray-700 bg-black/50 px-8 text-sm font-medium text-white shadow-sm transition-colors hover:bg-black/80 hover:text-rose-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    Watch Demo
                  </Link>
                </motion.div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                className="relative"
              >
                <div className="relative mx-auto aspect-video overflow-hidden rounded-xl border border-gray-800 shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-purple-600/10" />
                  <Image
                    src="/api/placeholder/1920/1080"
                    width={1920}
                    height={1080}
                    alt="App Builder Interface"
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </div>
                <motion.div
                  initial={{ opacity: 0, x: 20, y: 20 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="absolute -bottom-6 -right-6 hidden md:block"
                >
                  <div className="relative h-48 w-24 overflow-hidden rounded-xl border border-gray-800 shadow-lg">
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-purple-600/10" />
                    <Image
                      src="/api/placeholder/480/960"
                      width={480}
                      height={960}
                      alt="Mobile Preview"
                      className="object-cover"
                    />
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20, y: 20 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ duration: 0.5, delay: 1 }}
                  className="absolute -bottom-10 -left-10 hidden md:block"
                >
                  <div className="relative h-40 w-20 overflow-hidden rounded-xl border border-gray-800 shadow-lg">
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-purple-600/10" />
                    <Image
                      src="/api/placeholder/480/960"
                      width={480}
                      height={960}
                      alt="Mobile Preview"
                      className="object-cover"
                    />
                  </div>
                </motion.div>

                {/* Floating elements */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                  className="absolute -top-8 left-1/4 hidden md:block"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-rose-500/20 to-purple-600/20 backdrop-blur-md">
                    <Code className="h-8 w-8 text-rose-400" />
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 3,
                    delay: 0.5,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                  className="absolute -right-8 top-1/3 hidden md:block"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-rose-500/20 to-purple-600/20 backdrop-blur-md">
                    <Smartphone className="h-8 w-8 text-purple-400" />
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
              }}
              className="flex flex-col items-center"
            >
              <span className="text-sm text-gray-400">Scroll to explore</span>
              <div className="mt-2 h-10 w-6 rounded-full border border-gray-700 p-1">
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "loop",
                  }}
                  className="h-2 w-2 rounded-full bg-rose-500"
                />
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Stats Section */}
        <section className="relative py-12 mx-10">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-2 gap-4 md:grid-cols-4"
            >
              {[
                {
                  value: "10k+",
                  label: "Users",
                  icon: <Users className="h-6 w-6 text-rose-400" />,
                },
                {
                  value: "500+",
                  label: "Apps Built",
                  icon: <Smartphone className="h-6 w-6 text-purple-400" />,
                },
                {
                  value: "99.9%",
                  label: "Uptime",
                  icon: <Clock className="h-6 w-6 text-rose-400" />,
                },
                {
                  value: "4.9/5",
                  label: "Rating",
                  icon: <Star className="h-6 w-6 text-purple-400" />,
                },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex flex-col items-center rounded-lg border border-gray-800 bg-black/30 p-4 backdrop-blur-sm"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-rose-500/20 to-purple-600/20">
                    {stat.icon}
                  </div>
                  <div className="mt-3 text-center">
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Video Demo Section */}
        <section id="demo" className="relative py-20 mx-10">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-block rounded-full bg-gradient-to-r from-rose-500/20 to-purple-600/20 px-4 py-1.5 text-sm font-medium text-rose-300"
              >
                See It In Action
              </motion.div>
              <motion.h2
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
              >
                Watch How{" "}
                <span className="bg-gradient-to-r from-rose-400 to-purple-500 bg-clip-text text-transparent">
                  Easy It Is
                </span>
              </motion.h2>
            </motion.div>

            <VideoDemo
              videoSrc="/api/placeholder/1920/1080"
              posterSrc="/api/placeholder/1920/1080"
              title="AppCraft Demo: Build Your First App in 5 Minutes"
            />
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          ref={featuresRef}
          className="relative py-20 md:py-32 mx-10"
        >
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center justify-center space-y-4 text-center"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-block rounded-full bg-gradient-to-r from-rose-500/20 to-purple-600/20 px-4 py-1.5 text-sm font-medium text-rose-300"
              >
                Key Features
              </motion.div>
              <motion.h2
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
              >
                Everything You Need to Build{" "}
                <span className="bg-gradient-to-r from-rose-400 to-purple-500 bg-clip-text text-transparent">
                  Amazing Apps
                </span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="max-w-[900px] text-gray-400 md:text-xl/relaxed"
              >
                Our premium platform gives you all the tools to create
                production-ready mobile apps without writing a single line of
                code.
              </motion.p>
            </motion.div>

            <div className="mx-auto grid max-w-5xl items-center gap-10 py-12 lg:grid-cols-3 lg:gap-16">
              {[
                {
                  icon: <Smartphone className="h-10 w-10 text-rose-400" />,
                  title: "Real-Time Preview",
                  description:
                    "See your changes instantly with our live preview feature on virtual devices.",
                  delay: 0.1,
                },
                {
                  icon: <Download className="h-10 w-10 text-purple-400" />,
                  title: "Local Downloads",
                  description:
                    "Download your app locally and test it on real devices with one click.",
                  delay: 0.3,
                },
                {
                  icon: <Zap className="h-10 w-10 text-rose-400" />,
                  title: "Rapid MVP Creation",
                  description:
                    "Build and launch your MVP in days instead of months with our streamlined workflow.",
                  delay: 0.5,
                },
                {
                  icon: <Code className="h-10 w-10 text-purple-400" />,
                  title: "Export Clean Code",
                  description:
                    "Export your app to React Native code that's maintainable and production-ready.",
                  delay: 0.6,
                },
                {
                  icon: <CheckCircle className="h-10 w-10 text-rose-400" />,
                  title: "Component Library",
                  description:
                    "Access 200+ pre-built UI components designed for mobile experiences.",
                  delay: 0.7,
                },
                {
                  icon: <Heart className="h-10 w-10 text-purple-400" />,
                  title: "AI Design Assistance",
                  description:
                    "Get smart design suggestions powered by our built-in AI assistant.",
                  delay: 0.8,
                },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: feature.delay }}
                  whileHover={{ y: -5 }}
                  className="group relative flex flex-col items-center space-y-4 rounded-2xl border border-gray-800 bg-gradient-to-b from-gray-900/50 to-black/50 p-8 text-center backdrop-blur-sm transition-all duration-300 hover:border-gray-700 hover:shadow-lg hover:shadow-rose-500/5"
                >
                  <div className="relative">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-rose-500/20 to-purple-600/20">
                      {feature.icon}
                    </div>
                    <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-rose-500/10 to-purple-600/10 blur-md opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Device Mockups Section */}
        <section className="relative py-20 mx-10">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center justify-center space-y-4 text-center mb-16"
            >
              <motion.h2
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-3xl font-bold tracking-tighter sm:text-4xl"
              >
                Beautiful Apps on{" "}
                <span className="bg-gradient-to-r from-rose-400 to-purple-500 bg-clip-text text-transparent">
                  Any Device
                </span>
              </motion.h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 items-center">
              <DeviceMockup
                image="/api/placeholder/540/960"
                alt="Social Media App"
                type="phone"
              />
              <DeviceMockup
                image="/api/placeholder/540/960"
                alt="E-commerce App"
                type="phone"
              />
              <DeviceMockup
                image="/api/placeholder/540/960"
                alt="Fitness Tracker App"
                type="phone"
              />
            </div>
          </div>
        </section>

        {/* Workflow Section */}
        <section
          id="workflow"
          ref={workflowRef}
          className="relative py-20 md:py-32 "
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/50 to-black" />
          <div className="container relative px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center justify-center space-y-4 text-center"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-block rounded-full bg-gradient-to-r from-rose-500/20 to-purple-600/20 px-4 py-1.5 text-sm font-medium text-rose-300"
              >
                How It Works
              </motion.div>
              <motion.h2
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
              >
                From Idea to App in{" "}
                <span className="bg-gradient-to-r from-rose-400 to-purple-500 bg-clip-text text-transparent">
                  Three Simple Steps
                </span>
              </motion.h2>
            </motion.div>

            <div className="relative mx-auto mt-16 max-w-5xl">
              {/* Connection line */}
              <div className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 bg-gradient-to-b from-rose-500/50 via-purple-600/50 to-rose-500/50 md:hidden" />
              <div className="absolute top-1/2 left-0 hidden h-1 w-full -translate-y-1/2 bg-gradient-to-r from-rose-500/50 via-purple-600/50 to-rose-500/50 md:block" />

              <div className="grid gap-16 md:grid-cols-3 md:gap-8">
                {[
                  {
                    number: "1",
                    title: "Design Your App",
                    description:
                      "Use our intuitive drag-and-drop interface to design your app's UI.",
                    image: "/api/placeholder/800/600",
                    delay: 0.1,
                  },
                  {
                    number: "2",
                    title: "Connect Your Data",
                    description:
                      "Integrate with APIs and databases without writing complex code.",
                    image: "/api/placeholder/800/600",
                    delay: 0.3,
                  },
                  {
                    number: "3",
                    title: "Publish & Share",
                    description:
                      "Download your app or publish directly to app stores with our guided process.",
                    image: "/api/placeholder/800/600",
                    delay: 0.5,
                  },
                ].map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: step.delay }}
                    className="relative flex flex-col items-center space-y-4 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0.8 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: step.delay + 0.2 }}
                      className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-purple-600 text-2xl font-bold"
                    >
                      {step.number}
                      <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-rose-500/30 to-purple-600/30 blur-md" />
                    </motion.div>

                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: step.delay + 0.3 }}
                      className="relative"
                    >
                      <div className="group overflow-hidden rounded-xl border border-gray-800 bg-black shadow-lg transition-all duration-300 hover:border-gray-700 hover:shadow-rose-500/10">
                        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-purple-600/10 opacity-50" />
                        <Image
                          src={step.image}
                          width={800}
                          height={600}
                          alt={step.title}
                          className="aspect-video object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-left">
                          <h3 className="text-xl font-bold">{step.title}</h3>
                          <p className="mt-2 text-gray-400">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Integration Logos Section */}
        <section className="relative py-16 mx-10">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
            >
              <motion.h2
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-2xl font-bold tracking-tighter sm:text-3xl"
              >
                Seamlessly Integrates With Your Favorite Tools
              </motion.h2>
            </motion.div>

            <IntegrationLogos
              logos={[
                { name: "Firebase", image: "/api/placeholder/160/80" },
                { name: "Stripe", image: "/api/placeholder/160/80" },
                { name: "AWS", image: "/api/placeholder/160/80" },
                { name: "MongoDB", image: "/api/placeholder/160/80" },
                { name: "Supabase", image: "/api/placeholder/160/80" },
                { name: "Auth0", image: "/api/placeholder/160/80" },
              ]}
            />
          </div>
        </section>

        {/* Showcase Section */}
        <section
          id="showcase"
          ref={showcaseRef}
          className="relative py-20 md:py-32 mx-10"
        >
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="inline-block rounded-full bg-gradient-to-r from-rose-500/20 to-purple-600/20 px-4 py-1.5 text-sm font-medium text-rose-300"
                >
                  Success Stories
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
                >
                  Apps Built With{" "}
                  <span className="bg-gradient-to-r from-rose-400 to-purple-500 bg-clip-text text-transparent">
                    AppCraft
                  </span>
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="max-w-[600px] text-gray-400 md:text-xl/relaxed"
                >
                  From startups to enterprises, our customers have built
                  incredible apps that are now used by millions. See how they
                  did it with AppCraft's no-code platform.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <Link
                    href="#case-studies"
                    className="rounded-full bg-gradient-to-r from-rose-500 to-purple-600 px-8 py-3 text-sm font-medium text-white transition-transform hover:scale-105 flex items-center justify-center"
                  >
                    View Case Studies
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="grid grid-cols-2 gap-4"
              >
                {[
                  {
                    name: "FitLife",
                    image: "/api/placeholder/540/960",
                    category: "Health & Fitness",
                  },
                  {
                    name: "ShopEase",
                    image: "/api/placeholder/540/960",
                    category: "E-commerce",
                  },
                  {
                    name: "MindfulMe",
                    image: "/api/placeholder/540/960",
                    category: "Wellness",
                  },
                  {
                    name: "TaskMaster",
                    image: "/api/placeholder/540/960",
                    category: "Productivity",
                  },
                ].map((app, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                    className="group relative overflow-hidden rounded-xl border border-gray-800 bg-black"
                  >
                    <div className="aspect-[9/16] overflow-hidden">
                      <Image
                        src={app.image}
                        width={540}
                        height={960}
                        alt={app.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <div className="text-lg font-bold">{app.name}</div>
                      <div className="text-sm text-rose-300">
                        {app.category}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section
          id="testimonials"
          ref={testimonialsRef}
          className="relative py-20 md:py-32 "
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/50 to-black" />
          <div className="container relative px-4 md:px-6 ">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center justify-center space-y-4 text-center mb-16"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-block rounded-full bg-gradient-to-r from-rose-500/20 to-purple-600/20 px-4 py-1.5 text-sm font-medium text-rose-300"
              >
                Testimonials
              </motion.div>
              <motion.h2
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
              >
                What Our Users{" "}
                <span className="bg-gradient-to-r from-rose-400 to-purple-500 bg-clip-text text-transparent">
                  Are Saying
                </span>
              </motion.h2>
            </motion.div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  name: "Alex Johnson",
                  role: "Startup Founder",
                  image: "/api/placeholder/100/100",
                  quote:
                    "AppCraft saved us months of development time. We launched our MVP in just 2 weeks and secured our first round of funding!",
                  delay: 0.1,
                },
                {
                  name: "Sarah Chen",
                  role: "Product Manager",
                  image: "/api/placeholder/100/100",
                  quote:
                    "I'm not a coder, but I was able to build our company's internal tool in days. The customer support is also incredible.",
                  delay: 0.2,
                },
                {
                  name: "Michael Rodriguez",
                  role: "React Developer",
                  image: "/api/placeholder/100/100",
                  quote:
                    "Even as a developer, I use AppCraft for rapid prototyping. The code export feature is clean and well-structured.",
                  delay: 0.3,
                },
                {
                  name: "Emily Watson",
                  role: "Digital Marketer",
                  image: "/api/placeholder/100/100",
                  quote:
                    "We've built three different apps for our marketing campaigns. Each one took less than a week from concept to deployment.",
                  delay: 0.4,
                },
                {
                  name: "David Park",
                  role: "CTO",
                  image: "/api/placeholder/100/100",
                  quote:
                    "AppCraft is now our go-to solution for client projects. We deliver apps 70% faster while maintaining high quality.",
                  delay: 0.5,
                },
                {
                  name: "Sophia Williams",
                  role: "UI/UX Designer",
                  image: "/api/placeholder/100/100",
                  quote:
                    "The component library is extensive and customizable. As a designer, I appreciate how faithfully my designs are translated.",
                  delay: 0.6,
                },
              ].map((testimonial, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: testimonial.delay }}
                  className="group relative rounded-2xl border border-gray-800 bg-gradient-to-b from-gray-900/50 to-black/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-gray-700 hover:shadow-lg hover:shadow-rose-500/5"
                >
                  <div className="mb-4 flex items-center gap-4">
                    <div className="relative h-12 w-12 overflow-hidden rounded-full">
                      <Image
                        src={testimonial.image}
                        width={100}
                        height={100}
                        alt={testimonial.name}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium">{testimonial.name}</div>
                      <div className="text-sm text-gray-400">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <MessageSquare className="absolute -left-1 -top-1 h-6 w-6 text-rose-500/20" />
                    <p className="pl-4 text-gray-300">{testimonial.quote}</p>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <div className="flex">
                      {Array(5)
                        .fill(null)
                        .map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 fill-rose-500 text-rose-500"
                          />
                        ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section
          id="pricing"
          ref={pricingRef}
          className="relative py-20 md:py-32 mx-10"
        >
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center justify-center space-y-4 text-center mb-16"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-block rounded-full bg-gradient-to-r from-rose-500/20 to-purple-600/20 px-4 py-1.5 text-sm font-medium text-rose-300"
              >
                Pricing Plans
              </motion.div>
              <motion.h2
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
              >
                Choose the Perfect{" "}
                <span className="bg-gradient-to-r from-rose-400 to-purple-500 bg-clip-text text-transparent">
                  Plan for You
                </span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="max-w-[800px] text-gray-400 md:text-xl/relaxed"
              >
                Start with our free plan or upgrade to unlock premium features.
                All plans include our core app building capabilities.
              </motion.p>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  name: "Starter",
                  price: "Free",
                  description: "Perfect for beginners and hobbyists",
                  features: [
                    "1 app project",
                    "Basic components",
                    "Preview on devices",
                    "Community support",
                    "Export to APK",
                  ],
                  cta: "Get Started",
                  highlighted: false,
                  delay: 0.1,
                },
                {
                  name: "Pro",
                  price: "$29",
                  period: "/month",
                  description: "For professional developers and teams",
                  features: [
                    "10 app projects",
                    "All premium components",
                    "Push notifications",
                    "API integrations",
                    "Priority support",
                    "Export to APK & IPA",
                    "White-labeling",
                  ],
                  cta: "Get Pro",
                  highlighted: true,
                  delay: 0.2,
                },
                {
                  name: "Enterprise",
                  price: "Custom",
                  description: "For large teams and organizations",
                  features: [
                    "Unlimited app projects",
                    "All premium components",
                    "Push notifications",
                    "API integrations",
                    "Dedicated support",
                    "Export to all formats",
                    "White-labeling",
                    "Custom branding",
                    "Team collaboration",
                    "Advanced security",
                  ],
                  cta: "Contact Sales",
                  highlighted: false,
                  delay: 0.3,
                },
              ].map((plan, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: plan.delay }}
                  className={`relative flex flex-col rounded-2xl ${
                    plan.highlighted
                      ? "border-2 border-rose-500 bg-gradient-to-b from-rose-500/10 to-purple-600/10"
                      : "border border-gray-800 bg-gradient-to-b from-gray-900/50 to-black/50"
                  } p-8 backdrop-blur-sm transition-all duration-300 hover:shadow-lg ${
                    plan.highlighted
                      ? "hover:shadow-rose-500/20"
                      : "hover:shadow-rose-500/5"
                  }`}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 px-4 py-1 text-xs font-medium">
                      Most Popular
                    </div>
                  )}
                  <div className="mb-6 text-center">
                    <h3 className="text-2xl font-bold">{plan.name}</h3>
                    <div className="mt-2 flex items-baseline justify-center">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      {plan.period && (
                        <span className="text-gray-400">{plan.period}</span>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-gray-400">
                      {plan.description}
                    </p>
                  </div>
                  <ul className="mb-8 flex-1 space-y-3">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-rose-400" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full rounded-full ${
                      plan.highlighted
                        ? "bg-gradient-to-r from-rose-500 to-purple-600 hover:opacity-90"
                        : "border border-gray-700 bg-black/50 hover:bg-black/80 hover:text-rose-400"
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" ref={faqRef} className="relative py-20 md:py-32">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/50 to-black" />
          <div className="container relative px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center justify-center space-y-4 text-center mb-16"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-block rounded-full bg-gradient-to-r from-rose-500/20 to-purple-600/20 px-4 py-1.5 text-sm font-medium text-rose-300"
              >
                FAQ
              </motion.div>
              <motion.h2
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
              >
                Frequently Asked{" "}
                <span className="bg-gradient-to-r from-rose-400 to-purple-500 bg-clip-text text-transparent">
                  Questions
                </span>
              </motion.h2>
            </motion.div>

            <div className="mx-auto max-w-3xl space-y-6">
              {[
                {
                  question: "Do I need coding experience to use AppCraft?",
                  answer:
                    "Not at all! AppCraft is designed for users of all technical backgrounds. Our drag-and-drop interface and intuitive tools make it easy for anyone to build mobile apps without writing a single line of code.",
                  delay: 0.1,
                },
                {
                  question:
                    "Can I publish apps to the App Store and Google Play?",
                  answer:
                    "Yes! AppCraft generates high-quality native code that meets the requirements for both the App Store and Google Play. We also provide step-by-step guides to help you through the submission process.",
                  delay: 0.2,
                },
                {
                  question: "How does the app export process work?",
                  answer:
                    "With a simple click, you can export your app as a ready-to-install APK (Android) or IPA (iOS) file. For Pro and Enterprise users, we also provide the full source code in React Native format, which you can further customize or have your developers extend.",
                  delay: 0.3,
                },
                {
                  question: "Is there a limit to how complex my app can be?",
                  answer:
                    "AppCraft supports a wide range of app complexities. From simple informational apps to sophisticated platforms with user authentication, database integrations, and real-time features, our platform scales with your needs.",
                  delay: 0.4,
                },
                {
                  question: "Can I integrate with external APIs and services?",
                  answer:
                    "Absolutely! AppCraft provides a visual interface for connecting to REST APIs, GraphQL endpoints, and popular services like Firebase, Stripe, and AWS. No coding required for standard integrations.",
                  delay: 0.5,
                },
                {
                  question: "What kind of support is available if I get stuck?",
                  answer:
                    "Free users have access to our community forum and documentation. Pro users receive priority email support with 24-hour response times. Enterprise customers enjoy dedicated support channels with phone assistance and personalized onboarding.",
                  delay: 0.6,
                },
              ].map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: faq.delay }}
                  className="rounded-xl border border-gray-800 bg-gradient-to-b from-gray-900/50 to-black/50 backdrop-blur-sm"
                >
                  <details className="group p-6 [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex cursor-pointer items-center justify-between gap-1.5">
                      <h3 className="font-medium">{faq.question}</h3>
                      <div className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-700 bg-black/50 text-gray-400 group-open:bg-rose-500/20 group-open:text-rose-400">
                        <svg
                          className="h-4 w-4 transition group-open:rotate-45"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </div>
                    </summary>
                    <p className="mt-4 text-gray-400">{faq.answer}</p>
                  </details>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-20">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative overflow-hidden rounded-3xl border border-gray-800"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-rose-500/20 via-purple-600/20 to-blue-700/20 opacity-80" />
              <div className="relative grid gap-8 p-8 md:grid-cols-2 md:p-12 lg:p-16">
                <div className="flex flex-col justify-center space-y-4">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Ready to Build Your{" "}
                    <span className="bg-gradient-to-r from-rose-400 to-purple-500 bg-clip-text text-transparent">
                      Dream App?
                    </span>
                  </h2>
                  <p className="text-gray-300 md:text-xl/relaxed">
                    Start creating beautiful, functional mobile apps today. No
                    coding required, no limitations.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Link
                      href="#pricing"
                      className="inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-purple-600 px-8 text-sm font-medium text-white shadow-lg shadow-rose-500/30 transition-transform hover:scale-105"
                    >
                      Get Started For Free
                    </Link>
                    <Link
                      href="#demo"
                      className="inline-flex h-12 items-center justify-center rounded-full border border-gray-700 bg-black/50 px-8 text-sm font-medium text-white shadow-sm transition-colors hover:bg-black/80 hover:text-rose-400"
                    >
                      Watch Demo
                    </Link>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="relative h-64 w-32 overflow-hidden rounded-xl border border-gray-800 shadow-lg md:h-80 md:w-40">
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-purple-600/10" />
                    <Image
                      src="/api/placeholder/480/960"
                      width={480}
                      height={960}
                      alt="Mobile App Preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <footer className="relative z-10 border-t border-gray-800 bg-black py-12 text-gray-400">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-6 w-6 text-rose-500" />
                <span className="text-xl font-bold text-white">AppCraft</span>
              </div>
              <p className="max-w-xs">Build beautiful mobile apps without code. From idea to app store in days.</p>
              <div className="flex space-x-4">
                {["twitter", "facebook", "instagram", "github"].map((social) => (
                  <Link key={social} href={`#${social}`} className="hover:text-rose-400">
                    <span className="sr-only">{social}</span>
                    <div className="h-6 w-6 rounded-full bg-gray-800 p-1" />
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Product</h3>
              <ul className="space-y-2">
                {["Features", "Pricing", "Showcase", "Roadmap", "Updates"].map((item) => (
                  <li key={item}>
                    <Link href={`#${item.toLowerCase()}`} className="hover:text-rose-400">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Resources</h3>
              <ul className="space-y-2">
                {["Documentation", "Tutorials", "Blog", "Community", "Support"].map((item) => (
                  <li key={item}>
                    <Link href={`#${item.toLowerCase()}`} className="hover:text-rose-400">

                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Company</h3>
              <ul className="space-y-2">
                {["About Us", "Careers", "Privacy Policy", "Terms of Service"].map((item) => (
                  <li key={item}>
                    <Link href={`#${item.toLowerCase()}`} className="hover:text-rose-400">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-800 pt-6 text-center">
            <p className="text-sm text-gray-500">© 2023 AppCraft. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  

 


)}
