import React from "react";
import { useState, useEffect } from "react";
import DataDisplaySection from "../components/dashboard/DataDisplaySection";
import ChartSection from "../components/dashboard/ChartSection";
import { getAuthToken } from "../utils/auth";


const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // In a real app, you would fetch user data from the API using the token
    const token = getAuthToken();
    if (token) {
      // Mock user data - in real app, decode token or fetch from API
      setUser({
        name: "مستخدم WeighPro",
        email: "user@weighpro.com"
      });
    }
  }, []);


  return (
    <div className="space-y-8">

      {/* Year filter dropdown */}
        {/* <div className="inline-flex items-start gap-2.5 p-2.5 bg-[#f2f4fe] rounded-xl">
          <img
            className="relative w-4 h-4"
            alt="Akar icons chevron"
            src="/fi-chevron-down.svg"
          />
          <div className="relative w-fit mt-[-1.00px] [font-family:'Rubik',Helvetica] font-normal text-transparent text-base text-right leading-[normal] whitespace-nowrap [direction:rtl]">
            <span className="text-[#92929d] tracking-[0.02px]">عرض: </span>
            <span className="text-[#5e5adb] tracking-[0.02px]">هذا العام</span>
          </div>
        </div> */}

      <DataDisplaySection />
      <ChartSection />
    </div>
  );
};

export default Dashboard;