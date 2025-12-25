"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  Cloud,
  Terminal,
  ChevronRight,
  Zap,
} from "lucide-react";
import Link from "next/link";

const services = [
  {
    title: "Cloud Security",
    description:
      "Protecting your cloud infrastructure with advanced monitoring and threat detection.",
    icon: <Cloud className="w-10 h-10 text-blue-400" />,
  },
  {
    title: "Red Teaming",
    description:
      "Simulated cyber attacks to test your defense capabilities and response protocols.",
    icon: <Terminal className="w-10 h-10 text-purple-400" />,
  },
  {
    title: "VAPT Services",
    description:
      "Comprehensive Vulnerability Assessment and Penetration Testing for applications.",
    icon: <ShieldCheck className="w-10 h-10 text-emerald-400" />,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0b] text-white selection:bg-blue-500/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20">
        {/* Background Glows */}
        <div className="absolute top-0 -left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 -right-20 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]" />

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium tracking-wider uppercase bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400">
              Trusted by Fortune 500 Companies
            </span>
            <h1 className="text-6xl md:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400 leading-tight">
              Secure Tomorrow, <br /> Today.
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
              ApniSec provides elite cybersecurity solutions—from cloud
              protection to advanced penetration testing—to shield your digital
              assets.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/services"
                className="group bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold flex items-center transition-all shadow-lg shadow-blue-600/20"
              >
                Get Started
                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 rounded-xl font-semibold border border-gray-800 hover:bg-gray-800 transition-all"
              >
                Book a Demo
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-4">
            <div className="max-w-xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Our Services
              </h2>
              <p className="text-gray-400">
                We offer a comprehensive suite of security services designed to
                find vulnerabilities before attackers do.
              </p>
            </div>
            <Link
              href="/services"
              className="text-blue-400 hover:text-blue-300 font-medium flex items-center"
            >
              View all services <ChevronRight className="ml-1 w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="p-8 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-blue-500/50 transition-all group"
              >
                <div className="mb-6 p-3 bg-gray-800/50 inline-block rounded-lg group-hover:scale-110 transition-transform">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-gray-400 leading-relaxed mb-6">
                  {service.description}
                </p>
                <div className="w-12 h-1 bg-gray-800 group-hover:w-full group-hover:bg-blue-600 transition-all duration-500" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="py-12 border-y border-gray-900 bg-gray-900/20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-50 grayscale contrast-125">
            {/* Replace these with real partner logos */}
            <div className="text-center font-bold text-xl italic tracking-widest">
              TECHCORP
            </div>
            <div className="text-center font-bold text-xl italic tracking-widest">
              SECURELY
            </div>
            <div className="text-center font-bold text-xl italic tracking-widest">
              CLOUDNET
            </div>
            <div className="text-center font-bold text-xl italic tracking-widest">
              DATAFLOW
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Zap className="w-64 h-64" />
            </div>
            <h2 className="text-4xl font-bold mb-6 relative z-10">
              Ready to secure your business?
            </h2>
            <p className="text-blue-100 mb-8 max-w-xl mx-auto relative z-10 text-lg">
              Join 200+ companies that rely on ApniSec for their 24/7 digital
              security.
            </p>
            <button className="bg-white text-blue-600 px-10 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all relative z-10 shadow-xl">
              Get a Free Security Audit
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
