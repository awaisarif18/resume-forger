"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image"; // 1. Added Image import
import { Github, Menu, X } from "lucide-react"; // Removed FileText

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            onClick={() => setIsOpen(false)}
          >
            {/* 2. NEW LOGO IMPLEMENTATION */}
            <div className="relative w-8 h-8">
              <Image
                src="/logo.png"
                alt="Resume Forger Logo"
                fill
                className="object-contain rounded-md"
                priority
              />
            </div>
            <span className="font-bold text-xl text-gray-900 tracking-tight">
              Resume Forger
            </span>
          </Link>

          {/* Desktop Links (Hidden on Mobile) */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/#features"
              className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
            >
              Features
            </Link>
            <Link
              href="/editor"
              className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
            >
              Editor
            </Link>
            <a
              href="https://github.com/awaisarif18/resume-forger"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium text-gray-900 bg-gray-100 px-4 py-2 rounded-full hover:bg-gray-200 transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>Star on GitHub</span>
            </a>
          </div>

          {/* Mobile Menu Button (Visible on Mobile) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white absolute w-full shadow-lg">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <Link
              href="/#features"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            >
              Features
            </Link>
            <Link
              href="/editor"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            >
              Editor
            </Link>
            <a
              href="https://github.com/awaisarif18/resume-forger"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            >
              <Github className="w-5 h-5" />
              Star on GitHub
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
