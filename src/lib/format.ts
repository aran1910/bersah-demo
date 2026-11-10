import { tenantConfig } from "@/tenants"

const { currencySymbol, locale } = tenantConfig.commerce

const numberFormat = new Intl.NumberFormat(locale, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const compactFormat = new Intl.NumberFormat(locale, {
  notation: "compact",
  maximumFractionDigits: 1,
})

export function formatMoney(value: number): string {
  const sign = value < 0 ? "−" : ""
  return `${sign}${currencySymbol} ${numberFormat.format(Math.abs(value))}`
}

export function formatMoneyCompact(value: number): string {
  return `${currencySymbol} ${compactFormat.format(value)}`
}

export function formatNumber(value: number, digits = 0): string {
  return new Intl.NumberFormat(locale, { maximumFractionDigits: digits }).format(value)
}

export function formatKg(value: number): string {
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(value)} kg`
}

/** Parse a YYYY-MM-DD string as a local date (avoids UTC off-by-one). */
export function parseDateOnly(value: string): Date {
  const [y, m, d] = value.split("-").map(Number)
  return new Date(y, m - 1, d)
}

export function toDateOnly(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

export function formatDate(value: string, opts: Intl.DateTimeFormatOptions = {}): string {
  const date = value.length === 10 ? parseDateOnly(value) : new Date(value)
  return date.toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric", ...opts })
}

export function formatDateLong(value: string): string {
  return formatDate(value, { weekday: "long", day: "numeric", month: "long", year: "numeric" })
}

export function formatDateTime(value: string): string {
  const date = new Date(value)
  return `${date.toLocaleDateString(locale, { day: "numeric", month: "short" })}, ${date.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })}`
}

export function formatRelative(value: string, now: Date = new Date()): string {
  const diffMs = now.getTime() - new Date(value).getTime()
  const minutes = Math.round(diffMs / 60000)
  if (minutes < 1) return "just now"
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours} h ago`
  const days = Math.round(hours / 24)
  if (days < 7) return `${days} d ago`
  return formatDate(value)
}

export function initials(name: string): string {
  return name
    .replace(/\(.*?\)/g, "")
    .split(/\s+/)
    .filter((part) => /^[\p{L}\p{N}]/u.test(part))
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}
