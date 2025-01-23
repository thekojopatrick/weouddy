'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Drawer } from 'vaul';
import { useEffect, useState } from 'react';
import { DialogTitle } from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';

interface ResponsiveDialogProps {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

export function ResponsiveDialog({
  open,
  onOpenChangeAction,
  children,
  className,
}: ResponsiveDialogProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile) {
    return (
      <Drawer.Root open={open} onOpenChange={onOpenChangeAction}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-40 bg-[var(--backdrop)]" />
          <Drawer.Content className="bg-background z-50 flex flex-col fixed bottom-0 left-0 right-0 max-h-[96vh] rounded-t-[10px]">
            <Drawer.Title className="sr-only">Modal</Drawer.Title>
            <div className="mx-auto w-full max-w-sm">
              <Drawer.Handle className="mx-auto my-4 h-2 w-[100px] rounded-full bg-muted" />
              {children}
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent
        className={cn('sm:max-w-[425px]', className)}
        closebtnstyle="border p-1.5 rounded-full hover:border-zinc-600"
      >
        <DialogTitle className="sr-only">Modal</DialogTitle>
        {children}
      </DialogContent>
    </Dialog>
  );
}
