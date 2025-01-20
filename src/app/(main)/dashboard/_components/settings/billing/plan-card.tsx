import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Plus } from 'lucide-react';

interface PlanCardProps {
  name: string;
  price: number;
  renewalDate: string;
  seatsUsed: number;
  seatsTotal: number;
}

export function PlanCard({
  name,
  price,
  renewalDate,
  seatsUsed,
  seatsTotal,
}: PlanCardProps) {
  return (
    <Card className="p-6 shadow-none">
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-semibold">{name}</h3>
              <Badge variant="secondary">Active</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Renews {renewalDate}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">${price}</div>
            <div className="text-sm text-muted-foreground">
              monthly
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <div>Seats</div>
            <div>
              {seatsUsed} of {seatsTotal} used
            </div>
          </div>
          <Progress value={(seatsUsed / seatsTotal) * 100} />
          <div className="flex justify-end flex-col items-end w-full">
            <Button
              variant="secondary"
              className="gap-2 shadow-none disabled rounded-xl"
            >
              <Plus className="h-4 w-4" />
              Manage seats
            </Button>
          </div>
        </div>

        <div className="flex gap-4">
          <Button variant="outline" className="flex-1 rounded-xl">
            Cancel subscription
          </Button>
          <Button className="flex-1 rounded-xl">Upgrade plan</Button>
        </div>
      </div>
    </Card>
  );
}
