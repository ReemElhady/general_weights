import React from "react";
import { SettingsIcon, LogOut } from "lucide-react";
import { removeAuthToken } from "../../utils/auth";
import { useNavigate, useLocation } from "react-router-dom";
import path from "path";

// Navigation menu icons data
const navIcons = [
  { src: "/dashboard.png", active: "/active-dashboard.png" , path: "/dashboard"},
  { src: "/ticket.png", active: "/active-ticket.png", path: "/tickets/first-weight" },
  { src: "/users.png", active: "/active-users.png" , path: "/customers"},
  { src: "/vehicles.png", active: "/active-vehicles.png", path: "/vehicles"},
  { src: "/drivers.png", active: "/active-drivers.png", path: "/drivers"},
  { src: "/scales.png", active: "/active-scales.png", path: "/scales"},
  { src: "/blocked-vehicles.png", active: "/active-blocked-vehicles.png", path: "/blocked-vehicles" },
  { src: "/blocked-vehicles.png", active: "/active-blocked-vehicles.png", path: "/items" },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handelSettings = () => {
    navigate("/settings");
  }


  const handleLogout = () => {
    removeAuthToken();
    navigate("/login");
  };

  return (
    <div className="fixed w-[72px] h-screen top-0 right-0 bg-indigo-900 z-50">
      {/* Logo */}
      <div className="flex justify-center items-center h-16">
        <div className="w-10 h-10">
          <img className="w-10 h-[38px]" alt="Logo" src="/group-3573.png" />
        </div>
      </div>

      {/* Navigation icons */}
      <div className="flex flex-col items-center gap-2.5 mt-6">
        {navIcons.map((icon, index) => {
          const isActive = location.pathname === icon.path;
          const iconSrc = isActive ? icon.active : icon.src;

          return (
            <div
              key={index}
              onClick={() => navigate(icon.path)}
              className={`w-10 h-10 rounded-md flex items-center justify-center cursor-pointer transition-colors ${
                isActive
                  ? "bg-[#0c0b45] border border-solid border-[#29268e]"
                  : "bg-indigo-900 hover:bg-[#0c0b45]"
              }`}
            >
              <div
                className={`w-6 h-6 ${isActive ? "rotate-180" : ""}`}
                style={{
                  backgroundImage: `url(${iconSrc})`,
                  backgroundSize: "100% 100%",
                }}
              />
            </div>
          );
        })}


        {/* Settings icon */}
        <button
          onClick={handelSettings}
          className="w-10 h-10 bg-indigo-900 rounded-md flex items-center justify-center cursor-pointer hover:bg-[#0c0b45] transition-colors">
          <SettingsIcon className="w-6 h-6 text-white" />
        </button>

        <button
          onClick={handleLogout}
          className="w-10 h-10 bg-indigo-900 rounded-md flex items-center justify-center hover:bg-[#0c0b45] transition-colors"
        >
          <LogOut className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;