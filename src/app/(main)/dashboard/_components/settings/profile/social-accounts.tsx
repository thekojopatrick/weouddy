'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';

export function SocialAccounts() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">Social accounts</h2>

      <div className="space-y-4">
        <div className="space-y-4">
          <Input
            placeholder="Link to social profile"
            className="shadow-xs text-sm py-3"
          />
          <Input
            placeholder="Link to social profile"
            className="shadow-xs text-sm py-3 "
          />
          <Input
            placeholder="Link to social profile"
            className="shadow-xs text-sm py-3"
          />
          <Button
            variant="outline"
            className="gap-2 shadow-xs border-dashed px-2 rounded-full"
          >
            <Plus className="w-4 h-4" />
            Add link
          </Button>
        </div>
      </div>
    </div>
  );
}
