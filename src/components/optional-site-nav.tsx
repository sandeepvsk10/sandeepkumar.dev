"use client";

import { usePathname } from "next/navigation";

import { SiteNav } from "@/components/site-nav";

/** Hides main site nav on the home route so the home layout can own the header. */
export function OptionalSiteNav() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return <SiteNav />;
}
