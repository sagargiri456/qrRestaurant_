// src/app/restaurant/[id]/page.tsx
"use client";

export const dynamic = "force-dynamic"; // 💥 prevents export errors

import { Suspense } from "react";
import CustomerMenuWrapper from "./CustomerMenuWrapper";

export default function RestaurantPage() {
  return (
    <Suspense fallback={<p>Loading menu...</p>}>
      <CustomerMenuWrapper />
    </Suspense>
  );
}
