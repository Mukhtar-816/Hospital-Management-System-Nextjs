"use client";

import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Forms";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = React.useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
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
          name: form.username, // Map 'Full Name' to 'name'
          username: form.email.split('@')[0], // Simple username generation
          email: form.email,
          password: form.password,
        }),
      });


      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return;
      }

      router.push("/login");

    } catch (err) {
      console.log(err);
      setError("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg p-4">
      <Card
        className="w-full max-w-md"
        title="Create Patient Account"
        subtitle="Join our healthcare network today"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="username"
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

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <div className="flex items-start gap-2 text-sm text-textMuted pt-1">
            <input
              type="checkbox"
              className="mt-1 rounded border-border bg-surface text-primary"
              required
            />
            <p>
              I agree to the{" "}
              <Link href="#" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Create Account
          </Button>

          <p className="text-center text-sm text-textMuted pt-2">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary hover:underline font-medium"
            >
              Sign In
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
}