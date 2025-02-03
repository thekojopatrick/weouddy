'use client';

import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ResponsiveDialog } from '@/components/ui/responsive-dialog';
import { Input } from '@/components/ui/input';
import { ThemeSelector } from './cover-theme-selector';
import { coverThemes } from './cover-themes';
import PlaceholderImage from '@/components/placeholder-image';

interface CreateCoverModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectCover: (cover: string) => void;
}

export function CreateCoverModal({
  open,
  onOpenChange,
  onSelectCover,
}: CreateCoverModalProps) {
  const [name, setName] = React.useState('BlacVolta');
  const [generatedImageUrl, setGeneratedImageUrl] = React.useState<
    string | null
  >(null);
  const [selectedTheme, setSelectedTheme] = React.useState(
    coverThemes[0]
  );

  const handleSave = () => {
    // Handle save logic here
    if (generatedImageUrl) {
      onSelectCover(generatedImageUrl);
      onOpenChange(false);
    }
  };

  return (
    <ResponsiveDialog open={open} onOpenChangeAction={onOpenChange}>
      <div className="pb-4 sm:pb-0 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create cover</DialogTitle>
          <DialogDescription>
            Create your temporary cover, you can change later
          </DialogDescription>
        </DialogHeader>

        {/* Preview Area */}
        <div className="py-4 aspect-square">
          <PlaceholderImage
            title="Outdoor party"
            name={name}
            width={800}
            height={600}
            backgroundColor={selectedTheme.backgroundColor}
            textColor={selectedTheme.textColor}
            logoUrl="/brand/wordmark-black.png"
            onImageGenerated={(imageUrl) =>
              setGeneratedImageUrl(imageUrl)
            }
          />
        </div>

        {/* Theme Selector */}
        <ThemeSelector
          themes={coverThemes}
          selectedTheme={selectedTheme}
          onSelectTheme={setSelectedTheme}
        />

        {/* Customize Name Input */}
        <div className="space-y-2 mt-4">
          <label htmlFor="name" className="text-sm font-medium">
            Customize Name
          </label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-10"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-between mt-4 ">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-full"
          >
            Back
          </Button>
          <Button
            onClick={handleSave}
            disabled={!generatedImageUrl}
            className="rounded-full"
          >
            Save
          </Button>
        </div>
      </div>
    </ResponsiveDialog>
  );
}
