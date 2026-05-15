"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ReportCard from "@/components/ReportCard";
import BottomNav from "@/components/BottomNav";

const mockReports = [
  {
    id: "1",
    title: "Pothole on Oxford Street",
    description:
      "Large pothole causing traffic delays and vehicle damage near the junction.",
    location: "Oxford Street, Accra",
    status: "REPORTED",
    votes: 12,
    imageUrl: "",
  },
  {
    id: "2",
    title: "Broken Streetlight",
    description:
      "Streetlight has been out for 3 weeks on Spintex Road, creating safety hazards at night.",
    location: "Spintex Road, Accra",
    status: "IN_PROGRESS",
    votes: 8,
    imageUrl: "",
  },
  {
    id: "3",
    title: "Burst Water Pipe",
    description:
      "Water pipe burst on the main road, wasting water and flooding the area.",
    location: "Adum, Kumasi",
    status: "RESOLVED",
    votes: 24,
    imageUrl: "",
  },
];

export default function TrackPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-lg mx-auto px-4 pt-6">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => router.back()}>
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Track My Reports</h1>
        </div>

        <div className="space-y-4">
          {mockReports.map((report) => (
            <ReportCard
              key={report.id}
              {...report}
              onClick={() => router.push(`/track/${report.id}`)}
            />
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
