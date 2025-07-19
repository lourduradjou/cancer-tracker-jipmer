"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import Loading from "@/components/ui/loading";

export default function RootPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let didRedirect = false;

    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        didRedirect = true;
        router.push("/login");
        return;
      }

      try {
        const email = user.email!.trim().toLowerCase();
        const q = query(collection(db, "users"), where("email", "==", email));
        const snap = await getDocs(q);

        if (snap.empty) {
          didRedirect = true;
          router.push("/login");
          return;
        }

        const userDoc = snap.docs[0].data();
        const role = userDoc.role;

        if (role === "doctor") {
          didRedirect = true;
          router.push("/doctor");
        } else if (role === "asha") {
          didRedirect = true;
          router.push("/asha");
        } else if (role === "nurse") {
          didRedirect = true;
          router.push("/nurse");
        } else {
          didRedirect = true;
          router.push("/login");
        }
      } catch (error) {
        console.error("Error checking user:", error);
        didRedirect = true;
        router.push("/login");
      } finally {
        if (!didRedirect) {
          setChecking(false);
        }
      }
    });

    return () => unsub();
  }, [router]);

  return (
    <main className="flex flex-col items-center justify-center h-screen">
      {checking && (
        <>
          <Loading />
          <p className="text-gray-600 mt-4">Checking user status...</p>
        </>
      )}
    </main>
  );
}
