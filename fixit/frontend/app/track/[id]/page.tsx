"use client";

import { useRouter } from "next/navigation";
import { MapPin, Calendar, ArrowLeft } from "lucide-react";
import StatusTimeline from "@/components/StatusTimeline";

const reportsDB: Record<
  string,
  {
    id: string;
    title: string;
    description: string;
    location: string;
    status: "REPORTED" | "IN_PROGRESS" | "RESOLVED" | "REJECTED";
    votes: number;
    imageUrl: string;
    createdAt: string;
    category: string;
  }
> = {
  "1": {
    id: "1",
    title: "Pothole on Oxford Street",
    description:
      "Large pothole causing traffic delays and vehicle damage near the junction. This has been an ongoing issue for several weeks and needs urgent attention from the municipal assembly.",
    location: "Oxford Street, Accra",
    status: "REPORTED",
    votes: 12,
    imageUrl: "",
    createdAt: "2026-05-08",
    category: "Road",
  },
  "2": {
    id: "2",
    title: "Broken Streetlight",
    description:
      "Streetlight has been out for 3 weeks on Spintex Road, creating safety hazards at night for pedestrians and drivers.",
    location: "Spintex Road, Accra",
    status: "IN_PROGRESS",
    votes: 8,
    imageUrl: "",
    createdAt: "2026-05-01",
    category: "Electricity",
  },
  "3": {
    id: "3",
    title: "Burst Water Pipe",
    description:
      "Water pipe burst on the main road, wasting water and flooding the area. Residents have been without water supply for days.",
    location: "Adum, Kumasi",
    status: "RESOLVED",
    votes: 24,
    imageUrl: "",
    createdAt: "2026-04-20",
    category: "Water",
  },
};

export default function TrackDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const report = reportsDB[params.id];

  if (!report) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 font-medium">Report not found.</p>
          <button
            onClick={() => router.push("/track")}
            className="mt-4 text-sm text-blue-500 underline"
          >
            Back to reports
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-lg mx-auto">
        {/* Image header */}
        <div className="h-52 bg-gray-200 relative">
          {report.imageUrl ? (
            <img
              src={report.imageUrl}
              alt={report.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
              <MapPin className="w-12 h-12 text-blue-300" />
            </div>
          )}
          <button
            onClick={() => router.back()}
            className="absolute top-4 left-4 bg-white/90 backdrop-blur rounded-full p-2 shadow-sm"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <span className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-full px-3 py-1 text-xs font-semibold text-gray-700 shadow-sm">
            {report.votes} votes
          </span>
        </div>

        {/* Content */}
        <div className="px-4 pt-5">
          <div className="mb-2">
            <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
              {report.category}
            </span>
          </div>

          <h1 className="text-xl font-bold text-gray-900 mb-1">
            {report.title}
          </h1>

          <div className="flex items-center text-xs text-gray-500 mb-1">
            <MapPin className="w-3.5 h-3.5 mr-1" />
            {report.location}
          </div>

          <div className="flex items-center text-xs text-gray-500 mb-4">
            <Calendar className="w-3.5 h-3.5 mr-1" />
            Reported on {report.createdAt}
          </div>

          <p className="text-sm text-gray-600 leading-relaxed mb-6">
            {report.description}
          </p>

          {/* Timeline */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6">
            <h2 className="font-semibold text-gray-900 text-sm mb-2">
              Status Timeline
            </h2>
            <StatusTimeline currentStatus={report.status} />
          </div>

          {/* Track button */}
          <button className="w-full py-3.5 bg-blue-500 text-white font-semibold rounded-xl shadow-sm hover:bg-blue-600 active:scale-[0.98] transition-all">
            Track
          </button>
        </div>
      </div>
    </div>
  );
}
