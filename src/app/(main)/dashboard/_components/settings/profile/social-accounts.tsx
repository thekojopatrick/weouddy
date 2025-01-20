'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import Image from 'next/image';

export function SocialAccounts() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">Social accounts</h2>

      <div className="space-y-4">
        <div className="space-y-4">
          <Input placeholder="Link to social profile" />
          <Input placeholder="Link to social profile" />
          <Input placeholder="Link to social profile" />
          <Button variant="outline" className="gap-2">
            <Plus className="w-4 h-4" />
            Add link
          </Button>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Connect accounts</h3>
          <p className="text-sm text-muted-foreground">
            Access your Workspaces with any email address, or by
            connecting an account.
          </p>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-4 rounded-lg border p-4">
              <Image
                src="/brand/google.svg"
                alt="Google"
                width={24}
                height={24}
                className="rounded"
              />
              <div className="flex-1">Google</div>
              <Button
                variant="ghost"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                Remove
              </Button>
            </div>

            <div className="flex items-center gap-4 rounded-lg border p-4">
              <Image
                src="/brand/slack.svg"
                alt="Slack"
                width={24}
                height={24}
                className="rounded"
              />
              <div className="flex-1">Slack</div>
              <Button
                variant="ghost"
                className="text-primary hover:text-primary hover:bg-primary/10"
              >
                Connect
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
