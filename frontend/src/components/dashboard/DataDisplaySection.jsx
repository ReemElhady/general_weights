import React, { useState, useEffect } from "react";
import { ChevronDownIcon } from "lucide-react";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { CircularProgress } from "./CircularProgress";
import {
  fetchYearStats,
  fetchChartData,
  fetchScalesStats,
  fetchBlockedVehicles
} from "../../utils/dashboard";

const yAxisLabels = ["200", "150", "100", "50", "0"];

const DataDisplaySection = ({ selectedYear }) => {
  const [period, setPeriod] = useState("last7days");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [barChartData, setBarChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [yearStats, setYearStats] = useState({
    total_tickets: 0,
    tickets_by_type: { IN: 0, OUT: 0 },
    completion_status: { completed: 0, not_completed: 0 },
  });

  const [scalesStats, setScalesStats] = useState({ total_scales: 0, active_scales: 0 });
  const [blockedVehicles, setBlockedVehicles] = useState({ blocked_count: 0 });

  useEffect(() => {
    const loadYearStats = async () => {
      try {
        const data = await fetchYearStats(selectedYear);
        setYearStats(data);
      } catch (error) {
        console.error("Error fetching year stats:", error);
      }
    };

    const loadChartData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchChartData(selectedYear, period, selectedMonth);
        setBarChartData(data.data || []);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadYearStats();
    loadChartData();
  }, [selectedYear, period, selectedMonth]);

  useEffect(() => {
    const loadScalesStats = async () => {
      try {
        const data = await fetchScalesStats();
        setScalesStats(data);
      } catch (error) {
        console.error("Error fetching scales stats:", error);
      }
    };

    const loadBlockedVehicles = async () => {
      try {
        const data = await fetchBlockedVehicles();
        setBlockedVehicles(data);
      } catch (error) {
        console.error("Error fetching blocked vehicles:", error);
      }
    };

    loadScalesStats();
    loadBlockedVehicles();
  }, []);

  const maxCount = Math.max(...barChartData.map(bar => bar.count), 1);

  return (
    <section className="w-full">
      <div className="flex flex-col gap-5">
        {/* الجزء العلوي */}
        <div className="flex items-start gap-5 w-full">
          {/* كارت أوامر النقل */}
          <Card className="flex-1 bg-white rounded-xl">
            <CardContent className="p-6">
              <div className="flex flex-col items-center gap-6">
                <h3 className="font-semibold text-black-60 text-base text-right w-full">أوامر النقل</h3>
                <CircularProgress
                  outCount={yearStats.tickets_by_type.OUT}
                  inCount={yearStats.tickets_by_type.IN}
                  otherCount={0}
                  total={yearStats.total_tickets}
                  outColor="#4c51bf"
                  inColor="#FFA500"
                />
                <div className="flex justify-center gap-8 w-full">
                  <div className="inline-flex items-center gap-2">
                    <span className="text-gray-500 text-sm">مبيعات</span>
                    <span className="text-gray-500 text-sm">{yearStats.tickets_by_type.OUT}</span>
                    <div className="w-2 h-2 bg-indigo-500 rounded-md" />
                  </div>
                  <div className="inline-flex items-center gap-2">
                    <span className="text-gray-500 text-sm">تفريغ</span>
                    <span className="text-gray-500 text-sm">{yearStats.tickets_by_type.IN}</span>
                    <div className="w-2 h-2 rounded-md" style={{ backgroundColor: '#FFA500' }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* كروت التذاكر والموازين */}
          <div className="flex flex-col gap-[19px] flex-1">
            <Card className="bg-indigo-500 rounded-xl">
              <CardContent className="p-[15px] flex flex-col h-[159px] items-end">
                <div className="flex justify-end w-full">
                  <div className="w-9 h-9 bg-[#ffffff29] rounded-lg flex items-center justify-center">
                    <img className="w-6 h-6" alt="Ticket" src="/ticket.png" />
                  </div>
                </div>
                <div className="flex items-start justify-end gap-8 w-full">
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-white text-sm">التذاكر المعلقة</span>
                    <span className="text-white text-[22px]">{yearStats.completion_status.not_completed}</span>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-white text-sm">التذاكر المكتملة</span>
                    <span className="text-white text-[22px]">{yearStats.completion_status.completed}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white rounded-xl">
              <CardContent className="p-[15px] flex flex-col h-[159px] items-end">
                <div className="flex justify-end w-full">
                  <div className="w-9 h-9 bg-gray-0 rounded-lg flex items-center justify-center">
                    <img className="w-6 h-6" alt="Scale" src="/scale.png" />
                  </div>
                </div>
                <div className="flex items-start justify-end gap-8 w-full">
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-actionred text-sm">عدد السيارات المحظورة</span>
                    <span className="text-black-60 text-[22px]">{blockedVehicles.blocked_count}</span>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-gray-500 text-sm">الموازين النشطة</span>
                    <span className="text-black-60 text-[22px]">{scalesStats.active_scales} / {scalesStats.total_scales}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* البار شارت */}
        <Card className="bg-white rounded-xl">
          <CardContent className="p-5">
            <div className="flex flex-col items-end gap-9">
              <div className="flex justify-between w-full">
                <div className="flex items-center gap-2">
                  <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="border text-xs rounded px-2 py-1 text-gray-700"
                  >
                    <option value="last7days">آخر 7 أيام</option>
                    <option value="weekly">أسبوعي</option>
                    <option value="monthly">شهري</option>
                  </select>

                  {(period === "weekly" || period === "monthly") && (
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="border text-xs rounded px-2 py-1 text-gray-700"
                    >
                      <option value="">اختر الشهر</option>
                      {["01","02","03","04","05","06","07","08","09","10","11","12"].map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="flex items-center gap-[21px]">
                  <Badge className="bg-[#5570f114] text-indigo-500 font-medium px-3 py-1.5 rounded-lg flex items-center gap-4">
                    <ChevronDownIcon className="w-5 h-5" />
                    <span>التذاكر</span>
                  </Badge>
                  <h3 className="font-semibold text-black-60 text-base">احصائيات</h3>
                </div>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center w-full h-48">
                  <span className="text-gray-500 text-sm">جاري التحميل...</span>
                </div>
              ) : (
                <div className="flex items-end justify-between w-full">
                  <div className="flex flex-col items-start gap-[37px]">
                    {yAxisLabels.map((label, i) => (
                      <span key={i} className="text-gray-500 text-sm">{label}</span>
                    ))}
                  </div>
                  {barChartData.map((bar, i) => {
                    const height = Math.max((bar.count / maxCount) * 241, 5);
                    return (
                      <div key={i} className="flex flex-col items-center gap-[19px]">
                        <div className="relative w-[18px] h-[241px] bg-[#eef0f9] rounded-[50px]">
                          <div
                            className="absolute bottom-0 rounded-[50px]"
                            style={{ height, width: '100%', backgroundColor: '#4c51bf' }}
                          />
                        </div>
                        <span className="text-gray-500 text-xs">{bar.day || bar.week || bar.month}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default DataDisplaySection;
