// src/hooks/useFirestoreCollection.ts
import { useQuery } from '@tanstack/react-query';
import { collection, query, getDocs, Query, QueryConstraint } from 'firebase/firestore';
import { db } from '@/firebase';

interface UseFirestoreCollectionOptions {
  collectionName: string;
  queryConstraints?: QueryConstraint[]; // Array of where, orderBy, limit etc.
  enabled?: boolean;
  staleTime?: number;
  // Add a way to pass a unique identifier to the queryKey if constraints alone aren't enough
  // For example, if fetching patients for a specific doctor, the doctor's ID should be part of the key
  queryIdentifier?: string; // e.g., orgId, ashaEmail, userId
}

export function useFirestoreCollection<T>(options: UseFirestoreCollectionOptions) {
  const {
    collectionName,
    queryConstraints = [],
    enabled = true,
    staleTime = 60 * 1000,
    queryIdentifier, // Use this in the queryKey
  } = options;

  // Construct a more robust queryKey including collection name, identifier, and simplified constraints
  const queryKey = [
    collectionName,
    queryIdentifier, // Include the identifier
    ...queryConstraints.map(c => {
      // Simplistic representation of constraints for queryKey.
      // For complex queries, you might need a more sophisticated serialization.
      if ('field' in c && 'op' in c && 'value' in c) {
        return `${c.field}:${c.op}:${c.value}`;
      }
      return c.type; // Fallback for other constraint types
    })
  ].filter(Boolean); // Filter out null/undefined parts

  return useQuery<T[], Error>({
    queryKey: queryKey,
    queryFn: async () => {
      const colRef = collection(db, collectionName);
      const q = query(colRef, ...queryConstraints);
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data(),
      } as T));
    },
    enabled: enabled,
    staleTime: staleTime,
  });
}
