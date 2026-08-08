import { AuthenticatedAppLayout } from "@/components/layout/AuthenticatedAppLayout"

export default function SettingsLayout({ children }: LayoutProps<"/settings">) {
  return <AuthenticatedAppLayout loginPath="/settings">{children}</AuthenticatedAppLayout>
}
