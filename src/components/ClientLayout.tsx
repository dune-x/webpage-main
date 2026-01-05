"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/Footer";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isTorneoPage = pathname === "/torneo";

  return (
    <>
      {children}
      {!isTorneoPage && <Footer />}
    </>
  );
}
