"use client";

import { memo } from "react";

/**
 * Shared neutral background for admin pages.
 * Solid dark neutral (#171717).
 */
export const AdminBackground = memo(function AdminBackground() {
  return <div className="fixed inset-0 -z-10 bg-[#171717]" />;
});
