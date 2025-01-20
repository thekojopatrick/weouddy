import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Download, FileText } from "lucide-react"

interface Invoice {
  id: string
  date: string
  amount: number
  plan: string
}

interface InvoiceTableProps {
  invoices: Invoice[]
}

export function InvoiceTable({ invoices }: InvoiceTableProps) {
  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Billing date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  {invoice.id}
                </div>
              </TableCell>
              <TableCell>{invoice.date}</TableCell>
              <TableCell>${invoice.amount}</TableCell>
              <TableCell>{invoice.plan}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="ghost" size="sm">
                  View
                </Button>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

