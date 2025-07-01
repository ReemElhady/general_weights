import React, { useState, useEffect } from "react";
import { ChevronDownIcon } from "lucide-react";
import DataDisplaySection from "../components/dashboard/DataDisplaySection";
import ChartSection from "../components/dashboard/ChartSection";
import { getAuthToken } from "../utils/auth";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showYears, setShowYears] = useState(false);

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      setUser({
        name: "مستخدم WeighPro",
        email: "user@weighpro.com"
      });
    }
  }, []);

  // السنة الحالية
  const currentYear = new Date().getFullYear();

  return (
    <div className="space-y-8">
      {/* زرار اختيار السنة */}
      <div className="flex justify-start" dir="rtl"> 
        <div className="relative" dir="ltr">
          <button
            onClick={() => setShowYears(!showYears)}
            className="inline-flex items-center gap-2.5 p-2.5 bg-[#f2f4fe] rounded-xl"
          >
            <ChevronDownIcon className="w-4 h-4 text-[#5e5adb]" />
            <div className="font-normal text-[#5e5adb] text-base [direction:rtl]">
              عرض:{" "}
              <span className="text-[#5e5adb]">
                {selectedYear === currentYear ? "هذا العام" : selectedYear}
              </span>
            </div>
          </button>

          {showYears && (
            <div className="absolute top-full mt-2 bg-white rounded shadow-md z-10">
              {[currentYear, 2024, 2023].map((year) => (
                <div
                  key={year}
                  onClick={() => {
                    setSelectedYear(year);
                    setShowYears(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {year === currentYear ? "هذا العام" : year}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4 justify-end">
        <div className="flex-[1.2]">
          <ChartSection />
        </div>
        <div className="flex-[2.8]">
          <DataDisplaySection selectedYear={selectedYear} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
