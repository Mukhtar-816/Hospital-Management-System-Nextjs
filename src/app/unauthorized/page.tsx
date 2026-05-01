import { ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white p-4">
      <div className="max-w-md w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center shadow-2xl">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 mb-6">
          <ShieldAlert size={48} className="text-red-500" />
        </div>

        <h1 className="text-3xl font-bold mb-4 tracking-tight">
          Access Denied
        </h1>

        <p className="text-gray-400 mb-8 leading-relaxed">
          You don't have the required permissions to access this area of the
          hospital portal. Please contact your administrator if you believe this
          is an error.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/login"
            className="w-full py-4 px-6 bg-white text-black font-semibold rounded-2xl hover:bg-gray-200 transition-all duration-300 transform active:scale-[0.98]"
          >
            Sign in with another account
          </Link>

          <Link
            href="/"
            className="w-full py-4 px-6 bg-white/5 text-white font-semibold rounded-2xl hover:bg-white/10 border border-white/10 transition-all duration-300"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
