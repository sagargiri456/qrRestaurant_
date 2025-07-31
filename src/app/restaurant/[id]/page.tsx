"use client";

export const dynamic = "force-dynamic";

import { Suspense } from "react";
import CustomerMenuWrapper from "./CustomerMenuWrapper";

export default function RestaurantPage() {
  return (
    <Suspense fallback={<p className="text-center mt-10">Loading Menu...</p>}>
      <CustomerMenuWrapper />
    </Suspense>
  );
}
