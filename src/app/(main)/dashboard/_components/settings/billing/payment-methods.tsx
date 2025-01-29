import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Plus } from "lucide-react";

interface PaymentMethod {
  type: "visa" | "mastercard";
  last4: string;
  expiryDate: string;
  isDefault?: boolean;
}

interface PaymentMethodsProps {
  methods: PaymentMethod[];
}

export function PaymentMethods({ methods }: PaymentMethodsProps) {
  return (
    <Card className="p-6 shadow-none">
      <div className="space-y-6">
        <div className="space-y-1">
          <h3 className="text-lg font-medium">Payment methods</h3>
          <p className="text-sm text-muted-foreground">
            Add and manage your payment methods using our secure payment system.
          </p>
        </div>

        <div className="space-y-4">
          {methods.map((method, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div className="flex items-center gap-4">
                <div className="relative h-8 w-12">
                  <Image
                    src={
                      method.type === "visa"
                        ? "/brand/visa.svg"
                        : "/brand/mastercard.svg"
                    }
                    alt={method.type}
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <div className="font-medium">
                    {method.type === "visa" ? "Visa" : "MasterCard"} ••••{" "}
                    {method.last4}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Expires {method.expiryDate}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-xl"
                  disabled={method.isDefault}
                >
                  {method.isDefault ? "Default" : "Set as default"}
                </Button>
                <Button variant="ghost" size="sm" className="rounded-xl">
                  Edit
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between">
          <Button variant="outline" className="rounded-xl">
            Manage cards
          </Button>
          <Button className="gap-2 rounded-xl">
            <Plus className="h-4 w-4" />
            Add new card
          </Button>
        </div>
      </div>
    </Card>
  );
}
