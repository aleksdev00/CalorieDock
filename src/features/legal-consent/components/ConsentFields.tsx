import Link from "next/link"
import type { UseFormRegisterReturn } from "react-hook-form"

import { HEALTH_CONSENT_TEXT, LEGAL_ACCEPTANCE_TEXT } from "../constants"

interface ConsentFieldsProps {
  legalRegistration: UseFormRegisterReturn
  healthRegistration: UseFormRegisterReturn
  legalError?: string
  healthError?: string
}

export function ConsentFields({ legalRegistration, healthRegistration, legalError, healthError }: ConsentFieldsProps) {
  return (
    <fieldset className="space-y-4">
      <legend className="mb-3 text-sm font-medium">Legal agreement and health-data consent</legend>
      <div>
        <div className="flex items-start gap-3">
          <input id="legalAccepted" type="checkbox" required className="mt-1 size-5 shrink-0" aria-invalid={Boolean(legalError)} aria-describedby={legalError ? "legalAccepted-error" : undefined} {...legalRegistration} />
          <label htmlFor="legalAccepted" className="text-sm leading-6">
            {LEGAL_ACCEPTANCE_TEXT.split(/(Terms of Use|Privacy Policy)/).map((part, index) =>
              part === "Terms of Use" || part === "Privacy Policy"
                ? <Link key={index} href={part === "Terms of Use" ? "/terms" : "/privacy"} className="underline underline-offset-4">{part}</Link>
                : part,
            )}
          </label>
        </div>
        {legalError ? <p id="legalAccepted-error" className="mt-1 text-sm text-destructive" role="alert">{legalError}</p> : null}
      </div>
      <div>
        <div className="flex items-start gap-3">
          <input id="healthAccepted" type="checkbox" required className="mt-1 size-5 shrink-0" aria-invalid={Boolean(healthError)} aria-describedby={healthError ? "healthAccepted-error" : undefined} {...healthRegistration} />
          <label htmlFor="healthAccepted" className="text-sm leading-6">{HEALTH_CONSENT_TEXT}</label>
        </div>
        {healthError ? <p id="healthAccepted-error" className="mt-1 text-sm text-destructive" role="alert">{healthError}</p> : null}
      </div>
    </fieldset>
  )
}
