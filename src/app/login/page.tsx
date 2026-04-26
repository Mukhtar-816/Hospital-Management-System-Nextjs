"use client";

import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Forms";

export default function LoginPage() {

  const [form, setForm] = React.useState({
    email: "",
    password: ""
  });

  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };


  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      router.push(`/${data.role}/dashboard`);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-bg p-4">
      <Card
        className="w-full max-w-md"
        title="Login to MedCloud"
        subtitle="Enter your credentials to access your account"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={form.email}
            name="email"
            onChange={handleChange}
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            required
          />
          <Input
            value={form.password}
            onChange={handleChange}
            name="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            required
          />

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer text-textMuted">
              <input
                type="checkbox"
                className="rounded border-border bg-surface text-primary"
              />
              Remember me
            </label>
            <Link href="#" className="text-primary hover:underline font-medium">
              Forgot password?
            </Link>
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center font-medium bg-red-50 p-2 rounded border border-red-100">
              {error}
            </p>
          )}


          <Button type="submit" className="w-full" isLoading={isLoading}>
            Sign In
          </Button>

          <p className="text-center text-sm text-textMuted pt-2">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-primary hover:underline font-medium"
            >
              Create an account
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
}
