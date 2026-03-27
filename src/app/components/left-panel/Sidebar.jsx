"use client";

import { useState } from "react";
import {
  LayoutTemplate,
  Shapes,
  Type,
  Crown,
  UploadCloud,
  Wrench,
  Folder,
  Grid,
  Sparkles,
} from "lucide-react";

const menuItems = [
  { id: "text", label: "Text", icon: Type },
  { id: "elements", label: "Elements", icon: Shapes },
  { id: "templates", label: "Templates", icon: LayoutTemplate },
  { id: "brand", label: "Brand", icon: Crown },
  // { id: "uploads", label: "Uploads", icon: UploadCloud },
  // { id: "tools", label: "Tools", icon: Wrench },
  // { id: "projects", label: "Projects", icon: Folder },
  // { id: "apps", label: "Apps", icon: Grid },
  // { id: "magic", label: "Magic Media", icon: Sparkles },
];

export default function Sidebar() {
  const [active, setActive] = useState("templates");

  return (
    <aside className="absolute fixed left-0 rounded rounded-tr-2xl rounded-br-2xl w-19 bg-green-300 text-black flex flex-col items-center py-6 hover:left-0 transition-all duration-300">
      <div className="flex flex-col gap-6 w-full">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`flex flex-col items-center gap-1 py-3 w-full transition-all duration-200 hover:scale-110 rounded-lg
                ${
                  isActive
                    ? "text-white bg-green-500 scale-115"
                    : "hover:bg-green-500 hover:text-white scale-110 transition-all duration-200"
                }
              `}
            >
              <Icon
                size={22}
                className={isActive ? "text-white scale-110 transition-all duration-200" : ""}
              />
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}