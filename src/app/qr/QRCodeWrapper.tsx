// app/qr/QRCodeWrapper.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";

export default function QRCodeWrapper() {
  const searchParams = useSearchParams();
  const restaurantId = searchParams.get("rid");

  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/restaurant/${restaurantId}`;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6">Your Restaurant QR Code</h1>
      {restaurantId ? (
        <>
          <QRCodeCanvas value={url} size={256} />
          <p className="mt-4 text-gray-700 break-all text-center">{url}</p>
        </>
      ) : (
        <p className="text-red-500">No restaurant ID found in URL.</p>
      )}
    </div>
  );
}
