import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClientProviders } from "./ClientProviders";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ApniSec - Expert Cybersecurity Services in India",
  description:
    "Protect your business with ApniSec's professional services: Cloud Security Assessments, Red Team Exercises, and Vulnerability Assessment & Penetration Testing (VAPT). Secure tomorrow, today.",
  keywords:
    "cybersecurity India, cloud security, red team assessment, VAPT, penetration testing, security audit",
  openGraph: {
    title: "ApniSec - Your Cybersecurity Partner",
    description: "Expert Cloud Security, Red Team, and VAPT services",
    url: "https://your-deployed-url.com",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        <ClientProviders>
          <header className="bg-gray-900 text-white shadow-lg fixed w-full top-0 z-50">
            <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
              <Link href="/" className="text-2xl font-bold tracking-tight">
                ApniSec
              </Link>
              <div className="hidden md:flex items-center space-x-8">
                <Link
                  href="#services"
                  className="hover:text-blue-400 transition"
                >
                  Services
                </Link>
                <Link href="#about" className="hover:text-blue-400 transition">
                  About
                </Link>
                <Link
                  href="#contact"
                  className="hover:text-blue-400 transition"
                >
                  Contact
                </Link>
                <Link
                  href="/login"
                  className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-medium transition shadow-md"
                >
                  Login
                </Link>
              </div>
              {/* Mobile menu - simple for now */}
              <div className="md:hidden">
                <Link
                  href="/login"
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm"
                >
                  Login
                </Link>
              </div>
            </nav>
          </header>
          <main className="pt-20">{children}</main>
          <footer className="bg-gray-900 text-white py-12 mt-20">
            <div className="container mx-auto px-6 text-center">
              <p className="text-2xl font-bold mb-4">ApniSec</p>
              <p className="mb-4">
                Your trusted cybersecurity partner in India
              </p>
              <p className="text-sm text-gray-400">
                © {new Date().getFullYear()} ApniSec. All rights reserved.
              </p>
            </div>
          </footer>
        </ClientProviders>
      </body>
    </html>
  );
}
