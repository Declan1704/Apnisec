import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Cloud,
  Terminal,
  ChevronRight,
  Zap,
} from "lucide-react";

const services = [
  {
    title: "Cloud Security",
    description:
      "Protecting your cloud infrastructure with advanced monitoring and threat detection.",
    icon: <Cloud className="w-12 h-12 text-blue-400" />,
  },
  {
    title: "Red Teaming",
    description:
      "Simulated cyber attacks to test your defense capabilities and response protocols.",
    icon: <Terminal className="w-12 h-12 text-purple-400" />,
  },
  {
    title: "VAPT Services",
    description:
      "Comprehensive Vulnerability Assessment and Penetration Testing for applications.",
    icon: <ShieldCheck className="w-12 h-12 text-emerald-400" />,
  },
];

export default function Home() {
  return (
    <>
      {/* Hero - Optimized gradients, no blur */}
      <section className="relative overflow-hidden pt-32 pb-20 bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_right,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-xl -translate-x-1/2 translate-y-1/2" />

        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="animate-fade-in-up space-y-6">
            <span className="inline-block px-4 py-2 text-xs font-semibold tracking-wider uppercase bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 animate-pulse">
              Trusted by 200+ Indian Enterprises
            </span>
            <h1 className="text-5xl md:text-7xl font-black leading-tight bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text">
              Secure Tomorrow,
              <span className="block text-blue-400 drop-shadow-lg">Today.</span>
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-gray-300 leading-relaxed">
              ApniSec delivers elite cybersecurity for Indian businesses. Cloud
              Security, Red Team Assessments, VAPT.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link
                href="/register"
                className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 transform hover:-translate-y-1 transition-all duration-300 flex items-center"
              >
                Start Free Audit
                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/login"
                className="px-10 py-4 rounded-2xl font-semibold border-2 border-gray-700 hover:border-blue-500 hover:bg-blue-500/5 backdrop-blur-sm text-lg transition-all duration-300 flex items-center"
              >
                Login / Demo
                <Lock className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section
        id="services"
        className="py-24 bg-gradient-to-b from-slate-900/50 to-slate-950"
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6 bg-gradient-to-r from-gray-200 via-white to-gray-300 bg-clip-text">
              Elite Security Services
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              We hunt vulnerabilities before attackers do. Trusted by CISOs
              across India.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {services.map((service, i) => (
              <div
                key={service.title}
                className="group relative p-10 rounded-3xl bg-slate-900/50 border border-slate-800/50 hover:border-blue-500/50 hover:bg-slate-800/70 backdrop-blur-xl shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-4 overflow-hidden"
              >
                {/* Animated border */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0 group-hover:bg-gradient-to-l opacity-0 group-hover:opacity-100 transition-all duration-700 -z-10" />

                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-20 h-20 mb-6 p-5 bg-slate-800/50 rounded-2xl group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm border border-slate-700/50">
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-black mb-4 text-white group-hover:text-blue-400 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-400 flex-1 leading-relaxed mb-8">
                    {service.description}
                  </p>
                  <div className="w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full group-hover:w-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats / Trust */}
      <section className="py-20 bg-gradient-to-r from-slate-900 to-slate-950 border-y border-slate-800/50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-black text-blue-400 mb-2">200+</div>
              <div className="text-gray-500 text-sm uppercase tracking-wider">
                Clients Secured
              </div>
            </div>
            <div>
              <div className="text-4xl font-black text-emerald-400 mb-2">
                99.9%
              </div>
              <div className="text-gray-500 text-sm uppercase tracking-wider">
                Uptime
              </div>
            </div>
            <div>
              <div className="text-4xl font-black text-purple-400 mb-2">
                50+
              </div>
              <div className="text-gray-500 text-sm uppercase tracking-wider">
                Experts
              </div>
            </div>
            <div>
              <div className="text-4xl font-black text-orange-400 mb-2">
                ₹10Cr+
              </div>
              <div className="text-gray-500 text-sm uppercase tracking-wider">
                Prevented
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-blue-600/20 via-purple-600/10 to-emerald-600/20" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black mb-6 bg-linear-to-r from-white to-blue-100 bg-clip-text">
              Ready to Secure Your Business?
            </h2>
            <p className="text-xl text-gray-300 mb-10 leading-relaxed">
              Join 200+ Indian enterprises protected by ApniSec's world-class
              cybersecurity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="group bg-white/10 backdrop-blur-xl hover:bg-white/20 border-2 border-white/20 text-white px-12 py-6 rounded-3xl font-black text-xl shadow-2xl hover:shadow-white/20 hover:-translate-y-2 transition-all duration-500 flex items-center mx-auto sm:mx-0 max-w-sm"
              >
                Start Free Audit Now
                <Zap className="ml-3 w-6 h-6 group-hover:scale-110 transition-transform" />
              </Link>
              <Link
                href="/login"
                className="px-12 py-6 rounded-2xl font-semibold border-2 border-white/30 hover:border-white text-lg transition-all"
              >
                Login Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
