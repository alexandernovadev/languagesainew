import { useEffect, useState } from "react";
import { AvatarFallback } from "./avatar";
import type { User } from "@/models/User";

export function AvatarFallbackClient({ user }: { user: User | null }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Renderiza el SVG de usuario como placeholder
    return (
      <AvatarFallback>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-user"
        >
          <circle cx="12" cy="8" r="4" />
          <path d="M6 20c0-2.2 3.6-4 6-4s6 1.8 6 4" />
        </svg>
      </AvatarFallback>
    );
  }

  // Ya montado, muestra la inicial real
  return (
    <AvatarFallback>
      {(user?.firstName?.[0] || user?.username?.[0] || "U").toUpperCase()}
    </AvatarFallback>
  );
} 