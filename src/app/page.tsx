import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg text-text">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
            <svg
              role="img"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
            </svg>
          </div>
          <span className="font-bold text-2xl tracking-tight">MedCloud</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/auth/login">
            <Button variant="ghost" type="button">
              Sign In
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button type="button">Register</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-6 pt-20 pb-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-block px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-semibold tracking-wide uppercase">
            Modern Healthcare Management
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
            The future of <span className="text-primary">hospital care</span> is
            here.
          </h1>
          <p className="text-xl text-textMuted max-w-2xl mx-auto leading-relaxed">
            MedCloud provides a seamless experience for patients, doctors, and
            administrators. Streamline appointments, manage records, and improve
            patient outcomes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/auth/register" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto text-lg px-8"
                type="button"
              >
                Get Started as a Patient
              </Button>
            </Link>
            <Link href="/auth/login" className="w-full sm:w-auto">
              <Button
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto text-lg px-8"
                type="button"
              >
                Portal Login
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32">
          <FeatureCard
            icon="🏥"
            title="Patient Portal"
            description="Manage your health records, request appointments, and view prescriptions all in one place."
          />
          <FeatureCard
            icon="🩺"
            title="Doctor Workspace"
            description="Efficient interaction management, clinical notes, and prescription tools designed for clinicians."
          />
          <FeatureCard
            icon="⚙️"
            title="Admin Dashboard"
            description="Complete control over users, roles, and system health with real-time analytics."
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-6 text-center text-textMuted text-sm">
          <p>© 2026 MedCloud HMS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="p-8 bg-surface border border-border rounded-3xl hover:border-primary/50 transition-all group">
      <div className="text-4xl mb-6">{icon}</div>
      <h3 className="text-xl font-bold text-text mb-3 group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="text-textMuted leading-relaxed">{description}</p>
    </div>
  );
}
