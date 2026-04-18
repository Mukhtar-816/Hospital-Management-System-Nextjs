import Link from "next/link";

export default function Navbar() {
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

          <div className="flex items-center space-x-4">
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
        </div>
      </div>
    </nav>
  );
}
