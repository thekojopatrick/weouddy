"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, RefreshCcw } from "lucide-react";
import Image from "next/image";

interface ServiceCardProps {
  images: string[];
  title: string;
  price: number;
  description: string;
  deliveryTime: string;
  revisions: string;
  provider: {
    name: string;
    image: string;
    location: string;
    responseTime: string;
    verificationCount: number;
  };
}

export default function ServiceCard({
  images,
  title,
  price,
  description,
  deliveryTime,
  revisions,
  provider,
}: ServiceCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-[2/1] w-full">
        <div className="grid grid-cols-3 gap-2 p-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-lg overflow-hidden"
            >
              <Image
                src={image || "/placeholder.svg"}
                alt={`${title} preview ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
      <CardContent className="space-y-4 p-6">
        <h3 className="text-2xl font-semibold">{title}</h3>
        <div className="flex items-baseline gap-1">
          <span className="text-blue-600">From</span>
          <span className="text-blue-600 text-2xl font-semibold">
            US${price.toLocaleString()}
          </span>
        </div>
        <p className="text-muted-foreground">{description}</p>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{deliveryTime}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <RefreshCcw className="h-4 w-4 text-muted-foreground" />
            <span>{revisions}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t">
          <div className="relative h-10 w-10">
            <Image
              src={provider.image || "/placeholder.svg"}
              alt={provider.name}
              fill
              className="rounded-full object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold">{provider.name}</h4>
              <Badge variant="secondary" className="rounded-full">
                {provider.verificationCount}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">{provider.location}</span>
              <span className="text-green-600">{provider.responseTime}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
