'use client';

import React, { ReactNode } from 'react';
import { Drawer } from 'vaul';
import { cn } from '@/lib/utils';

interface CustomDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  trigger?: ReactNode;
  title?: string;
  headerContent?: ReactNode;
  content: ReactNode;
  footerContent?: ReactNode;
  side?: boolean;
}

export default function CustomDrawer({
  isOpen,
  onClose,
  trigger,
  title,
  headerContent,
  content,
  footerContent,
  side = false,
}: CustomDrawerProps) {
  const rootProps = {
    open: isOpen,
    onOpenChange: onClose,
    ...(side && { direction: 'right' as const }),
  };

  const contentStyles = side
    ? {
        className:
          'right-2 top-2 bottom-2 fixed z-50 outline-hidden w-[400px] flex rounded-xl!',
        style: {
          '--initial-transform': 'calc(100% + 8px)',
        } as React.CSSProperties,
      }
    : {
        className: cn(
          'bg-background flex flex-col mt-24 outline-hidden',
          'h-fit fixed bottom-0 left-0 right-0 z-50',
          'rounded-t-[10px]'
        ),
      };

  return (
    <Drawer.Root {...rootProps}>
      {trigger && <Drawer.Trigger asChild>{trigger}</Drawer.Trigger>}
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
        <Drawer.Content {...contentStyles}>
          {side ? (
            <div className="bg-background h-full w-full grow overflow-hidden rounded-[16px] flex flex-col">
              {headerContent ? (
                <div className="px-6 py-4 border-b">
                  {headerContent}
                </div>
              ) : (
                title && (
                  <div className="px-6 py-4 border-b">
                    <Drawer.Title className="text-lg font-semibold">
                      {title}
                    </Drawer.Title>
                  </div>
                )
              )}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {content}
              </div>
              {footerContent && (
                <div className="border-t px-6 py-4 bg-background">
                  {footerContent}
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
              {headerContent ? (
                <div className="px-6 py-4 border-b">
                  {headerContent}
                </div>
              ) : (
                title && (
                  <div className="px-6 py-4 border-b">
                    <Drawer.Title className="text-lg font-semibold">
                      {title}
                    </Drawer.Title>
                  </div>
                )
              )}
              <div className="flex-1 overflow-y-auto">{content}</div>
              {footerContent && (
                <div className="border-t px-6 py-4 bg-background">
                  {footerContent}
                </div>
              )}
            </>
          )}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
