"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { auth, db } from "@/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { ModeToggle } from "../ui/toggle";

export default function Navbar() {
  const [username, setUsername] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUsername = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(
        collection(db, "users"),
        where("email", "==", user.email!.trim().toLowerCase())
      );
      const snap = await getDocs(q);

      if (!snap.empty) {
        const userData = snap.docs[0].data();
        setUsername(userData.name || user.email);
      }
    };

    fetchUsername();
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <nav className="bg-background border-b shadow flex items-center justify-between px-4 py-3 md:px-8">
      <Link href="/" className="text-2xl font-bold text-green-600">
        Compass
      </Link>

      <div className="md:hidden">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-gray-600 focus:outline-none"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <div
        className={`${
          menuOpen ? "block" : "hidden"
        } w-full md:flex md:items-center md:w-auto md:space-x-4`}
      >
        <ModeToggle />
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
          {username && (
            <span className="text-gray-700 font-medium mb-2 md:mb-0">
              Hello, {username}
            </span>
          )}

          <Button
            variant="destructive"
            onClick={handleSignOut}
            className="w-full md:w-auto"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </nav>
  );
}
