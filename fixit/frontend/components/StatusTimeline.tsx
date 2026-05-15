import { CheckCircle, Clock, AlertCircle } from "lucide-react";

interface StatusTimelineProps {
  currentStatus: "REPORTED" | "IN_PROGRESS" | "RESOLVED" | "REJECTED";
}

const steps = [
  { key: "REPORTED" as const, label: "Reported" },
  { key: "IN_PROGRESS" as const, label: "In Progress" },
  { key: "RESOLVED" as const, label: "Resolved" },
];

export default function StatusTimeline({
  currentStatus,
}: StatusTimelineProps) {
  const currentIndex = steps.findIndex((s) => s.key === currentStatus);
  const isRejected = currentStatus === "REJECTED";

  return (
    <div className="py-4">
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isLast = index === steps.length - 1;

        return (
          <div key={step.key} className="flex items-start">
            <div className="flex flex-col items-center mr-4">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  isCompleted
                    ? "bg-blue-500 border-blue-500 text-white"
                    : isCurrent
                    ? "border-blue-500 text-blue-500"
                    : "border-gray-300 text-gray-300"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle className="w-4 h-4" />
                ) : isCurrent ? (
                  <Clock className="w-4 h-4" />
                ) : (
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                )}
              </div>
              {!isLast && (
                <div
                  className={`w-0.5 h-12 ${
                    isCompleted ? "bg-blue-500" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
            <div className={`pt-1 ${isLast ? "" : "pb-8"}`}>
              <p
                className={`font-semibold text-sm ${
                  isCompleted || isCurrent ? "text-gray-900" : "text-gray-400"
                }`}
              >
                {step.label}
              </p>
              {isCurrent && !isRejected && index === 0 && (
                <p className="text-xs text-gray-500 mt-0.5">
                  Awaiting review
                </p>
              )}
              {isCurrent && !isRejected && index === 1 && (
                <p className="text-xs text-gray-500 mt-0.5">
                  Work in progress
                </p>
              )}
            </div>
          </div>
        );
      })}
      {isRejected && (
        <div className="flex items-start mt-2">
          <div className="flex flex-col items-center mr-4">
            <div className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-red-500 text-red-500">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="pt-1">
            <p className="font-semibold text-sm text-red-500">Rejected</p>
            <p className="text-xs text-gray-500 mt-0.5">
              This report was rejected by the local authority. It has been
              escalated to the next tier.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
