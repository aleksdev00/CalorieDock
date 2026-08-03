import type { UseFormRegisterReturn } from "react-hook-form"

interface FormFieldProps {
  id: string
  label: string
  type?: "email" | "text"
  autoComplete?: string
  error?: string
  registration: UseFormRegisterReturn
}

export function FormField({
  id,
  label,
  type = "text",
  autoComplete,
  error,
  registration,
}: FormFieldProps) {
  const errorId = `${id}-error`

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 aria-invalid:border-destructive"
        {...registration}
      />
      {error ? (
        <p id={errorId} className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  )
}

