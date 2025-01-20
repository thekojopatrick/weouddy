import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';

interface Invoice {
  id: string;
  date: string;
  amount: number;
  plan: string;
}

interface InvoiceTableProps {
  invoices: Invoice[];
}

export function InvoiceTable({ invoices }: InvoiceTableProps) {
  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="hidden  sm:flex">Invoice</TableHead>
            <TableHead>Billing date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id} className="py-3">
              <TableCell className="hidden  sm:flex">
                <div className="items-center gap-2 flex">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  {invoice.id}
                </div>
              </TableCell>
              <TableCell>{invoice.date}</TableCell>
              <TableCell>${invoice.amount}</TableCell>
              <TableCell>{invoice.plan}</TableCell>
              <TableCell className="text-right space-x-2 flex items-center">
                <Button
                  variant="outline"
                  size="sm"
                  className="shadow-sm rounded-lg"
                >
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="shadow-sm rounded-lg"
                >
                  <Download className="h-5 w-5" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
