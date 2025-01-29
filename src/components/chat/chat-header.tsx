import { FC } from "react";
import { CardHeader } from "@/components/ui/card";
import { DialogTitle } from "@radix-ui/react-dialog";

interface ChatHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export const ChatHeader: FC<ChatHeaderProps> = ({
  title,
  subtitle,
  className,
}) => {
  return (
    <CardHeader className={`px-0 py-0 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-base font-medium text-primary-foreground">
            {title.charAt(0)}
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-background" />
        </div>
        <div>
          <DialogTitle className="text-sm font-semibold">{title}</DialogTitle>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
    </CardHeader>
  );
};
