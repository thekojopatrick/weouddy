import { Card } from "@/components/ui/card";
import {
  MoreVertical,
  Users,
  UserCheck,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface StatCardProps {
  title: string;
  value: number;
  type: "total" | "active" | "return" | "fake";
  users?: Array<{ name: string; image?: string }>;
}

export function EventStatCard({ title, value, type }: StatCardProps) {
  const icons = {
    total: Users,
    active: UserCheck,
    return: RotateCcw,
    fake: AlertTriangle,
  };

  const borders = {
    total: "border-purple-300",
    active: "border-emerald-300",
    return: "border-blue-300",
    fake: "border-red-300",
  };

  const colors = {
    total: "bg-purple-50",
    active: "bg-emerald-50",
    return: "bg-blue-50",
    fake: "bg-red-50",
  };

  const iconColors = {
    total: "text-purple-500",
    active: "text-emerald-500",
    return: "text-blue-500",
    fake: "text-red-500",
  };

  const Icon = icons[type];

  return (
    <Card className="p-4 shadow-none">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div
            className={`${colors[type]} p-2 rounded-lg border ${borders[type]}`}
          >
            <Icon className={`h-5 w-5 ${iconColors[type]}`} />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-transparent translate-x-2"
              >
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View details</DropdownMenuItem>
              <DropdownMenuItem>Export data</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div>
          <h3 className="text-sm font-medium">{title}</h3>
          <p className="text-xl font-bold">{value}</p>
        </div>
      </div>
    </Card>
  );
}
