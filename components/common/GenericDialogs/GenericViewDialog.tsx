// src/components/common/GenericDialogs/GenericViewDialog.tsx
'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import React from 'react';

// T is the type of the item being viewed (e.g., Patient, UserDoc, Hospital)
interface GenericViewDialogProps<T extends { id: string }> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: T | null; // The item data to display
  title: string; // Title for the dialog (e.g., "Patient", "Doctor")
  renderDetails: (item: T) => React.ReactNode; // Function to render item-specific details
}

export function GenericViewDialog<T extends { id: string }>({
  open,
  onOpenChange,
  item,
  title,
  renderDetails,
}: GenericViewDialogProps<T>) {
  // Don't render the dialog content if no item is provided, or if it's not open
  if (!item || !open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md"> {/* Adjust max-width as needed */}
        <DialogHeader>
          <DialogTitle>{title} Details</DialogTitle>
          <DialogDescription>View detailed information for this {title.toLowerCase()}.</DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-2">
          {renderDetails(item)} {/* Render the item-specific details here */}
        </div>
      </DialogContent>
    </Dialog>
  );
}
