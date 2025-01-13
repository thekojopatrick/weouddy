'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
} from '@/components/ui/drawer';
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
      <Drawer open={open} onOpenChange={onOpenChangeAction}>
        <DrawerContent className="">
          <DrawerTitle className="sr-only">Modal</DrawerTitle>
          <div className={cn('mx-auto w-full max-w-sm', className)}>
            {children}
          </div>
        </DrawerContent>
      </Drawer>
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
