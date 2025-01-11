'use client';

import { useState } from 'react';
import { Button, LoadingButton } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { FeedbackCategory, FeedbackType } from '@prisma/client';

const FeedbackDialog = ({
  type = 'ACCOUNT_SETUP',
  metadata = {},
  title = '',
}) => {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState('');
  const [feedback, setFeedback] = useState('');
  const [category, setCategory] = useState('UI_UX');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!rating) {
      toast({
        title: 'Rating required',
        description: 'Please select a rating before submitting',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating: parseInt(rating),
          message: feedback,
          type: type as FeedbackType,
          category: category as FeedbackCategory, // Ensure this matches the Prisma enum
          metadata,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      toast({
        title: 'Thank you for your feedback!',
        description: 'Your response has been recorded.',
      });

      // Reset form and close dialog
      setRating('');
      setFeedback('');
      setCategory('UI_UX');
      setOpen(false);
    } catch (error) {
      toast({
        title: 'Something went wrong',
        description: 'Failed to submit feedback. Please try again.',
        variant: 'destructive',
      });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="fixed bottom-10 left-5 font-semibold rounded-full"
        >
          Feedback
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 p-0 [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b border-border px-6 py-4 text-base">
            Help us improve
          </DialogTitle>
        </DialogHeader>
        <div className="px-6 py-4">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <div>
                <fieldset className="space-y-4">
                  <legend className="text-sm font-semibold leading-none text-foreground">
                    {title}
                  </legend>
                  <RadioGroup
                    className="flex gap-0 -space-x-px rounded-lg shadow-sm shadow-black/5"
                    value={rating}
                    onValueChange={setRating}
                  >
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((number) => (
                      <label
                        key={number}
                        className="relative flex size-9 flex-1 cursor-pointer flex-col items-center justify-center gap-3 border border-input text-center text-sm outline-offset-2 transition-colors first:rounded-s-lg last:rounded-e-lg has-[[data-state=checked]]:z-10 has-[[data-disabled]]:cursor-not-allowed has-[[data-state=checked]]:border-ring has-[[data-state=checked]]:bg-accent has-[[data-disabled]]:opacity-50 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ring/70"
                      >
                        <RadioGroupItem
                          id={`radio-17-r${number}`}
                          value={number.toString()}
                          className="sr-only after:absolute after:inset-0"
                        />
                        {number}
                      </label>
                    ))}
                  </RadioGroup>
                </fieldset>
                <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                  <p>Very easy</p>
                  <p>Very difficult</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UI_UX">
                      User Interface & Experience
                    </SelectItem>
                    <SelectItem value="PERFORMANCE">
                      Performance
                    </SelectItem>
                    <SelectItem value="FUNCTIONALITY">
                      Functionality
                    </SelectItem>
                    <SelectItem value="CONTENT">Content</SelectItem>
                    <SelectItem value="TECHNICAL">
                      Technical
                    </SelectItem>
                    <SelectItem value="GENERAL">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="feedback">
                  Why did you give this rating?
                </Label>
                <Textarea
                  id="feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="How can we improve?"
                  aria-label="Send feedback"
                />
              </div>
            </div>
            <LoadingButton
              type="submit"
              className="w-full"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send feedback'}
            </LoadingButton>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;
