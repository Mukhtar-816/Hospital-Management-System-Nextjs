import Link from "next/link";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-32 flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
              Modern Healthcare <br className="hidden sm:block" />
              <span className="text-blue-600">Made Simple</span>
            </h1>
            <p className="mt-4 text-lg md:text-xl text-slate-600 max-w-2xl mb-10">
              Streamline your hospital operations with MediSync. We provide an intuitive platform for patient management, instant appointments, and effortless billing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto">
              <Link
                href="/signup"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg px-8 py-3.5 rounded-xl shadow-lg shadow-blue-600/30 transition-all active:scale-95"
              >
                Get Started
              </Link>
              <Link
                href="#features"
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-lg px-8 py-3.5 rounded-xl transition-all active:scale-95"
              >
                Learn More
              </Link>
            </div>
            
            {/* Optional Image / Graphic could go here */}
            <div className="mt-16 w-full max-w-5xl rounded-2xl bg-blue-50/50 p-4 border border-blue-100 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-100 rounded-full blur-2xl opacity-50"></div>
               <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-blue-200 rounded-full blur-3xl opacity-40"></div>
               <div className="relative aspect-[21/9] bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center">
                 <p className="text-slate-400 font-medium">Interactive Dashboard Preview</p>
               </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything you need to manage your hospital</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Our comprehensive suite of tools helps healthcare professionals focus on what matters most: patient care.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Patient Management</h3>
                <p className="text-slate-600 line-clamp-3">
                  Maintain digital health records, track patient history, and securely store vital information with our easy-to-use patient portal.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Smart Appointments</h3>
                <p className="text-slate-600 line-clamp-3">
                  Schedule, reschedule, or cancel appointments effortlessly. Send automated reminders to patients via email or SMS.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Integrated Billing</h3>
                <p className="text-slate-600 line-clamp-3">
                  Manage invoices, track payments, and process insurance claims seamlessly in one unified interface.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
