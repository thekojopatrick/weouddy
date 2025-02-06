"use client";

import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Check, X, RotateCcw } from "lucide-react";
import { toast } from "sonner";

// Types for our components
type RequestStatus = "PENDING" | "APPROVED" | "DENIED";

interface AttendeeRequest {
  id: string;
  userId: string;
  eventId: string;
  status: RequestStatus;
  user: {
    name: string;
    username: string;
    avatarUrl: string;
  };
  event: {
    name: string;
  };
}

// Individual request card component
export const RequestCard = ({
  request,
  onStatusChange,
}: {
  request: AttendeeRequest;
  onStatusChange: (requestId: string, newStatus: RequestStatus) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusChange = async (newStatus: RequestStatus) => {
    setIsLoading(true);
    try {
      await onStatusChange(request.id, newStatus);
      toast.success(`Request ${newStatus.toLowerCase()} successfully`);
    } catch (error) {
      console.log(error);

      toast.error("Failed to update request status");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg mb-4 bg-card">
      <div className="flex items-center gap-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={request.user.avatarUrl} alt={request.user.name} />
          <AvatarFallback>{request.user.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h4 className="font-medium">{request.user.name}</h4>
          <p className="text-sm text-muted-foreground">
            @{request.user.username}
          </p>
          <p className="text-sm text-muted-foreground">
            Event: {request.event.name}
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        {request.status === "PENDING" && (
          <>
            <Button
              size="sm"
              variant="ghost"
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={() => handleStatusChange("DENIED")}
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-green-500 hover:text-green-600 hover:bg-green-50"
              onClick={() => handleStatusChange("APPROVED")}
              disabled={isLoading}
            >
              <Check className="h-4 w-4" />
            </Button>
          </>
        )}
        {request.status === "DENIED" && (
          <Button
            size="sm"
            variant="ghost"
            className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
            onClick={() => handleStatusChange("PENDING")}
            disabled={isLoading}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
