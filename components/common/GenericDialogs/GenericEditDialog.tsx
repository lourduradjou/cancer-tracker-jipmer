// src/components/common/GenericDialogs/GenericEditDialog.tsx
'use client';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useForm, UseFormReturn } from 'react-hook-form'; // Import UseFormReturn
import { zodResolver } from '@hookform/resolvers/zod';
import { ZodObject, ZodRawShape } from 'zod'; // Import Zod types
import React, { useEffect } from 'react';
import { useGenericCRUD } from '@/hooks/useGenericCRUD'; // Your generic CRUD hook

// T is the type of the data being edited/added (e.g., Patient, UserDoc, Hospital)
// TFormInputs is the Zod-inferred type for the form fields (e.g., PatientFormInputs)
interface GenericEditDialogProps<T extends { id?: string }, TFormInputs extends { id?: string }> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemToEdit?: T | null; // The item data for editing (optional for "add" mode)
  title: string; // Title for the dialog (e.g., "Patient", "Doctor")
  schema: ZodObject<ZodRawShape>; // The Zod schema for form validation
  collectionName: string; // The Firestore collection name
  queryKeyToInvalidate: any[]; // The React Query key to invalidate after mutation
  renderFormFields: (
    register: UseFormReturn<TFormInputs>['register'],
    errors: UseFormReturn<TFormInputs>['formState']['errors'],
    item?: TFormInputs | null // Pass the item data to renderFormFields for default values/conditional rendering
  ) => React.ReactNode; // Function to render item-specific form inputs
}

export function GenericEditDialog<T extends { id?: string }, TFormInputs extends { id?: string }>(
  {
    open,
    onOpenChange,
    itemToEdit,
    title,
    schema,
    collectionName,
    queryKeyToInvalidate,
    renderFormFields,
  }: GenericEditDialogProps<T, TFormInputs>
) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<TFormInputs>({
    resolver: zodResolver(schema),
    // Set default values for edit mode. If itemToEdit is null (add mode), default values will be schema defaults.
    defaultValues: itemToEdit as TFormInputs || undefined,
  });

  // Reset form when dialog opens or itemToEdit changes
  useEffect(() => {
    // Only reset if the dialog is open or if the item being edited has actually changed
    if (open) { // Reset whenever it opens
        reset(itemToEdit as TFormInputs || undefined);
    }
  }, [itemToEdit, open, reset]);


  const { addMutation, updateMutation } = useGenericCRUD<TFormInputs, Partial<TFormInputs>, T>({ collectionName, queryKeyToInvalidate });

  const isUpdating = !!itemToEdit?.id; // Check if an item ID exists for update mode
  const isLoading = addMutation.isPending || updateMutation.isPending;

  const onSubmit = async (data: TFormInputs) => {
    try {
      if (isUpdating && itemToEdit?.id) {
        // Exclude 'id' from data sent to Firestore updateDoc
        const { id, ...updateData } = data;
        await updateMutation.mutateAsync({ id: itemToEdit.id, data: updateData });
      } else {
        await addMutation.mutateAsync(data);
      }
      onOpenChange(false); // Close dialog on successful operation
      reset(); // Reset form after successful submission
    } catch (err) {
      // Errors are handled by useGenericCRUD, but catch here if specific dialog-level logic is needed
      console.error(`Error during ${isUpdating ? 'update' : 'add'}:`, err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl"> {/* Adjust max-width as needed */}
        <DialogHeader>
          <DialogTitle>{isUpdating ? `Edit ${title}` : `Add New ${title}`}</DialogTitle>
          <DialogDescription>
            {isUpdating ? `Update details for this ${title.toLowerCase()}.` : `Fill in the details for the new ${title.toLowerCase()}.`}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            {renderFormFields(register, errors, itemToEdit as TFormInputs)} {/* Pass itemToEdit (or a typed version) to renderFormFields */}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (isUpdating ? 'Updating...' : 'Adding...') : (isUpdating ? 'Save Changes' : 'Add')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
