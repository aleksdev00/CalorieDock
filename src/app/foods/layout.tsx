import { AuthenticatedAppLayout } from "@/components/layout/AuthenticatedAppLayout"

export default function FoodsLayout({ children }: LayoutProps<"/foods">) {
  return (
    <AuthenticatedAppLayout loginPath="/foods">
      {children}
    </AuthenticatedAppLayout>
  )
}
