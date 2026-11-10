import type { SVGProps } from "react"

type Network = "facebook" | "instagram" | "linkedin"

/** Brand glyphs (Lucide no longer ships brand icons). */
export function SocialIcon({ network, ...props }: { network: Network } & SVGProps<SVGSVGElement>) {
  if (network === "facebook") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
        <path d="M13.5 21v-7.5h2.53l.38-2.94H13.5V8.69c0-.85.24-1.43 1.46-1.43h1.55V4.63A20.6 20.6 0 0 0 14.25 4.5c-2.24 0-3.77 1.37-3.77 3.88v2.18H7.95v2.94h2.53V21h3.02Z" />
      </svg>
    )
  }
  if (network === "instagram") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" {...props}>
        <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
        <circle cx="12" cy="12" r="3.9" />
        <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M6.94 8.5H3.56V20h3.38V8.5ZM5.25 3A1.97 1.97 0 1 0 5.3 7a1.97 1.97 0 0 0-.05-4ZM20.44 13.4c0-3.07-1.64-4.5-3.83-4.5a3.3 3.3 0 0 0-2.99 1.65V8.5h-3.38V20h3.38v-6.1c0-1.6.3-3.16 2.3-3.16 1.96 0 1.99 1.84 1.99 3.26V20h3.38l-.85-6.6Z" />
    </svg>
  )
}

export function WhatsAppIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12.04 2a9.9 9.9 0 0 0-8.48 15.02L2.5 21.5l4.6-1.2A9.92 9.92 0 1 0 12.04 2Zm0 18.1a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-2.73.71.73-2.66-.2-.31a8.2 8.2 0 1 1 6.68 3.59Zm4.5-6.14c-.25-.12-1.46-.72-1.69-.8-.22-.08-.39-.12-.55.13-.16.24-.63.8-.77.96-.14.17-.28.19-.53.06a6.7 6.7 0 0 1-3.32-2.9c-.25-.43.25-.4.72-1.33.08-.16.04-.3-.02-.43-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42h-.47a.9.9 0 0 0-.65.3 2.74 2.74 0 0 0-.85 2.03 4.77 4.77 0 0 0 1 2.53 10.9 10.9 0 0 0 4.18 3.7c1.55.67 2.16.73 2.94.61.47-.07 1.46-.6 1.66-1.17.2-.58.2-1.07.15-1.17-.06-.1-.22-.16-.47-.29Z" />
    </svg>
  )
}
