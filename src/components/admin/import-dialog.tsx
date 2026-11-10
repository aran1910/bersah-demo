"use client"

import * as React from "react"
import { FileSpreadsheet, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DemoTag } from "@/components/shared/badges"

const EXPECTED = ["sku", "name", "category", "unit", "contents", "price", "stock"]

function parseCsv(text: string): string[][] {
  return text
    .split(/\r?\n/)
    .filter((l) => l.trim())
    .slice(0, 8)
    .map((line) => {
      const out: string[] = []
      let cur = ""
      let quoted = false
      for (const ch of line) {
        if (ch === '"') quoted = !quoted
        else if (ch === "," && !quoted) {
          out.push(cur)
          cur = ""
        } else cur += ch
      }
      out.push(cur)
      return out.map((c) => c.trim())
    })
}

/** Preview a CSV product file. Nothing is imported — this shows the planned import flow. */
export function ImportDialog() {
  const [rows, setRows] = React.useState<string[][] | null>(null)
  const [fileName, setFileName] = React.useState("")

  const onFile = async (file: File | undefined) => {
    if (!file) return
    setFileName(file.name)
    setRows(parseCsv(await file.text()))
  }

  const header = rows?.[0]?.map((h) => h.toLowerCase()) ?? []
  const matched = EXPECTED.filter((c) => header.includes(c))

  return (
    <Dialog onOpenChange={(o) => !o && setRows(null)}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-white">
          <Upload data-icon="inline-start" /> Import CSV / Excel
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import products</DialogTitle>
          <DialogDescription>
            Upload a CSV export from your ERP or spreadsheet. The prototype previews the file and maps columns; the
            actual import will be built once BerSah&apos;s data format is known.
          </DialogDescription>
        </DialogHeader>
        <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed p-8 text-center transition-colors hover:border-brand/40 hover:bg-brand-tint/30">
          <FileSpreadsheet className="size-8 text-brand" />
          <span className="text-sm font-medium">{fileName || "Choose a .csv file"}</span>
          <span className="text-xs text-muted-foreground">Expected columns: {EXPECTED.join(", ")}</span>
          <input type="file" accept=".csv,text/csv" className="sr-only" onChange={(e) => onFile(e.target.files?.[0])} />
        </label>
        {rows && rows.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm">
              Matched <span className="font-medium">{matched.length}</span> of {EXPECTED.length} expected columns · previewing first {rows.length - 1} rows
            </p>
            <div className="max-h-56 overflow-auto rounded-lg border">
              <table className="w-full text-xs">
                <thead className="bg-surface">
                  <tr>
                    {rows[0].map((h, i) => (
                      <th key={i} className={`px-2 py-1.5 text-left font-medium ${EXPECTED.includes(h.toLowerCase()) ? "text-emerald-700" : "text-muted-foreground"}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {rows.slice(1).map((r, i) => (
                    <tr key={i}>
                      {r.map((c, j) => (
                        <td key={j} className="px-2 py-1.5 whitespace-nowrap">{c}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        <DialogFooter className="items-center sm:justify-between">
          <DemoTag>Preview only — nothing is imported</DemoTag>
          <Button disabled>Import (planned)</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
