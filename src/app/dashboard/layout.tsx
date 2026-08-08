import { AuthenticatedAppLayout } from "@/components/layout/AuthenticatedAppLayout"

export default function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  return (
    <AuthenticatedAppLayout loginPath="/dashboard">
      {children}
    </AuthenticatedAppLayout>
  )
}
