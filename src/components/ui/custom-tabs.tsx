import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";

export interface TabItem {
  value: string;
  label: string;
  content: React.ReactNode;
  icon?: LucideIcon;
}

interface CustomTabsProps {
  items: TabItem[];
  variant?:
    | "pill"
    | "underline"
    | "icon"
    | "pill-leading-icon"
    | "pill-trailing-icon"
    | "underline-leading-icon"
    | "underline-trailing-icon";
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

export function CustomTabs({
  items,
  variant = "pill",
  defaultValue = items[0]?.value,
  onValueChange,
  className,
}: CustomTabsProps) {
  const getTabListClassName = () => {
    switch (variant) {
      case "pill":
      case "pill-leading-icon":
      case "pill-trailing-icon":
        return "gap-1 bg-transparent";
      case "underline":
      case "underline-leading-icon":
      case "underline-trailing-icon":
        return "h-auto gap-2 rounded-none border-b border-border bg-transparent px-0 py-1 text-foreground grid w-full grid-cols-3 md:grid-cols-4";
      case "icon":
        return "h-auto rounded-none border-b border-border bg-transparent p-0";
      default:
        return "";
    }
  };

  const getTabTriggerClassName = () => {
    switch (variant) {
      case "pill":
      case "pill-leading-icon":
      case "pill-trailing-icon":
        return "rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none";
      case "underline":
      case "underline-leading-icon":
      case "underline-trailing-icon":
        return "relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent";
      case "icon":
        return "relative flex-col rounded-none px-4 py-2 text-xs after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary";
      default:
        return "";
    }
  };

  const renderTabContent = (item: TabItem) => {
    const IconComponent = item.icon;
    const [label, count] = item.label.split(" ");

    switch (variant) {
      case "pill-leading-icon":
      case "underline-leading-icon":
        return (
          <>
            {IconComponent && (
              <IconComponent className="mr-2 h-4 w-4" aria-hidden="true" />
            )}
            {label}{" "}
            {count && (
              <span className="ml-2 text-muted-foreground">{count}</span>
            )}
          </>
        );
      case "pill-trailing-icon":
      case "underline-trailing-icon":
        return (
          <>
            {label}{" "}
            {count && (
              <span className="ml-2 text-muted-foreground">{count}</span>
            )}
            {IconComponent && (
              <IconComponent className="ml-2 h-4 w-4" aria-hidden="true" />
            )}
          </>
        );
      case "icon":
        return (
          <>
            {IconComponent && (
              <IconComponent
                className="mb-1.5 h-4 w-4 opacity-60"
                aria-hidden="true"
              />
            )}
            {label}
          </>
        );
      default:
        return (
          <>
            {label}{" "}
            {count && (
              <span className="ml-2 text-muted-foreground">{count}</span>
            )}
          </>
        );
    }
  };

  return (
    <Tabs
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      className={cn("container mx-auto px-4 py-6", className)}
    >
      <TabsList className={cn(getTabListClassName())}>
        {items.map((item) => (
          <TabsTrigger
            key={item.value}
            value={item.value}
            className={cn(
              getTabTriggerClassName(),
              (variant === "pill-leading-icon" ||
                variant === "pill-trailing-icon" ||
                variant === "underline-leading-icon" ||
                variant === "underline-trailing-icon") &&
                "flex items-center",
            )}
          >
            {renderTabContent(item)}
          </TabsTrigger>
        ))}
      </TabsList>
      {items.map((item) => (
        <TabsContent key={item.value} value={item.value}>
          {item.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
