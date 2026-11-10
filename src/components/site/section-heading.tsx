import { cn } from "@/lib/utils"

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "light",
  className,
  action,
}: {
  eyebrow?: string
  title: React.ReactNode
  description?: React.ReactNode
  align?: "left" | "center"
  tone?: "light" | "dark"
  className?: string
  action?: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
        align === "center" && "items-center text-center md:flex-col md:items-center",
        className
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow && (
          <p className={cn("eyebrow mb-4 flex items-center gap-3", tone === "dark" ? "text-brand-accent" : "text-brand", align === "center" && "justify-center")}>
            <span className="h-px w-8 bg-current opacity-60" aria-hidden="true" />
            {eyebrow}
          </p>
        )}
        <h2
          className={cn(
            "font-display text-3xl leading-[1.15] text-balance sm:text-4xl lg:text-[2.75rem]",
            tone === "dark" ? "text-white" : "text-ink"
          )}
        >
          {title}
        </h2>
        {description && (
          <p className={cn("mt-5 text-base leading-relaxed font-light sm:text-lg", tone === "dark" ? "text-white/70" : "text-muted-foreground")}>
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  )
}
