"use client";

import { MapPin, Wrench } from "lucide-react";

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
      <div className="relative">
        <MapPin className="w-16 h-16 text-blue-500" />
        <Wrench className="w-6 h-6 text-blue-500 absolute -bottom-1 -right-1" />
      </div>
      <h1 className="mt-5 text-4xl font-bold text-gray-900 tracking-tight">
        Fixit
      </h1>
      <p className="mt-2 text-sm text-gray-400">
        Report. Track. Resolve.
      </p>
    </div>
  );
}
