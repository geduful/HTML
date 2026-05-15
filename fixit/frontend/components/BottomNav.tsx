"use client";

import { usePathname, useRouter } from "next/navigation";
import { Home, Map, User } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Map, label: "Explore", path: "/track" },
    { icon: User, label: "Profile", path: "#" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      <div className="max-w-lg mx-auto flex items-center justify-around py-3">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={() => router.push(item.path)}
              className="flex flex-col items-center gap-1"
            >
              <Icon
                className={`w-6 h-6 ${
                  isActive ? "text-blue-500" : "text-gray-400"
                }`}
              />
              <span
                className={`text-[10px] font-medium ${
                  isActive ? "text-blue-500" : "text-gray-400"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
