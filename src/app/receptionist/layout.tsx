import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function ReceptionistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout userRole="receptionist">{children}</DashboardLayout>;
}
