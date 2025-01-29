import { CalendarRange } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function EventNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-4">
          <div className="flex justify-center">
            <CalendarRange
              strokeWidth={1}
              className="h-12 w-12 text-gray-400"
            />
          </div>
          <h1 className="text-xl font-bold text-gray-900">No Event Found</h1>
          <p className="text-gray-600">
            We couldn&apos;t find any event matching your search. Please check
            the link again or event might have been deleted
          </p>
        </div>

        <div className="space-y-4 sm:space-y-0 sm:flex sm:space-x-4 justify-center">
          <Button variant={"default"} className="rounded-full sm:w-auto">
            <Link href={"/events"}>Browse All Events</Link>
          </Button>
          <Button
            variant={"secondary"}
            className="rounded-full sm:w-auto"
            asChild
          >
            <Link href={"/contact"}>Contact Support</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
