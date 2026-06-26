import Link from "next/link";
import {
  ShoppingBag,
  Users,
  Rocket,
  Home as HomeIcon,
  MessageCircle,
  User,
  Zap,
  Smartphone,
  TrendingUp,
  Star,
  CheckCircle,
  Award,
  BarChart,
  Shield,
  Headphones,
  ArrowRight,
  Play,
  Gift,
  Heart,
  Clock,
  Globe,
} from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-green-50 to-green-100 py-20">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="grid lg:grid-cols-3 gap-8 items-center">
            {/* Left Panel - Text Content */}
            <div className="lg:col-span-2">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full mb-6">
                <Rocket className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium">
                  For WhatsApp Vendors
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-800 mb-6 leading-tight">
                Turn Your WhatsApp{" "}
                <span className="text-green-500">Into a Storefront</span>
              </h1>

              {/* Description */}
              <p className="text-lg text-gray-600 mb-8 max-w-xl">
                Create a beautiful online store for your products and let
                customers order directly through WhatsApp. No technical skills
                required.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 mb-8">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-md transition-colors"
                >
                  <HomeIcon className="h-5 w-5" />
                  Create My Store
                </Link>
                <Link
                  href="/explore"
                  className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-300 bg-white hover:bg-gray-50 text-green-500 font-medium rounded-md transition-colors"
                >
                  <MessageCircle className="h-5 w-5 text-green-500" />
                  See Demo
                </Link>
              </div>

              {/* Feature Highlights */}
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2 text-gray-700">
                  <User className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">1000+ Vendors</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Zap className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">Setup in 5 min</span>
                </div>
              </div>
            </div>

            {/* Right Panel - Image */}
            <div className="lg:col-span-1">
              <div className="relative w-full h-[500px] rounded-2xl overflow-hidden bg-gradient-to-br from-green-200 to-green-300">
                {/* Placeholder for image - you can replace this with an actual image */}
                <Image
                  src="/images/hero-illustration.png"
                  alt="Vendorly Storefront Example"
                  fill
                  className="object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== NEW SECTION: Social Proof / Trust Bar ====== */}
      <section className="bg-white border-y border-gray-100 py-8">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            <div className="flex items-center gap-3">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-700">
                4.9/5 from multiple reviews
              </span>
            </div>
            <div className="h-8 w-px bg-gray-200" />
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-green-500" />
              <span className="text-sm font-medium text-gray-700">
                Multiple stores created
              </span>
            </div>
            <div className="h-8 w-px bg-gray-200" />
            <div className="flex items-center gap-3">
              <Globe className="h-6 w-6 text-green-500" />
              <span className="text-sm font-medium text-gray-700">
                Made for Nigerian Business Owners
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-semibold text-green-500 uppercase tracking-wider mb-2">
              Get Started in Minutes
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
              How Vendorly Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three simple steps to launch your online store and start selling
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Step connectors (desktop) */}
            <div className="hidden md:block absolute top-24 left-0 right-0 h-0.5 bg-green-200" />
            <div className="hidden md:block absolute top-24 left-1/3 right-1/3 h-0.5 bg-green-200" />

            {[
              {
                step: "01",
                icon: <User className="h-10 w-10 text-white" />,
                title: "Create Your Account",
                desc: "Sign up in seconds with just your email. No credit card required.",
                bg: "bg-green-500",
              },
              {
                step: "02",
                icon: <ShoppingBag className="h-10 w-10 text-white" />,
                title: "Add Your Products",
                desc: "Upload product images, set prices, and write descriptions.",
                bg: "bg-green-400",
              },
              {
                step: "03",
                icon: <MessageCircle className="h-10 w-10 text-white" />,
                title: "Start Selling",
                desc: "Share your store link and receive orders via WhatsApp instantly.",
                bg: "bg-green-600",
              },
            ].map((item, index) => (
              <div key={index} className="relative text-center">
                <div
                  className={`${item.bg} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg relative z-10`}
                >
                  {item.icon}
                </div>
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-7xl font-bold text-green-100/50 select-none">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 max-w-xs mx-auto">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-md transition-colors"
            >
              Start Your Free Store
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ====== NEW SECTION: What Vendorly Does For You ====== */}
      <section className="bg-white py-20">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-semibold text-green-500 uppercase tracking-wider mb-2">
              Current Features
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
              What Vendorly Offers Today
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to turn your WhatsApp business into a
              professional storefront
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column - Interactive Features */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100">
                <div className="flex items-start gap-4">
                  <div className="bg-green-500 rounded-xl p-3 flex-shrink-0">
                    <Smartphone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      Instant Store Creation
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Create your professional store in under 5 minutes. No
                      coding or design skills required. Just add your products
                      and start selling.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-500 rounded-xl p-3 flex-shrink-0">
                    <MessageCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      WhatsApp Order Automation
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Every product has a "Order via WhatsApp" button. Customers
                      click, message is pre-filled, and you receive orders
                      instantly.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-100">
                <div className="flex items-start gap-4">
                  <div className="bg-purple-500 rounded-xl p-3 flex-shrink-0">
                    <ShoppingBag className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      Product Management
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Upload unlimited products with images, prices,
                      descriptions, and categories. Update your inventory
                      anytime from your dashboard.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Business Tools */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-8 border border-orange-100">
                <div className="flex items-start gap-4">
                  <div className="bg-orange-500 rounded-xl p-3 flex-shrink-0">
                    <BarChart className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      Sales Analytics
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Track your sales performance, popular products, and
                      customer behavior. Make data-driven decisions to grow your
                      business.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-8 border border-teal-100">
                <div className="flex items-start gap-4">
                  <div className="bg-teal-500 rounded-xl p-3 flex-shrink-0">
                    <Globe className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      Custom Store URL
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Get your own vendorly.com/yourstore link. Share it on
                      social media, WhatsApp status, or anywhere you want
                      customers to find you.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-rose-50 to-red-50 rounded-2xl p-8 border border-rose-100">
                <div className="flex items-start gap-4">
                  <div className="bg-rose-500 rounded-xl p-3 flex-shrink-0">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      Vendor Community
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Join our active WhatsApp community of 500+ vendors. Share
                      tips, ask questions, and grow together with fellow
                      entrepreneurs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== NEW SECTION: Platform Benefits ====== */}
      <section className="bg-gradient-to-br from-green-600 to-emerald-700 py-16">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Rocket className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Launch in Minutes
              </h3>
              <p className="text-white/80 text-sm">
                No technical skills needed. Sign up, add products, and share
                your store link with customers immediately.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Secure & Reliable
              </h3>
              <p className="text-white/80 text-sm">
                Your data is protected with enterprise-grade security. Focus on
                selling while we handle the tech.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Proven Growth
              </h3>
              <p className="text-white/80 text-sm">
                Join thousands of vendors who have increased their sales by
                creating a professional storefront.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ====== SECTION: Live Store Preview ====== */}
      <section className="bg-white py-20 overflow-hidden">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <div>
              <span className="inline-block text-sm font-semibold text-green-500 uppercase tracking-wider mb-2">
                Your Store, Your Brand
              </span>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
                A Beautiful Store Your Customers Will Love
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Your products, displayed professionally. Customers browse, tap,
                and order — all without leaving WhatsApp.
              </p>
              <ul className="space-y-3">
                {[
                  "Clean, mobile-optimised storefront",
                  "Products with images, prices & descriptions",
                  "One-tap WhatsApp ordering button",
                  "Your own shareable store link",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-md transition-colors"
              >
                Create My Store
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>

            {/* Right: Phone Mockup */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                {/* Background blob */}
                <div className="absolute inset-0 -m-8 bg-gradient-to-br from-green-100 to-green-50 rounded-3xl" />

                {/* Phone frame */}
                <div className="relative w-72 bg-gray-900 rounded-[3rem] p-3 shadow-2xl ring-1 ring-gray-800">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-gray-900 rounded-b-2xl z-10" />

                  {/* Screen */}
                  <div className="bg-gray-50 rounded-[2.5rem] overflow-hidden h-[580px] flex flex-col">
                    {/* Status bar */}
                    <div className="bg-white flex items-center justify-between px-5 pt-8 pb-2">
                      <span className="text-xs font-semibold text-gray-800">
                        9:41
                      </span>
                      <div className="flex items-center gap-1">
                        <div className="flex gap-0.5 items-end h-3">
                          {[2, 3, 4, 4].map((h, i) => (
                            <div
                              key={i}
                              className="w-1 bg-gray-800 rounded-sm"
                              style={{ height: `${h * 3}px` }}
                            />
                          ))}
                        </div>
                        <svg
                          className="h-3 w-4 text-gray-800 ml-1"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
                        </svg>
                      </div>
                    </div>

                    {/* Store Header */}
                    <div className="bg-green-500 px-4 py-4 flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-lg">
                        👗
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-sm">
                          Chioma's Fashion
                        </h3>
                        <p className="text-green-100 text-xs">
                          Lagos, Nigeria • 127 products
                        </p>
                      </div>
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                        <svg
                          className="h-4 w-4 text-white"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <circle cx="11" cy="11" r="8" />
                          <path d="m21 21-4.35-4.35" />
                        </svg>
                      </div>
                    </div>

                    {/* Category pills */}
                    <div className="bg-white px-3 py-2 flex gap-2 overflow-hidden border-b border-gray-100">
                      {["All", "Dresses", "Tops", "Bags"].map((cat, i) => (
                        <span
                          key={cat}
                          className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                            i === 0
                              ? "bg-green-500 text-white"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {cat}
                        </span>
                      ))}
                    </div>

                    {/* Product Grid */}
                    <div className="flex-1 overflow-hidden p-3 grid grid-cols-2 gap-3 content-start">
                      {[
                        {
                          emoji: "👗",
                          name: "Ankara Dress",
                          price: "₦14,000",
                          badge: "New",
                        },
                        {
                          emoji: "👜",
                          name: "Leather Bag",
                          price: "₦8,500",
                          badge: "Hot",
                        },
                        {
                          emoji: "👚",
                          name: "Lace Blouse",
                          price: "₦6,200",
                          badge: null,
                        },
                        {
                          emoji: "🧣",
                          name: "Silk Scarf",
                          price: "₦3,800",
                          badge: "Sale",
                        },
                      ].map((product, i) => (
                        <div
                          key={i}
                          className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm"
                        >
                          <div className="bg-gradient-to-br from-green-50 to-green-100 h-24 flex items-center justify-center relative">
                            <span className="text-4xl">{product.emoji}</span>
                            {product.badge && (
                              <span
                                className={`absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                                  product.badge === "Sale"
                                    ? "bg-red-500 text-white"
                                    : product.badge === "Hot"
                                      ? "bg-orange-500 text-white"
                                      : "bg-green-500 text-white"
                                }`}
                              >
                                {product.badge}
                              </span>
                            )}
                          </div>
                          <div className="p-2">
                            <p className="text-xs font-semibold text-gray-800 truncate">
                              {product.name}
                            </p>
                            <p className="text-xs font-bold text-green-600">
                              {product.price}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* WhatsApp CTA */}
                    <div className="bg-white px-3 pb-4 pt-2 border-t border-gray-100">
                      <div className="bg-green-500 rounded-xl py-3 flex items-center justify-center gap-2 shadow-sm">
                        <svg
                          className="h-4 w-4 text-white"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                          <path d="M12 2C6.48 2 2 6.48 2 12c0 1.76.46 3.41 1.26 4.84L2 22l5.3-1.24A9.95 9.95 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" />
                        </svg>
                        <span className="text-white text-sm font-bold">
                          Order via WhatsApp
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating order notification */}
                <div
                  className="absolute -right-4 top-16 bg-white rounded-2xl shadow-xl p-3 w-48 border border-gray-100 animate-bounce"
                  style={{ animationDuration: "3s" }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-bold text-gray-800">
                      New Order! 🎉
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Ankara Dress × 2 — ₦28,000
                  </p>
                </div>

                {/* Floating store URL pill */}
                <div className="absolute -left-6 bottom-20 bg-white rounded-xl shadow-lg px-3 py-2 border border-gray-100 flex items-center gap-2">
                  <Globe className="h-3.5 w-3.5 text-green-500" />
                  <span className="text-xs font-medium text-gray-700">
                    vendorly.com/chioma
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== NEW SECTION: FAQ / Questions ====== */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-semibold text-green-500 uppercase tracking-wider mb-2">
              Got Questions?
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to know before getting started
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
            {[
              {
                q: "Do I need technical skills?",
                a: "Not at all! Vendorly is designed for everyone. Just sign up and start adding your products.",
              },
              {
                q: "How much does it cost?",
                a: "We offer a free plan to get started, with affordable premium plans for growing businesses.",
              },
              {
                q: "Can I use my own domain?",
                a: "Yes! Upgrade to our business plan to connect your custom domain.",
              },
              {
                q: "How do I receive orders?",
                a: "Customers order directly through WhatsApp. You get notified instantly.",
              },
              {
                q: "Is there customer support?",
                a: "Yes! We provide 24/7 support via email, chat, and our community.",
              },
              {
                q: "Can I sell digital products?",
                a: "Absolutely! Vendorly supports both physical and digital products.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
              >
                <h4 className="font-bold text-gray-800 mb-2">{faq.q}</h4>
                <p className="text-gray-600 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== NEW SECTION: Quick Start Guide ====== */}
      <section className="bg-white py-20">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block text-sm font-semibold text-green-500 uppercase tracking-wider mb-2">
                Ready in Minutes
              </span>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
                Start Selling Today
              </h2>
              <p className="text-lg text-gray-600">
                No credit card required. No commitment. Start your free store
                now.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 text-green-600 font-bold text-lg">
                  1
                </div>
                <h3 className="font-bold text-gray-800 mb-1">Sign Up</h3>
                <p className="text-sm text-gray-500">
                  Create your account in seconds
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 text-green-600 font-bold text-lg">
                  2
                </div>
                <h3 className="font-bold text-gray-800 mb-1">Add Products</h3>
                <p className="text-sm text-gray-500">
                  Upload your items with prices
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 text-green-600 font-bold text-lg">
                  3
                </div>
                <h3 className="font-bold text-gray-800 mb-1">Share & Sell</h3>
                <p className="text-sm text-gray-500">
                  Share your store link everywhere
                </p>
              </div>
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-medium rounded-md transition-colors text-lg"
              >
                Create Your Free Store
                <ArrowRight className="h-5 w-5" />
              </Link>
              <p className="mt-3 text-sm text-gray-400">
                ✦ Free forever plan available ✦ No credit card needed ✦
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          {/* Hero Heading */}
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
              Everything You Need to Sell Online
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple, powerful tools designed specifically for WhatsApp vendors.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Row 1, Column 1: Mobile-First Design */}
            <div className="bg-white rounded-lg p-6 text-center border border-gray-100 shadow-sm">
              <div className="flex justify-center mb-4">
                <Smartphone className="h-12 w-12 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Mobile-First Design
              </h3>
              <p className="text-gray-600">
                Beautiful storefronts that work perfectly on all devices,
                especially mobile where your customers shop.
              </p>
            </div>

            {/* Row 1, Column 2: WhatsApp Integration */}
            <div className="bg-white rounded-lg p-6 text-center border border-gray-100 shadow-sm">
              <div className="flex justify-center mb-4">
                <MessageCircle className="h-12 w-12 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                WhatsApp Integration
              </h3>
              <p className="text-gray-600">
                Direct WhatsApp ordering with pre-filled messages. Customers can
                order with one tap.
              </p>
            </div>

            {/* Row 1, Column 3: Easy Product Management */}
            <div className="bg-white rounded-lg p-6 text-center border border-gray-100 shadow-sm">
              <div className="flex justify-center mb-4">
                <ShoppingBag className="h-12 w-12 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Easy Product Management
              </h3>
              <p className="text-gray-600">
                Add, edit, and manage your products with an intuitive dashboard.
                No technical skills needed.
              </p>
            </div>

            {/* Row 2, Column 1: Grow Your Business */}
            <div className="bg-white rounded-lg p-6 text-center border border-gray-100 shadow-sm">
              <div className="flex justify-center mb-4">
                <TrendingUp className="h-12 w-12 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Grow Your Business
              </h3>
              <p className="text-gray-600">
                Professional storefronts help build trust and increase sales.
                Track your progress with analytics.
              </p>
            </div>

            {/* Row 2, Column 2: Quick Setup */}
            <div className="bg-white rounded-lg p-6 text-center border border-gray-100 shadow-sm">
              <div className="flex justify-center mb-4">
                <Zap className="h-12 w-12 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Quick Setup
              </h3>
              <p className="text-gray-600">
                Get your store online in minutes, not days. Start selling
                immediately with our simple tools.
              </p>
            </div>

            {/* Row 2, Column 3: Customer Management */}
            <div className="bg-white rounded-lg p-6 text-center border border-gray-100 shadow-sm">
              <div className="flex justify-center mb-4">
                <Users className="h-12 w-12 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Customer Management
              </h3>
              <p className="text-gray-600">
                Keep track of your customers and their orders. Build lasting
                relationships that drive repeat sales.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA + Community Section (Existing) */}
      <section className="bg-gray-100 py-20">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          {/* Community Card */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-700 via-green-600 to-green-400 px-8 py-16 sm:px-16 text-center mb-6">
            {/* Decorative blobs */}
            <div className="pointer-events-none absolute -top-10 -right-10 h-72 w-72 rounded-full bg-green-200 opacity-20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-6 h-52 w-52 rounded-full bg-green-300 opacity-20 blur-3xl" />

            {/* Floating WhatsApp icons */}
            <svg
              className="pointer-events-none absolute right-12 top-6 h-20 w-20 animate-bounce opacity-10"
              style={{ animationDuration: "6s" }}
              viewBox="0 0 24 24"
              fill="white"
              aria-hidden="true"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 2C6.48 2 2 6.48 2 12c0 1.76.46 3.41 1.26 4.84L2 22l5.3-1.24A9.95 9.95 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" />
            </svg>
            <svg
              className="pointer-events-none absolute bottom-10 left-14 h-14 w-14 animate-bounce opacity-10"
              style={{ animationDuration: "8s", animationDelay: "1.5s" }}
              viewBox="0 0 24 24"
              fill="white"
              aria-hidden="true"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 2C6.48 2 2 6.48 2 12c0 1.76.46 3.41 1.26 4.84L2 22l5.3-1.24A9.95 9.95 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" />
            </svg>

            <div className="relative z-10">
              {/* Badge */}
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-1.5 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                </span>
                <span className="text-xs font-semibold uppercase tracking-widest text-white">
                  Vendor Community
                </span>
              </div>

              <h2 className="mb-4 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
                Don't Build Your Business Alone
              </h2>

              <p className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
                Join Nigeria's growing community of WhatsApp vendors. Learn
                proven sales strategies, get marketing tips, share experiences,
                and connect with entrepreneurs building successful online
                businesses.
              </p>

              {/* Benefits Grid */}
              <div className="mx-auto mb-10 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  {
                    icon: <Zap className="h-4 w-4" />,
                    text: "Weekly business growth tips",
                  },
                  {
                    icon: <Users className="h-4 w-4" />,
                    text: "Vendor networking opportunities",
                  },
                  {
                    icon: <Rocket className="h-4 w-4" />,
                    text: "Early access to Vendorly updates",
                  },
                  {
                    icon: <TrendingUp className="h-4 w-4" />,
                    text: "Marketing and sales resources",
                  },
                ].map(({ icon, text }) => (
                  <div
                    key={text}
                    className="flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-left backdrop-blur-sm transition hover:bg-white/20"
                  >
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white/20 text-white">
                      {icon}
                    </div>
                    <span className="text-sm font-medium text-white">
                      {text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Social Proof */}
              <div className="mb-7 flex items-center justify-center gap-3">
                <div className="flex">
                  {[
                    { initials: "AO", bg: "#0f5132" },
                    { initials: "TK", bg: "#1e3a5f" },
                    { initials: "BN", bg: "#7c2d12" },
                    { initials: "CF", bg: "#4c1d95" },
                    { initials: "MA", bg: "#1f2937" },
                  ].map(({ initials, bg }, i) => (
                    <div
                      key={initials}
                      className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white/50 text-xs font-bold text-white"
                      style={{
                        marginLeft: i === 0 ? 0 : "-10px",
                        background: bg,
                        zIndex: i,
                      }}
                    >
                      {initials}
                    </div>
                  ))}
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white/50 bg-white/25 text-xs font-bold text-white"
                    style={{ marginLeft: "-10px" }}
                  >
                    +495
                  </div>
                </div>
                <p className="text-sm font-medium text-white/90">
                  <span className="font-bold text-white">500+ vendors</span>{" "}
                  already inside
                </p>
              </div>

              {/* Community CTA */}
              <a
                href="https://chat.whatsapp.com/D26RTk1dlm6EZO2gDxQdGP"
                target="_blank"
                rel="noopener noreferrer"
                className="mb-4 inline-flex items-center gap-2.5 rounded-2xl bg-white px-8 py-4 text-base font-bold text-green-700 shadow-xl transition hover:scale-105 hover:bg-green-50 hover:text-green-800 active:scale-95"
              >
                <MessageCircle className="h-5 w-5 text-green-500" />
                Join WhatsApp Community
                <span className="text-lg">→</span>
              </a>

              <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-white/60">
                <span>✓ Free to join</span>
                <span className="h-1 w-1 rounded-full bg-white/30" />
                <span>✓ No spam</span>
                <span className="h-1 w-1 rounded-full bg-white/30" />
                <span>✓ Leave anytime</span>
              </div>
            </div>
          </div>

          {/* Store CTA — sits below as a quieter secondary action */}
          <div className="rounded-2xl bg-white border border-gray-200 px-8 py-10 text-center shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Ready to Start Selling?
            </h2>
            <p className="text-gray-500 mb-6">
              Join thousands of vendors already growing their business with
              Vendorly.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-md transition-colors"
            >
              <HomeIcon className="h-5 w-5" />
              Create Free Store
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="text-center">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 mb-4"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15"
                  stroke="#22c55e"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="#22c55e"
                />
              </svg>
              <span className="text-lg font-bold text-gray-800">Vendorly</span>
            </Link>
            <p className="text-sm text-gray-600">
              Empowering WhatsApp vendors to grow their business online
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
