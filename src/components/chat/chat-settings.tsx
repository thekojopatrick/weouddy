'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { MessageSquare, Clock, Shield } from 'lucide-react';
import type { ChatSettings } from '@/types/chat';
import { updateChatSettings } from '@/server/actions/chat/mutations';

interface ChatSettingsProps {
  roomId: string;
  initialSettings: ChatSettings;
}

export function ChatSettings({
  roomId,
  initialSettings,
}: ChatSettingsProps) {
  const [settings, setSettings] = useState(initialSettings);

  const handleSettingChange = async (
    key: keyof ChatSettings,
    value: boolean | number
  ) => {
    try {
      await updateChatSettings(roomId, { [key]: value });
      setSettings((prev) => ({ ...prev, [key]: value }));
    } catch (error) {
      console.error('Failed to update chat settings:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Chat Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="font-medium">Enable Chat</div>
            <div className="text-sm text-muted-foreground">
              Allow users to send messages
            </div>
          </div>
          <Switch
            checked={settings.isEnabled}
            onCheckedChange={(checked) =>
              handleSettingChange('isEnabled', checked)
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="font-medium">Guest Messages</div>
            <div className="text-sm text-muted-foreground">
              Allow guests to participate in chat
            </div>
          </div>
          <Switch
            checked={settings.allowGuestMessages}
            onCheckedChange={(checked) =>
              handleSettingChange('allowGuestMessages', checked)
            }
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <div className="font-medium">Slow Mode</div>
          </div>
          <div className="space-y-2">
            <Switch
              checked={settings.slowMode}
              onCheckedChange={(checked) =>
                handleSettingChange('slowMode', checked)
              }
            />
            {settings.slowMode && (
              <Slider
                value={[settings.slowModeInterval]}
                onValueChange={([value]) =>
                  handleSettingChange('slowModeInterval', value)
                }
                min={5}
                max={300}
                step={5}
                className="mt-2"
              />
            )}
            <div className="text-sm text-muted-foreground">
              {settings.slowMode
                ? `Users must wait ${settings.slowModeInterval} seconds between messages`
                : 'No delay between messages'}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <div className="font-medium">Message Moderation</div>
            </div>
            <div className="text-sm text-muted-foreground">
              Review messages before they appear
            </div>
          </div>
          <Switch
            checked={settings.requireModeration}
            onCheckedChange={(checked) =>
              handleSettingChange('requireModeration', checked)
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
