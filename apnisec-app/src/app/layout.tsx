import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ApniSec - Your Cybersecurity Partner",
  description:
    "Secure your digital world with ApniSec's expert services in cloud security, red teaming, and VAPT.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning is necessary because browser extensions
    // (like Grammarly) often inject attributes into the html or body tags.
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <nav className="bg-gray-900 text-white p-4 flex justify-between items-center sticky top-0 z-50">
          <Link
            href="/"
            className="text-xl font-bold hover:text-blue-400 transition-colors"
          >
            ApniSec
          </Link>
          <div className="space-x-6 flex items-center">
            <Link href="/" className="hover:text-blue-400 transition-colors">
              Home
            </Link>
            <Link
              href="/services"
              className="hover:text-blue-400 transition-colors"
            >
              Services
            </Link>
            <Link
              href="/login"
              className="bg-blue-600 px-5 py-2 rounded-md font-medium hover:bg-blue-700 transition-all active:scale-95"
            >
              Login
            </Link>
          </div>
        </nav>

        {/* main tag ensures the footer stays at the bottom on short pages */}
        <main className="grow">{children}</main>

        <footer className="bg-gray-900 text-gray-400 p-8 text-center border-t border-gray-800">
          <div className="max-w-7xl mx-auto">
            <p>
              &copy; {new Date().getFullYear()} ApniSec. All rights reserved.
            </p>
            <p className="text-sm mt-2 font-mono text-blue-500">
              Secure. Protect. Empower.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
