// src/components/common/GenericDialogs/GenericDeleteDialog.tsx
'use client';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useGenericCRUD } from '@/hooks/useGenericCRUD'; // Your generic CRUD hook
import React from 'react';

// T is the type of the item being deleted (e.g., Patient, UserDoc, Hospital)
interface GenericDeleteDialogProps<T extends { id: string; name?: string }> {
  itemToDelete: T | null; // The item data to confirm deletion for
  onClose: () => void; // Function to close the dialog
  collectionName: string; // The Firestore collection name
  queryKeyToInvalidate: any[]; // The React Query key to invalidate after mutation
  itemNameField?: keyof T; // Optional: field to use for displaying the item's name (defaults to 'name')
}

export function GenericDeleteDialog<T extends { id: string; name?: string }>(
  {
    itemToDelete,
    onClose,
    collectionName,
    queryKeyToInvalidate,
    itemNameField = 'name' as keyof T,
  }: GenericDeleteDialogProps<T>
) {
  // Use the delete mutation from your generic CRUD hook
  const { deleteMutation } = useGenericCRUD<any, any, T>({ collectionName, queryKeyToInvalidate });
  const isLoading = deleteMutation.isPending;

  const handleDelete = async () => {
    if (itemToDelete?.id) {
      await deleteMutation.mutateAsync(itemToDelete.id); // Execute the delete mutation
    }
    onClose(); // Close the dialog whether deletion succeeded or failed (mutation handles toast)
  };

  // Only render the dialog content if there's an item to delete and it's open
  if (!itemToDelete || !deleteMutation.isIdle && !deleteMutation.isPending && !deleteMutation.isError) {
    // If mutation is in success state, dialog should probably close immediately
    return null;
  }

  const nameToDisplay = itemToDelete[itemNameField] || `selected ${collectionName.slice(0, -1)}`;

  return (
    <Dialog open={!!itemToDelete} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{nameToDisplay}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
            {isLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
