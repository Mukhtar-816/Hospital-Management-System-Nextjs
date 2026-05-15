"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { showToast } from "nextjs-toast-notify";
import React from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Forms";
import dynamic from "next/dynamic";

const MapInput = dynamic(() => import("@/components/ui/MapInput").then(mod => mod.MapInput), { 
  ssr: false,
  loading: () => <div className="h-10 w-full bg-surface/50 border border-border rounded-xl animate-pulse flex items-center justify-center text-[10px] font-black text-textMuted uppercase">Loading Map...</div>
});


export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = React.useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
    location: null as [number, number] | null,
  });


  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullname: form.fullname || form.email.split("@")[0],
          email: form.email,
          password: form.password,
          location: form.location,
        }),

      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        showToast.error(data.error || "Error Registering");
        return;
      }

      showToast.success(data.message || "Registered successfully");
      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const onLocationChange = React.useCallback((lat: number, lng: number) => {
    setForm(prev => {
      // Prevent unnecessary updates if location is the same
      if (prev.location && prev.location[0] === lat && prev.location[1] === lng) {
        return prev;
      }
      return { ...prev, location: [lat, lng] };
    });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg p-4">
      <Card
        className="w-full max-w-md"
        title="Create Patient Account"
        subtitle="Join our healthcare network today"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Account Credentials</h4>
            <Input
              name="fullname"
              label="Full Name"
              type="text"
              placeholder="John Doe"
              required
              onChange={handleChange}
            />

            <Input
              name="email"
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              required
              onChange={handleChange}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                name="password"
                label="Password"
                type="password"
                placeholder="••••••••"
                required
                onChange={handleChange}
              />

              <Input
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                required
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Location (Optional)</h4>
              <span className="text-[9px] text-textMuted font-bold bg-surface/50 px-2 py-0.5 rounded-full border border-border">FOR EMERGENCY SERVICES</span>
            </div>
            <MapInput 
              onLocationChange={onLocationChange}
              initialLocation={form.location || undefined}
            />
          </div>


          {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

          <div className="flex items-start gap-2 text-sm text-textMuted pt-1">
            <input
              type="checkbox"
              className="mt-1 rounded border-border bg-surface text-primary"
              required
            />
            <p>
              I agree to the{" "}
              <Link href="#" className="text-primary hover:underline font-medium">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-primary hover:underline font-medium">
                Privacy Policy
              </Link>
            </p>
          </div>

          <Button type="submit" className="w-full h-12 text-sm font-black uppercase tracking-widest" isLoading={isLoading}>
            Create Account
          </Button>

          <p className="text-center text-sm text-textMuted pt-2">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary hover:underline font-bold"
            >
              Sign In
            </Link>
          </p>
        </form>

      </Card>
    </div>
  );
}
