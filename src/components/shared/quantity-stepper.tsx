"use client"

import * as React from "react"
import { Minus, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface QuantityStepperProps {
  value: number
  onChange: (value: number) => void
  min?: number
  step?: number
  /** When true, decrementing below `min` passes 0 (used to remove cart lines). */
  allowZero?: boolean
  size?: "sm" | "md"
  suffix?: string
  className?: string
  label?: string
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  step = 1,
  allowZero,
  size = "md",
  suffix,
  className,
  label = "Quantity",
}: QuantityStepperProps) {
  const [draft, setDraft] = React.useState(String(value))
  const [prevValue, setPrevValue] = React.useState(value)
  if (prevValue !== value) {
    // Sync the text field when the value changes from outside.
    setPrevValue(value)
    setDraft(String(value))
  }

  const commit = (raw: string) => {
    const n = Number(raw.replace(",", "."))
    if (!Number.isFinite(n) || n <= 0) {
      if (allowZero) onChange(0)
      else setDraft(String(value))
      return
    }
    onChange(Math.max(min, n))
  }

  const dec = () => {
    const next = Math.round((value - step) * 100) / 100
    if (next < min) {
      if (allowZero) onChange(0)
      return
    }
    onChange(next)
  }
  const inc = () => onChange(Math.round((value + step) * 100) / 100)

  const h = size === "sm" ? "h-8" : "h-10"
  const btn = size === "sm" ? "w-8" : "w-10"

  return (
    <div
      className={cn(
        "inline-flex items-stretch overflow-hidden rounded-md border border-input bg-background shadow-xs",
        h,
        className
      )}
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        onClick={dec}
        disabled={!allowZero && value <= min}
        className={cn(
          "grid place-items-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40",
          btn
        )}
        aria-label="Decrease quantity"
      >
        <Minus className="size-3.5" />
      </button>
      <label className="flex min-w-12 items-center justify-center gap-1 border-x border-input px-1">
        <span className="sr-only">{label}</span>
        <input
          inputMode="decimal"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={(e) => commit(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit((e.target as HTMLInputElement).value)
          }}
          className="tabular w-10 bg-transparent text-center text-sm font-medium outline-none"
        />
        {suffix && <span className="text-xs text-muted-foreground">{suffix}</span>}
      </label>
      <button
        type="button"
        onClick={inc}
        className={cn(
          "grid place-items-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
          btn
        )}
        aria-label="Increase quantity"
      >
        <Plus className="size-3.5" />
      </button>
    </div>
  )
}
