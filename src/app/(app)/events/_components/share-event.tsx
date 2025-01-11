import React from 'react';
import { Check, Copy } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  RiFacebookFill,
  RiLinksFill,
  RiMailLine,
  RiShareFill,
  RiTwitterXFill,
  RiWhatsappFill,
} from '@remixicon/react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { SharePlatform } from '@/types/enums';

interface ShareEventPopoverProp {
  inputRef: React.Ref<HTMLInputElement> | null;
  shareUrl: string;
  copied: boolean;
  handleCopy: () => void;
  handleSocialShare: (platform: SharePlatform) => void;
}

const ShareEventPopover: React.FC<ShareEventPopoverProp> = ({
  inputRef,
  shareUrl,
  handleCopy,
  copied,
  handleSocialShare,
}) => {
  const isSmallDevice = useMediaQuery(
    'only screen and (max-width : 768px)'
  );

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">
            <RiShareFill
              size={16}
              strokeWidth={2}
              aria-hidden="true"
            />
            {!isSmallDevice && <span>Share</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72">
          <div className="flex flex-col gap-3 text-center">
            <div className="text-sm font-medium">Share event</div>
            <div className="flex flex-wrap justify-center gap-2">
              <Button
                size="icon"
                variant="outline"
                aria-label="Copy embed code"
                onClick={() => handleCopy()}
              >
                <RiLinksFill
                  size={16}
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </Button>
              <Button
                size="icon"
                variant="outline"
                aria-label="Share on WhatsApp"
                onClick={() =>
                  handleSocialShare(SharePlatform.WhatsApp)
                }
                className="bg-[#25D366] hover:bg-[#25D366]/90 text-white hover:text-white border-[#25D366]"
              >
                <RiWhatsappFill
                  size={16}
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </Button>
              <Button
                size="icon"
                variant="outline"
                aria-label="Share on Twitter"
                onClick={() =>
                  handleSocialShare(SharePlatform.Twitter)
                }
              >
                <RiTwitterXFill
                  size={16}
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </Button>
              <Button
                size="icon"
                variant="outline"
                aria-label="Share on Facebook"
                onClick={() =>
                  handleSocialShare(SharePlatform.Facebook)
                }
              >
                <RiFacebookFill
                  size={16}
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </Button>
              <Button
                size="icon"
                variant="outline"
                aria-label="Share via email"
                onClick={() => handleSocialShare(SharePlatform.Email)}
              >
                <RiMailLine
                  size={16}
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </Button>
            </div>
            <div className="space-y-2">
              <div className="relative">
                <Input
                  ref={inputRef}
                  className="pe-9"
                  type="text"
                  defaultValue={shareUrl}
                  aria-label="Share link"
                  readOnly
                />
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={handleCopy}
                        className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg border border-transparent text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed"
                        aria-label={
                          copied ? 'Copied' : 'Copy to clipboard'
                        }
                        disabled={copied}
                      >
                        <div
                          className={cn(
                            'transition-all',
                            copied
                              ? 'scale-100 opacity-100'
                              : 'scale-0 opacity-0'
                          )}
                        >
                          <Check
                            className="stroke-emerald-500"
                            size={16}
                            strokeWidth={2}
                            aria-hidden="true"
                          />
                        </div>
                        <div
                          className={cn(
                            'absolute transition-all',
                            copied
                              ? 'scale-0 opacity-0'
                              : 'scale-100 opacity-100'
                          )}
                        >
                          <Copy
                            size={16}
                            strokeWidth={2}
                            aria-hidden="true"
                          />
                        </div>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="px-2 py-1 text-xs">
                      Copy to clipboard
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default ShareEventPopover;
