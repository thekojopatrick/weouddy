import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import React, { useState } from 'react';

import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

type ReportEventModalProps = {
  eventId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onReport: (reason: string) => void;
};

export function ReportEventModal({
  isOpen,
  onOpenChange,
  onReport,
}: ReportEventModalProps) {
  const [reportReason, setReportReason] = useState('');

  const handleSubmitReport = () => {
    if (reportReason.trim()) {
      onReport(reportReason);
      onOpenChange(false);
    }
  };

  const reportReasons = [
    'Inappropriate Content',
    'Spam',
    'Harassment',
    'Other',
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="text-red-500 h-6 w-6" />
            Report Event
          </DialogTitle>
          <DialogDescription>
            Please provide a reason for reporting this event.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {reportReasons.map((reason) => (
              <Button
                key={reason}
                variant="outline"
                size="sm"
                onClick={() => setReportReason(reason)}
                className={
                  reportReason === reason
                    ? 'bg-primary text-primary-foreground'
                    : ''
                }
              >
                {reason}
              </Button>
            ))}
          </div>

          <Textarea
            placeholder="Additional details (optional)"
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="mt-4 flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleSubmitReport}
            disabled={!reportReason.trim()}
          >
            Submit Report
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
