import React from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const ConnectAccounts = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Connect accounts</h3>
      <p className="text-sm text-muted-foreground">
        Access your Workspaces with any email address, or by
        connecting an account.
      </p>

      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-4 rounded-lg border px-3 py-1.5">
          <Image
            src="/brand/google.svg"
            alt="Google"
            width={24}
            height={24}
            className="rounded"
          />
          <div className="flex-1 font-semibold">Google</div>
          <Button
            variant="ghost"
            className="text-destructive text-sm hover:text-destructive hover:bg-destructive/10"
          >
            Remove
          </Button>
        </div>

        <div className="flex items-center gap-4 rounded-lg border px-3 py-1.5">
          <Image
            src="/brand/slack.svg"
            alt="Slack"
            width={24}
            height={24}
            className="rounded"
          />
          <div className="flex-1 font-semibold">Slack</div>
          <Button
            variant="ghost"
            className="text-primary text-sm hover:text-primary hover:bg-primary/10"
          >
            Connect
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConnectAccounts;
