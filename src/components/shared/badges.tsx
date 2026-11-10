import { Package, Snowflake, Thermometer } from "lucide-react"
import type { Product, StorageType } from "@/types/catalog"
import type { AccountStatus, OrderStatus } from "@/types/commerce"
import { STATUS_META } from "@/lib/orders"
import { stockLevel } from "@/lib/pricing"
import { cn } from "@/lib/utils"

const TONES = {
  amber: "bg-amber-50 text-amber-800 ring-amber-600/20",
  blue: "bg-sky-50 text-sky-800 ring-sky-600/20",
  indigo: "bg-indigo-50 text-indigo-800 ring-indigo-600/20",
  violet: "bg-violet-50 text-violet-800 ring-violet-600/20",
  green: "bg-emerald-50 text-emerald-800 ring-emerald-600/20",
  slate: "bg-slate-100 text-slate-700 ring-slate-500/20",
  red: "bg-red-50 text-red-700 ring-red-600/20",
} as const

const DOTS = {
  amber: "bg-amber-500",
  blue: "bg-sky-500",
  indigo: "bg-indigo-500",
  violet: "bg-violet-500",
  green: "bg-emerald-500",
  slate: "bg-slate-400",
  red: "bg-red-500",
} as const

export function Pill({
  tone,
  children,
  className,
  dot = true,
}: {
  tone: keyof typeof TONES
  children: React.ReactNode
  className?: string
  dot?: boolean
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap ring-1 ring-inset",
        TONES[tone],
        className
      )}
    >
      {dot && <span className={cn("size-1.5 rounded-full", DOTS[tone])} />}
      {children}
    </span>
  )
}

export function OrderStatusBadge({ status, className }: { status: OrderStatus; className?: string }) {
  const meta = STATUS_META[status]
  return (
    <Pill tone={meta.tone} className={className}>
      {meta.label}
    </Pill>
  )
}

export function StockBadge({ product, className }: { product: Product; className?: string }) {
  const level = stockLevel(product)
  if (level === "out") return <Pill tone="red" className={className}>Out of stock</Pill>
  if (level === "low") return <Pill tone="amber" className={className}>Low stock</Pill>
  return <Pill tone="green" className={className}>In stock</Pill>
}

const STORAGE = {
  frozen: { label: "Frozen", icon: Snowflake, cls: "text-sky-700 bg-sky-50 ring-sky-600/15" },
  chilled: { label: "Chilled", icon: Thermometer, cls: "text-teal-700 bg-teal-50 ring-teal-600/15" },
  ambient: { label: "Ambient", icon: Package, cls: "text-stone-700 bg-stone-100 ring-stone-500/15" },
} satisfies Record<StorageType, unknown>

export function StorageBadge({ storage, className }: { storage: StorageType; className?: string }) {
  const s = STORAGE[storage]
  const Icon = s.icon
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset",
        s.cls,
        className
      )}
    >
      <Icon className="size-3" aria-hidden="true" />
      {s.label}
    </span>
  )
}

export function AccountStatusBadge({ status }: { status: AccountStatus }) {
  if (status === "active") return <Pill tone="green">Active</Pill>
  if (status === "on-hold") return <Pill tone="red">On hold</Pill>
  return <Pill tone="amber">Pending approval</Pill>
}

export function DemoTag({ children = "Demo", className }: { children?: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border border-dashed border-amber-500/60 bg-amber-50 px-1.5 py-px text-[10px] font-semibold tracking-wider text-amber-800 uppercase",
        className
      )}
    >
      {children}
    </span>
  )
}
