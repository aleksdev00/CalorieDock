import { AuthenticatedAppLayout } from "@/components/layout/AuthenticatedAppLayout"

export default function WeightLayout({ children }: LayoutProps<"/weight">) {
  return (
    <AuthenticatedAppLayout loginPath="/weight">
      {children}
    </AuthenticatedAppLayout>
  )
}
