'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Lock,
  MessageCircle,
  UserCheck,
  KeyRound,
  GlobeLock,
} from 'lucide-react';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { EventWithDetails } from '@/types/prisma.types';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AccessType } from '@prisma/client';
import { toast } from 'sonner';

type EventSettingsModalProps = {
  event: EventWithDetails;
  isOpen: boolean;
  onOpenChangeAction: (open: boolean) => void;
  onSaveSettingsAction: (
    settings: Partial<EventWithDetails>
  ) => Promise<void>;
};

export function EventSettingsModal({
  event,
  isOpen,
  onOpenChangeAction,
  onSaveSettingsAction,
}: EventSettingsModalProps) {
  const [settings, setSettings] = useState({
    isPrivate: event.isPrivate,
    requiresApproval: event.requiresApproval,
    allowComments: event.allowComments,
    allowLikes: event.allowLikes,
    allowChat: event.allowChat,
    allowPosts: event.allowPosts,
    accessType: event.accessType,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onSaveSettingsAction(settings);
      onOpenChangeAction(false);
      toast.success('Event settings updated successfully');
    } catch (error) {
      toast.error('Failed to update settings');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChangeAction}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Event Settings
          </DialogTitle>
          <DialogDescription>
            Customize your event&apos;s privacy and interaction
            settings
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Access Type */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GlobeLock className="size-4" />
              <span className="text-sm">Access Type</span>
            </div>
            <Select
              value={settings.accessType}
              onValueChange={(value) =>
                setSettings((prev) => ({
                  ...prev,
                  accessType: value as AccessType,
                }))
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Access" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DIRECT_PASS">
                  Direct Access
                </SelectItem>
                <SelectItem value="PIN_REQUIRED">
                  PIN Required
                </SelectItem>
                <SelectItem value="INVITE_ONLY">
                  Invite Only
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Privacy Settings */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="size-4" />
              <span className="text-sm">Private Event</span>
            </div>
            <Switch
              checked={settings.isPrivate}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({
                  ...prev,
                  isPrivate: checked,
                }))
              }
            />
          </div>

          {/* Approval Settings */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserCheck className="size-4" />
              <span className="text-sm">Requires Approval</span>
            </div>
            <Switch
              checked={settings.requiresApproval}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({
                  ...prev,
                  requiresApproval: checked,
                }))
              }
            />
          </div>

          {/* Interaction Settings */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="size-4" />
              <span className="text-sm">Allow Comments</span>
            </div>
            <Switch
              checked={settings.allowComments}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({
                  ...prev,
                  allowComments: checked,
                }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <KeyRound className="size-4" />
              <span className="text-sm">Allow Chat</span>
            </div>
            <Switch
              checked={settings.allowChat}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({
                  ...prev,
                  allowChat: checked,
                }))
              }
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => onOpenChangeAction(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
