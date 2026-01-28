import React from "react";
import { NavLink } from "react-router-dom";

export const SidebarNavigationSimple = ({ items }) => (
  <div className="w-64 bg-black/80 text-white h-screen p-4 flex flex-col gap-2">
    {items.map((item) => (
      <NavLink
        key={item.href}
        to={item.href}
        className={({ isActive }) =>
          `px-3 py-2 rounded-lg hover:bg-white/10 transition ${
            isActive ? "bg-white/20" : ""
          }`
        }
      >
        {item.label}
      </NavLink>
    ))}
  </div>
);
