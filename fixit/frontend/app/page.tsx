"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Camera, MapPin, AlertTriangle, ThumbsUp } from "lucide-react";
import SplashScreen from "@/components/SplashScreen";
import ActionCard from "@/components/ActionCard";
import BottomNav from "@/components/BottomNav";

export default function HomePage() {
  const [showSplash, setShowSplash] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) return <SplashScreen />;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-lg mx-auto px-4 pt-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Report an Issue
        </h1>

        <div className="grid grid-cols-2 gap-4">
          <ActionCard
            title="Report an Issue"
            color="bg-emerald-50 text-emerald-700"
            icon={<Camera className="w-8 h-8 text-emerald-500" />}
            onClick={() => router.push("/report")}
          />
          <ActionCard
            title="View Reports Nearby"
            color="bg-blue-50 text-blue-700"
            icon={<MapPin className="w-8 h-8 text-blue-500" />}
            onClick={() => router.push("/track")}
          />
          <ActionCard
            title="Track My Reports"
            color="bg-orange-50 text-orange-700"
            icon={<AlertTriangle className="w-8 h-8 text-orange-500" />}
            onClick={() => router.push("/track")}
          />
          <ActionCard
            title="Vote on Reports"
            color="bg-rose-50 text-rose-700"
            icon={<ThumbsUp className="w-8 h-8 text-rose-400" />}
            onClick={() => router.push("/track")}
          />
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
