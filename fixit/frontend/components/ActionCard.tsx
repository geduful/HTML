import { type ReactNode } from "react";

interface ActionCardProps {
  title: string;
  color: string;
  icon: ReactNode;
  onClick?: () => void;
}

export default function ActionCard({
  title,
  color,
  icon,
  onClick,
}: ActionCardProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-6 rounded-2xl shadow-sm border border-black/5 ${color} transition-all active:scale-[0.96] hover:shadow-md`}
    >
      <div className="mb-3">{icon}</div>
      <span className="text-sm font-semibold text-center leading-tight">
        {title}
      </span>
    </button>
  );
}
