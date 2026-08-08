import { AuthenticatedAppLayout } from "@/components/layout/AuthenticatedAppLayout"

export default function DailySummaryLayout({
  children,
}: LayoutProps<"/daily-summary">) {
  return (
    <AuthenticatedAppLayout loginPath="/daily-summary">
      {children}
    </AuthenticatedAppLayout>
  )
}
