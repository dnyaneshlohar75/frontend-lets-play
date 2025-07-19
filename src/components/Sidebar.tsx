import { NavLink } from "react-router-dom";
import {
  LuUserRound,
  LuPanelLeftOpen,
  LuSwords,
  LuHistory,
  LuHandCoins,
  LuSettings,
} from "react-icons/lu";
import { useState } from "react";

export default function UserSidebar() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const navItems = [
    { name: "Profile", path: "/user/profile", icon: <LuUserRound size={18} /> },
    { name: "Matches", path: "/user/matches", icon: <LuSwords size={18} /> },
    { name: "History", path: "/user/history", icon: <LuHistory size={18} /> },
    {
      name: "Payments",
      path: "/user/payments",
      icon: <LuHandCoins size={18} />,
    },
    {
      name: "Settings",
      path: "/user/settings",
      icon: <LuSettings size={18} />,
    },
  ];

  return (
    <div
      className={`w-[${isPanelOpen ? "18%" : "5%"}] h-screen px-4 py-4`}
    >
      <header className="flex items-center justify-between mb-6">
        {isPanelOpen && (
          <h2 className="text-md font-semibold transition-opacity duration-300 opacity-100">Dashboard</h2>
        )}

        <button
          onClick={() => setIsPanelOpen(!isPanelOpen)}
          className="group cursor-pointer p-2 rounded-md hover:bg-gray-200 transition-colors ease-in-out duration-200"
        >
          <LuPanelLeftOpen
            size={18}
            className={`transform transition-transform duration-300 ${
              isPanelOpen ? "rotate-180" : "rotate-0"
            } group-hover:scale-110`}
          />
        </button>
      </header>

      <nav className="flex flex-col gap-4">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `px-2 py-2 rounded-md text-sm font-medium ${
                isActive
                  ? "bg-blue-700 text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`
            }
          >
            <p className="flex items-center gap-x-3">
              {item.icon} {isPanelOpen ? item.name : ""}
            </p>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
