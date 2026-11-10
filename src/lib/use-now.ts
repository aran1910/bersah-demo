"use client"

import * as React from "react"

/** Current time captured once per mount (keeps render pure). */
export function useNow(): Date {
  const [now] = React.useState(() => new Date())
  return now
}
