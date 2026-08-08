import { AuthenticatedAppLayout } from "@/components/layout/AuthenticatedAppLayout"

export default function WaterLayout({ children }: LayoutProps<"/water">) {
  return (
    <AuthenticatedAppLayout loginPath="/water">
      {children}
    </AuthenticatedAppLayout>
  )
}
