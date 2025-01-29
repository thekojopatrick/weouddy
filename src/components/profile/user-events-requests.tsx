"use client";

import React, { useState, useEffect } from "react";
import { RequestCard } from "./event-request-card";

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

// Main requests list component
const RequestsList = () => {
  const [requests, setRequests] = useState<AttendeeRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch requests
  const fetchRequests = async () => {
    try {
      const response = await fetch("/api/events/requests");
      if (!response.ok) throw new Error("Failed to fetch requests");
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle status change
  const handleStatusChange = async (
    requestId: string,
    newStatus: RequestStatus,
  ) => {
    try {
      const response = await fetch("/api/events/requests/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      // Update local state
      setRequests((currentRequests) =>
        currentRequests.map((request) =>
          request.id === requestId
            ? { ...request, status: newStatus }
            : request,
        ),
      );

      // Remove approved requests from the list
      if (newStatus === "APPROVED") {
        setRequests((currentRequests) =>
          currentRequests.filter((request) => request.id !== requestId),
        );
      }
    } catch (error) {
      console.error("Error updating request status:", error);
      throw error;
    }
  };

  // Fetch requests on component mount
  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="p-4">
      {isLoading ? (
        <div className="text-center text-muted-foreground">
          Loading requests...
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center text-muted-foreground">
          No pending requests
        </div>
      ) : (
        requests.map((request) => (
          <RequestCard
            key={request.id}
            request={request}
            onStatusChange={handleStatusChange}
          />
        ))
      )}
    </div>
  );
};

export default RequestsList;
