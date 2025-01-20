import { Button } from '@/components/ui/button';
import { Gift } from 'lucide-react';
import { InvoiceTable } from './billing/invoice-table';
import { PlanCard } from './billing/plan-card';
import { PaymentMethods } from './billing/payment-methods';

const paymentMethods = [
  {
    type: 'visa' as const,
    last4: '9016',
    expiryDate: '12/25',
    isDefault: true,
  },
  {
    type: 'mastercard' as const,
    last4: '4242',
    expiryDate: '04/24',
  },
];

const invoices = [
  {
    id: '25-02-2023',
    date: '25 Feb, 2023',
    amount: 39,
    plan: 'Startup',
  },
  {
    id: '25-01-2023',
    date: '25 Jan, 2023',
    amount: 39,
    plan: 'Startup',
  },
  {
    id: '25-12-2022',
    date: '25 Dec, 2022',
    amount: 39,
    plan: 'Startup',
  },
];

export default function BillingPage() {
  return (
    <div className="space-y-8">
      <div className="items-center justify-between hidden">
        <div>
          <h2 className="text-2xl font-bold">Plan & Billing</h2>
          <p className="text-muted-foreground">
            View your plan information or switch plans according to
            your needs.
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Gift className="h-4 w-4" />
          Gift PRO
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <PlanCard
          name="Startup"
          price={39}
          renewalDate="March 25th, 2023"
          seatsUsed={5}
          seatsTotal={20}
        />
        <PaymentMethods methods={paymentMethods} />
      </div>

      <InvoiceTable invoices={invoices} />
    </div>
  );
}
