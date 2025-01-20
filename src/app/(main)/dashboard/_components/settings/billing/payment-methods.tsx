import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { Plus } from "lucide-react"

interface PaymentMethod {
  type: "visa" | "mastercard"
  last4: string
  expiryDate: string
  isDefault?: boolean
}

interface PaymentMethodsProps {
  methods: PaymentMethod[]
}

export function PaymentMethods({ methods }: PaymentMethodsProps) {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="space-y-1">
          <h3 className="text-lg font-medium">Payment methods</h3>
          <p className="text-sm text-muted-foreground">
            Add and manage your payment methods using our secure payment system.
          </p>
        </div>

        <div className="space-y-4">
          {methods.map((method, index) => (
            <div key={index} className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-4">
                <div className="relative h-8 w-12">
                  <Image
                    src={method.type === "visa" ? "/visa.svg" : "/mastercard.svg"}
                    alt={method.type}
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <div className="font-medium">
                    {method.type === "visa" ? "Visa" : "MasterCard"} •••• {method.last4}
                  </div>
                  <div className="text-sm text-muted-foreground">Expires {method.expiryDate}</div>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                {method.isDefault ? "Default" : "Edit"}
              </Button>
            </div>
          ))}
        </div>

        <div className="flex justify-between">
          <Button variant="outline">Manage cards</Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add new card
          </Button>
        </div>
      </div>
    </Card>
  )
}

