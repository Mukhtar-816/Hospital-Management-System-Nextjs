"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Activity, Shield, Users, ArrowRight, Zap, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    // Mocking role detection - in a real app this would come from a cookie or session
    const savedRole = localStorage.getItem("userRole");
    if (savedRole) setRole(savedRole);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-bg text-text selection:bg-primary/30">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px]" />
      </div>

      <nav className="container mx-auto px-6 py-8 flex items-center justify-between sticky top-0 z-50 glass border-none rounded-b-3xl">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/20">
            <Heart size={28} fill="currentColor" />
          </div>
          <span className="font-black text-2xl tracking-tighter text-gradient">MedCloud</span>
        </motion.div>
        
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="font-bold">Sign In</Button>
          </Link>
          <Link href="/register">
            <Button variant="primary" className="font-bold shadow-2xl">Get Started</Button>
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-6">
        {/* Hero Section */}
        <section className="pt-24 pb-32 text-center relative">
          <AnimatePresence mode="wait">
            {role ? (
              <motion.div
                key="role-hero"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-4xl mx-auto glass p-10 rounded-[3rem] border-primary/20 shadow-2xl shadow-primary/10 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Activity size={120} className="text-primary" />
                </div>
                <div className="relative z-10 space-y-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-black uppercase tracking-widest">
                    <Zap size={14} /> Active Session Detected
                  </div>
                  <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
                    Welcome back, <span className="text-gradient capitalize">{role}</span>.
                  </h1>
                  <p className="text-xl text-textMuted max-w-2xl mx-auto font-medium">
                    {role === "doctor" && "You have 8 patients scheduled for today. Ready to start your shift?"}
                    {role === "patient" && "Your health journey continues. Check your latest records or book a new appointment."}
                    {role === "admin" && "System health is optimal. 4 new users are pending verification."}
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <Link href={`/${role}/dashboard`} className="w-full sm:w-auto">
                      <Button size="lg" className="w-full sm:w-auto text-lg px-10 rounded-2xl group" variant="primary">
                        Go to Dashboard <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="generic-hero"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-4xl mx-auto space-y-10"
              >
                <motion.div 
                  variants={itemVariants}
                  className="inline-block px-5 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-black tracking-[0.2em] uppercase"
                >
                  Healthcare 2026 • Reimagined
                </motion.div>
                <motion.h1 
                  variants={itemVariants}
                  className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.95]"
                >
                  The future of <br />
                  <span className="text-gradient">hospital care</span> is here.
                </motion.h1>
                <motion.p 
                  variants={itemVariants}
                  className="text-xl md:text-2xl text-textMuted max-w-2xl mx-auto leading-relaxed font-medium"
                >
                  MedCloud provides a seamless experience for patients, doctors, and administrators. 
                  Streamline appointments, manage records, and improve outcomes.
                </motion.p>
                <motion.div 
                  variants={itemVariants}
                  className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6"
                >
                  <Link href="/register" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto text-lg px-12 rounded-2xl h-16 shadow-2xl shadow-primary/30" variant="primary">
                      Start as Patient
                    </Button>
                  </Link>
                  <Link href="/login" className="w-full sm:w-auto">
                    <Button variant="glass" size="lg" className="w-full sm:w-auto text-lg px-12 rounded-2xl h-16 border-2">
                      Portal Login
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Features Grid */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 pb-32"
        >
          <FeatureCard
            icon={<Users className="text-blue-500" size={32} />}
            title="Patient Portal"
            description="Manage your health records, request appointments, and view prescriptions with a few clicks."
            color="blue"
          />
          <FeatureCard
            icon={<Activity className="text-emerald-500" size={32} />}
            title="Doctor Workspace"
            description="Efficient interaction management, clinical notes, and prescription tools designed for modern clinicians."
            color="emerald"
          />
          <FeatureCard
            icon={<Shield className="text-purple-500" size={32} />}
            title="Admin Hub"
            description="Complete control over users, roles, and system health with real-time enterprise-grade analytics."
            color="purple"
          />
        </motion.section>
      </main>

      <footer className="border-t border-border/50 py-16 bg-surface/30 backdrop-blur-md">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
              <Heart size={18} fill="currentColor" />
            </div>
            <span className="font-bold text-lg tracking-tight">MedCloud</span>
          </div>
          <p className="text-textMuted text-sm font-medium">© 2026 MedCloud HMS. Built for the future of healthcare.</p>
          <div className="flex gap-6 text-sm font-bold text-textMuted">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="p-10 bg-surface/50 glass border-border/50 rounded-[2.5rem] hover:border-primary/50 transition-all group"
    >
      <div className={cn(
        "w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110 duration-500",
        `bg-${color}-500/10`
      )}>
        {icon}
      </div>
      <h3 className="text-2xl font-black text-text mb-4 group-hover:text-primary transition-colors tracking-tight">
        {title}
      </h3>
      <p className="text-textMuted leading-relaxed font-medium">
        {description}
      </p>
      <div className="mt-8 flex items-center gap-2 text-primary font-bold text-sm group-hover:gap-3 transition-all cursor-pointer">
        Learn more <ArrowRight size={16} />
      </div>
    </motion.div>
  );
}

