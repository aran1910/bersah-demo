import Link from "next/link"
import { Logo } from "@/components/brand/logo"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="grid min-h-dvh place-items-center bg-surface p-6">
      <div className="max-w-md text-center">
        <Logo className="mx-auto h-14" />
        <p className="font-display mt-8 text-6xl text-brand">404</p>
        <h1 className="mt-3 text-xl font-medium">This page isn&apos;t on the menu</h1>
        <p className="mt-2 text-muted-foreground">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
        <div className="mt-6 flex justify-center gap-2">
          <Button asChild><Link href="/">Back to home</Link></Button>
          <Button asChild variant="outline"><Link href="/products">Browse products</Link></Button>
        </div>
      </div>
    </div>
  )
}
