'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export function PasswordForm() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-medium">Password</h2>
        <div
          className="rounded-full bg-muted p-1"
          title="Password information"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="current">Current password</Label>
          <Input
            id="current"
            type="password"
            placeholder="Enter current password"
            className="shadow-sm text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="new">New password</Label>
          <Input
            id="new"
            type="password"
            placeholder="Enter new password"
            className="shadow-sm text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm">Repeat new password</Label>
          <Input
            id="confirm"
            type="password"
            placeholder="Repeat new password"
            className="shadow-sm text-sm"
          />
        </div>

        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">Level:</div>
          <div className="flex gap-1">
            <div className="h-2 w-16 rounded bg-primary" />
            <div className="h-2 w-16 rounded bg-primary" />
            <div className="h-2 w-16 rounded bg-primary" />
            <div className="h-2 w-16 rounded bg-muted" />
            <div className="h-2 w-16 rounded bg-muted" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button className="rounded-lg shadow-sm">Change</Button>
          <Link
            href="#"
            className="text-sm text-primary font-semibold hover:underline"
          >
            I forgot my password
          </Link>
        </div>
      </div>
    </div>
  );
}
