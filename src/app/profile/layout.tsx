import { AuthenticatedAppLayout } from "@/components/layout/AuthenticatedAppLayout"

export default function ProfileLayout({ children }: LayoutProps<"/profile">) {
  return (
    <AuthenticatedAppLayout loginPath="/profile">
      {children}
    </AuthenticatedAppLayout>
  )
}
