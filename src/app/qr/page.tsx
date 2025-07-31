"use client";

import { Suspense } from "react";
import QRCodeWrapper from "./QRCodeWrapper";

export default function QRPage() {
  return (
    <Suspense fallback={<p className="text-center mt-10">Loading QR...</p>}>
      <QRCodeWrapper />
    </Suspense>
  );
}
