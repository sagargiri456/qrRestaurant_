// app/admin/page.tsx
"use client";

import { Suspense } from "react";
import AdminWrapper from "./AdminWrapper";

export default function AdminPage() {
  return (
    <Suspense fallback={<p className="text-center mt-10">Loading Admin Dashboard...</p>}>
      <AdminWrapper />
    </Suspense>
  );
}
