"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { CheckCircle2, Send } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { DemoTag } from "@/components/shared/badges"

/** Mirrors the fields on the official contact form. Submission is simulated. */
export function ContactForm() {
  const params = useSearchParams()
  const product = params.get("product")
  const [sent, setSent] = React.useState<string | null>(null)

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    setSent(String(data.get("name") ?? ""))
    toast.success("Message captured (demo)", { description: "No email was sent — this form is simulated." })
  }

  if (sent !== null) {
    return (
      <div className="mt-6 rounded-lg bg-brand-tint/60 p-8 text-center">
        <CheckCircle2 className="animate-scale-in mx-auto size-12 text-brand" aria-hidden="true" />
        <p className="mt-4 text-lg font-medium">Thank you{sent ? `, ${sent.split(" ")[0]}` : ""}.</p>
        <p className="mt-1 text-sm text-muted-foreground">In the live platform this would reach the BerSah team. In this demo nothing was sent.</p>
        <Button variant="outline" className="mt-6" onClick={() => setSent(null)}>
          Send another message
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 grid gap-5 sm:grid-cols-2">
      <div className="grid gap-2">
        <Label htmlFor="name">Your name *</Label>
        <Input id="name" name="name" required autoComplete="name" className="h-11" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email *</Label>
        <Input id="email" name="email" type="email" required autoComplete="email" className="h-11" />
      </div>
      <div className="grid gap-2 sm:col-span-2">
        <Label htmlFor="company">Company</Label>
        <Input id="company" name="company" autoComplete="organization" className="h-11" />
      </div>
      <div className="grid gap-2 sm:col-span-2">
        <Label htmlFor="comments">Any other comments *</Label>
        <Textarea
          id="comments"
          name="comments"
          required
          rows={5}
          defaultValue={product ? `I'd like a quote for: ${product}\n\n` : ""}
        />
      </div>
      <label className="flex items-center gap-3 text-sm sm:col-span-2">
        <Checkbox name="newsletter" /> Yes, I would like to receive newsletters!
      </label>
      <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
        <Button type="submit" size="lg" className="h-11 px-6">
          <Send data-icon="inline-start" /> Submit
        </Button>
        <DemoTag>Simulated — nothing is sent</DemoTag>
      </div>
    </form>
  )
}
