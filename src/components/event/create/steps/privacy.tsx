import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';

import { Button } from '@/components/ui/button';
import { Info, Loader2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface PrivacyStepProps {
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
  error?: string | null;
}

export function PrivacyStep({
  onSubmit,
  onBack,
  isSubmitting,
  error,
}: PrivacyStepProps) {
  return (
    <div className="space-y-6 pb-5 md:py-6">
      <div className="space-y-2">
        <h2 className="text-xl font-bold tracking-tight">
          Lastly, Privacy Settings
        </h2>
        <p className="text-muted-foreground text-sm">
          Choose who can see and join your event. You can always
          update these settings later if you change your mind
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <FormField
        name="isPublic"
        render={({ field }) => (
          <FormItem className="flex flex-row gap-1 items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel>Public Access</FormLabel>
              <FormDescription>
                Turn this on to let anyone discover, view, and join.
              </FormDescription>
            </div>
            <FormControl>
              <div className="flex gap-1 items-center">
                <span className="text-xs">No</span>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isSubmitting}
                />
                <span className="text-xs">Yes</span>
              </div>
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        name="requiresApproval"
        render={({ field }) => (
          <FormItem className="flex flex-row gap-1 items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="">
                Require approval for access
              </FormLabel>
              <FormDescription>
                Turn this on to approve each participant before they
                can enter.
              </FormDescription>
            </div>
            <FormControl>
              <div className="flex gap-1 items-center">
                <span className="text-xs">No</span>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isSubmitting}
                />
                <span className="text-xs">Yes</span>
              </div>
            </FormControl>
          </FormItem>
        )}
      />

      <div className="rounded-lg border border-border px-4 py-3">
        <p className="text-sm">
          <Info
            className="-mt-0.5 me-3 inline-flex text-blue-500"
            size={16}
            strokeWidth={2}
            aria-hidden="true"
          />
          If you don’t require approval, you can generate a PIN in
          Event Settings to share with participants.
        </p>
      </div>

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isSubmitting}
          className="rounded-full shadow-none"
        >
          Back
        </Button>
        <Button
          type="submit"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="rounded-full"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            'Finish'
          )}
        </Button>
      </div>
    </div>
  );
}
