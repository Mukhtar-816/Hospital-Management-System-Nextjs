import Link from "next/link";
import Navbar from "../components/Navbar";

export default function Signup() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100 my-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900">Create an account</h2>
            <p className="text-slate-500 mt-2">Join MediSync to manage your healthcare operations.</p>
          </div>

          <form className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="name">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Dr. John Doe"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                type="email"
                placeholder="john.doe@medisync.com"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="role">
                Select Your Role
              </label>
              <select
                id="role"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-colors bg-white"
                required
              >
                <option value="" disabled selected>Select a role...</option>
                <option value="admin">Administrator</option>
                <option value="doctor">Doctor</option>
                <option value="staff">Medical Staff</option>
                <option value="patient">Patient</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="confirm-password">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-colors"
                required
              />
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                required
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-slate-600">
                I agree to the <Link href="#" className="text-blue-600 hover:underline">Terms</Link> and <Link href="#" className="text-blue-600 hover:underline">Privacy Policy</Link>
              </label>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 rounded-lg shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all active:scale-[0.98]"
              >
                Create Account
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
