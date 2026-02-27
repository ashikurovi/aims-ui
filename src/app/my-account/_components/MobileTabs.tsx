"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../../../utils/cn";
import { menuItems } from "./side_bar/Menu";

const MobileTabs = () => {
  const path = usePathname().split("/").pop();

  return (
    <nav className="md:hidden">
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {menuItems.map((item) => (
          <Link
            key={item.id}
            href={`/my-account/${item.link}`}
            className={cn(
              "flex items-center gap-1.5 whitespace-nowrap px-3 py-2 rounded-full text-xs font-medium border transition-colors",
              path === item.link
                ? "bg-primary text-white border-primary shadow-sm"
                : "bg-white text-gray-700 border-pink-100 hover:bg-pink-50"
            )}
          >
            <span className="flex items-center justify-center">
              {item.icon}
            </span>
            <span>{item.name}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default MobileTabs;

