import { AuthenticatedAppLayout } from "@/components/layout/AuthenticatedAppLayout"

export default function MealsLayout({ children }: LayoutProps<"/meals">) {
  return (
    <AuthenticatedAppLayout loginPath="/meals">
      {children}
    </AuthenticatedAppLayout>
  )
}
