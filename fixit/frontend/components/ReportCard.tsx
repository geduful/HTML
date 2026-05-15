import { MapPin } from "lucide-react";

interface ReportCardProps {
  id: string;
  title: string;
  description: string;
  location: string;
  status: string;
  votes: number;
  imageUrl?: string;
  onClick?: () => void;
}

const statusColors: Record<string, string> = {
  REPORTED: "bg-yellow-100 text-yellow-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  RESOLVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

export default function ReportCard({
  title,
  description,
  location,
  status,
  votes,
  imageUrl,
  onClick,
}: ReportCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
    >
      {imageUrl && (
        <div className="h-40 bg-gray-200">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span
            className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${
              statusColors[status] || "bg-gray-100 text-gray-800"
            }`}
          >
            {status.replace("_", " ")}
          </span>
          <span className="text-xs text-gray-400">{votes} votes</span>
        </div>
        <h3 className="font-semibold text-gray-900 text-sm mb-1">{title}</h3>
        <p className="text-xs text-gray-500 line-clamp-2 mb-3">
          {description}
        </p>
        <div className="flex items-center text-[10px] text-gray-400">
          <MapPin className="w-3 h-3 mr-1" />
          {location}
        </div>
      </div>
    </div>
  );
}
