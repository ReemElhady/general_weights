import React from "react";
import { useLocation } from "react-router-dom";
import { HelpCircleIcon, PlusIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

// Page title map
const pageTitles = {
  "/dashboard": { title: "لوحة التحكم", description: "نظرة عامة على البيانات" },
  "/tickets/first-weight": { title: "إنشاء تذكرة جديدة", description: "" },
  "/tickets": { title: "تذاكر الوزن", description: "إلدارة طلبات النقل وعمليات الوزن" },
  "/customers": { title: "العملاء", description: "إدارة العملاء المسجلين ومعلوماتهم" },
  "/vehicles": { title: "السيارات", description: "إدارة السيارات المسجلة ومعلوماتها" },
  "/drivers": { title: "السائقين", description: "إدارة السائقين المسجلين ومعلوماتهم" },
  "/scales": { title: "الموازين", description: "إدارة موازين الوزن وجداول المعايرة" },
  "/blocked-vehicles": {
    title: "السيارات المحظورة",
    description: "مراقبة حدود الوزن",
  },
  "/settings": { title: "الإعدادات", description: "ضبط تفضيلات النظام" },
};

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const current = pageTitles[location.pathname] || {
    title: "الرئيسية",
    description: "مرحبا بك في لوحة التحكم",
  };

  return (

    <header className="fixed w-[calc(100%-72px)] h-20 top-0 left-0 bg-white border-b border-gray-100 flex items-center justify-between px-10 z-10">

      {/* User controls */}
      <div className="flex items-center gap-6">


        {/* User profile and notifications */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="relative w-3 h-3 bg-[url(/arrow-down.png)] bg-[100%_100%]" />
            <div className="relative w-[38px] h-[38px] bg-[#f3f6f8] rounded-[50px] border border-solid border-[#ffffff]">
              <div className="relative w-9 h-9 top-px bg-[url(/group-2.png)] bg-[100%_100%]">
                <img
                  className="absolute w-6 h-8 top-[3px] left-1.5"
                  alt="User"
                  src="/user.png"
                />
              </div>
            </div>
          </div>

          <HelpCircleIcon className="w-6 h-6" />

          <div className="relative">
            <div className="w-6 h-6 bg-[url(/notification-icon.svg)] bg-[100%_100%]" />
            <div className="absolute w-2 h-2 top-0 left-[15px] bg-indigo-500 rounded shadow-[0px_0px_0px_2px_#f7f8fc,0px_1px_2px_#00000040]" />
          </div>
        </div>

        {/* Create ticket button */}
        <Button
          onClick={() => navigate("/tickets/first-weight")}
          className="flex items-center gap-2 bg-indigo-500 text-white h-12 px-3 py-1.5 rounded-md shadow-pr-button-default"
        >
          <span className="font-button-default font-[number:var(--button-default-font-weight)] text-[length:var(--button-default-font-size)] tracking-[var(--button-default-letter-spacing)] leading-[var(--button-default-line-height)] [direction:rtl] [font-style:var(--button-default-font-style)]">
            إنشاء تذكرة جديدة
          </span>
          <PlusIcon className="w-4 h-4" />
        </Button>


      </div>

      {/* Page title and description (RIGHT side) */}
      <div className="flex flex-col text-right text-gray-800">
        <span className="text-lg font-semibold">{current.title}</span>
        <span className="text-sm text-gray-500">{current.description}</span>
      </div>
    </header>
  );
};

export default Navbar;