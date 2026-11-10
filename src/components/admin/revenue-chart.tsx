"use client"

import * as React from "react"
import type { Order } from "@/types/commerce"
import { formatMoney, formatMoneyCompact, toDateOnly, formatDate } from "@/lib/format"

/** Single-series bar chart: order value per day (by order date), last N days. */
export function RevenueChart({ orders, days = 14 }: { orders: Order[]; days?: number }) {
  const [hover, setHover] = React.useState<number | null>(null)
  const [now] = React.useState(() => new Date())

  const data = React.useMemo(() => {
    const out: { date: string; value: number; count: number }[] = []
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i)
      const key = toDateOnly(d)
      const dayOrders = orders.filter((o) => o.status !== "cancelled" && toDateOnly(new Date(o.createdAt)) === key)
      out.push({ date: key, value: dayOrders.reduce((s, o) => s + o.total, 0), count: dayOrders.length })
    }
    return out
  }, [orders, days, now])

  const max = Math.max(1, ...data.map((d) => d.value))
  const niceMax = Math.ceil(max / 2000) * 2000
  const ticks = [0, niceMax / 2, niceMax]
  const H = 200

  return (
    <figure>
      <div className="relative" style={{ height: H + 28 }}>
        {/* grid */}
        {ticks.map((t) => (
          <div key={t} className="absolute right-0 left-12 border-t border-dashed border-border" style={{ bottom: 28 + (t / niceMax) * H }}>
            <span className="tabular absolute -top-2 -left-12 w-10 text-right text-[11px] text-muted-foreground">{formatMoneyCompact(t).replace("Afl. ", "")}</span>
          </div>
        ))}
        <div className="absolute right-0 bottom-0 left-12 flex h-full items-end gap-[2px]" onMouseLeave={() => setHover(null)}>
          {data.map((d, i) => {
            const h = Math.max(d.value > 0 ? 3 : 0, (d.value / niceMax) * H)
            const isToday = i === data.length - 1
            return (
              <div
                key={d.date}
                className="group relative flex h-full flex-1 flex-col items-center justify-end pb-7"
                onMouseEnter={() => setHover(i)}
                onFocus={() => setHover(i)}
                tabIndex={0}
                aria-label={`${formatDate(d.date)}: ${formatMoney(d.value)}, ${d.count} orders`}
              >
                <div
                  className="w-full max-w-7 rounded-t-[4px] bg-brand transition-opacity"
                  style={{ height: h, opacity: hover === null || hover === i ? 1 : 0.45 }}
                />
                <span className={`absolute bottom-1 text-[10px] ${isToday ? "font-semibold text-ink" : "text-muted-foreground"} ${i % 2 === 1 && !isToday ? "hidden sm:block" : ""}`}>
                  {new Date(d.date + "T12:00:00").getDate()}
                </span>
                {hover === i && (
                  <div
                    className="pointer-events-none absolute z-10 w-max rounded-md border bg-white px-3 py-2 text-xs shadow-lg"
                    style={{ bottom: h + 36 }}
                  >
                    <p className="font-medium">{formatDate(d.date, { weekday: "short", year: undefined })}</p>
                    <p className="tabular mt-0.5">{formatMoney(d.value)}</p>
                    <p className="text-muted-foreground">{d.count} {d.count === 1 ? "order" : "orders"}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
      <table className="sr-only">
        <caption>Order value per day</caption>
        <tbody>
          {data.map((d) => (
            <tr key={d.date}>
              <th>{d.date}</th>
              <td>{formatMoney(d.value)}</td>
              <td>{d.count} orders</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  )
}
