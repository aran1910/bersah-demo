import Image from "next/image"
import { cn } from "@/lib/utils"

/** Product photo that handles both photographs and transparent cut-outs. */
export function ProductImage({
  src,
  alt,
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw",
  className,
  imgClassName,
  eager,
}: {
  src: string
  alt: string
  sizes?: string
  className?: string
  imgClassName?: string
  /** Above-the-fold image: load immediately with high priority. */
  eager?: boolean
}) {
  const isCutout = src.endsWith(".png")
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-muted",
        isCutout && "bg-gradient-to-br from-[#f7f3ee] to-[#efe7dc]",
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        loading={eager ? "eager" : undefined}
        fetchPriority={eager ? "high" : undefined}
        className={cn(isCutout ? "object-contain p-[8%]" : "object-cover", imgClassName)}
      />
    </div>
  )
}
