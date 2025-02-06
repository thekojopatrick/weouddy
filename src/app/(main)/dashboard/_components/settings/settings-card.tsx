import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SettingsCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  actionButton?: React.ReactNode;
}

export function SettingsCard({
  title,
  description,
  children,
  actionButton,
}: SettingsCardProps) {
  return (
    <Card className="shadow-xs">
      <CardHeader>
        <div className="flex justify-between flex-wrap gap-3">
          <div className="heading">
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          {actionButton && actionButton}
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
