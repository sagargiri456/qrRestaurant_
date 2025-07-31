import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-4xl font-bold mb-4">Welcome to QuickBiteQR 🍽️</h1>
      <p className="text-gray-600 text-center max-w-md">
        A simple way for restaurants to let customers scan, order, and enjoy.
      </p>
    </div>
  );
}
