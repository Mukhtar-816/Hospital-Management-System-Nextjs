"use client"

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 rounded p-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <Link href="/" className="text-xl font-bold text-slate-800">
              Medi<span className="text-blue-600">Sync</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">
              Home
            </Link>
            <Link href="#services" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">
              Services
            </Link>
            <Link href="#contact" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">
              Contact
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/login"
              className="text-slate-600 hover:text-blue-600 font-medium px-4 py-2 transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg shadow-sm shadow-blue-600/30 transition-all active:scale-95"
            >
              Sign up
            </Link>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2 rounded-md hover:bg-slate-100 transition-colors"
            aria-expanded={menuOpen}
            aria-label="Toggle navigation menu"
          >
            <div className={`bg-slate-600 h-0.5 w-6 rounded-full transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}></div>
            <div className={`bg-slate-600 h-0.5 w-6 rounded-full transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}></div>
            <div className={`bg-slate-600 h-0.5 w-6 rounded-full transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}></div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white ${menuOpen ? "max-h-[400px] border-t border-slate-100 opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <div className="px-4 pt-2 pb-6 space-y-4 shadow-inner">
          <div className="flex flex-col space-y-3 pt-2">
            <Link href="/" onClick={closeMenu} className="text-slate-600 hover:text-blue-600 font-medium transition-colors px-2">
              Home
            </Link>
            <Link href="#services" onClick={closeMenu} className="text-slate-600 hover:text-blue-600 font-medium transition-colors px-2">
              Services
            </Link>
            <Link href="#contact" onClick={closeMenu} className="text-slate-600 hover:text-blue-600 font-medium transition-colors px-2">
              Contact
            </Link>
          </div>

          <div className="h-px w-full bg-slate-200"></div>

          <div className="flex flex-col space-y-3 px-2 pt-1">
            <Link
              href="/login"
              onClick={closeMenu}
              className="text-center text-slate-700 bg-slate-100 hover:bg-slate-200 font-medium px-4 py-2.5 rounded-lg transition-colors border border-slate-200"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              onClick={closeMenu}
              className="text-center bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg shadow-sm transition-colors"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
