import React from "react";
import { ChevronDownIcon } from "lucide-react";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";

// Data for the chart legend
const chartLegendData = [
  { label: "مبيعات", color: "bg-indigo-500" },
  { label: "تفريغ", color: "bg-primary-50" },
  { label: "اخري", color: "bg-secondary-100" },
];

// Data for the bar chart
const barChartData = [
  { day: "16 سبتمبر", height: "196px", top: "45px" },
  { day: "15 سبتمبر", height: "106px", top: "135px" },
  { day: "14 سبتمبر", height: "196px", top: "45px" },
  { day: "13 سبتمبر", height: "51px", top: "190px" },
  { day: "12 سبتمبر", height: "154px", top: "87px" },
  { day: "11 سبتمبر", height: "84px", top: "157px" },
  { day: "10 سبتمبر", height: "211px", top: "30px" },
];

// Y-axis labels for the chart
const yAxisLabels = ["200", "150", "100", "50", "0"];

const DataDisplaySection = () => {
  return (
    <section className="w-full">
      <div className="flex flex-col gap-5">
        {/* Top row with donut chart and status cards */}
        <div className="flex items-start gap-5 w-full">
          {/* Donut Chart Card */}
          <Card className="flex-1 bg-white rounded-xl">
            <CardContent className="p-6">
              <div className="flex flex-col items-center gap-6">
                <div className="flex flex-col items-start gap-3 w-full">
                  <div className="flex items-start justify-end gap-3 w-full">
                    <h3 className="font-semibold text-black-60 text-base text-right [direction:rtl]">
                      أوامر النقل
                    </h3>
                  </div>
                </div>

                {/* Donut Chart */}
                <div className="relative w-[205px] h-[205px] bg-[url(/ellipse-1.svg)] bg-[100%_100%]">
                  <div className="relative w-[172px] h-[172px] top-[17px] left-[17px] bg-[url(/ellipse-3.svg)] bg-[100%_100%]">
                    <img
                      className="absolute w-[172px] h-[172px] top-0 left-0"
                      alt="Ellipse"
                      src="/ellipse-4.svg"
                    />
                    <img
                      className="absolute w-[172px] h-[172px] top-0 left-0"
                      alt="Ellipse"
                      src="/ellipse-2.svg"
                    />
                  </div>

                  {/* Center text */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <div className="font-medium text-black-60 text-xl">
                      1,255
                    </div>
                    <div className="text-[#868ea0] text-sm [direction:rtl]">
                      تذكرة
                    </div>
                  </div>
                </div>

                {/* Chart Legend */}
                <div className="flex justify-center gap-8 w-full">
                  {chartLegendData.map((item, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center justify-center gap-2"
                    >
                      <div className="font-normal text-gray-500 text-sm text-right [direction:rtl]">
                        {item.label}
                      </div>
                      <div
                        className={`relative w-2 h-2 ${item.color} rounded-md`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right side cards */}
          <div className="flex flex-col items-start gap-[19px] flex-1">
            {/* Purple Card - Tickets Status */}
            <Card className="w-full bg-indigo-500 rounded-xl">
              <CardContent className="p-[15px] flex flex-col h-[159px] items-end gap-2.5">
                <div className="flex-col h-[130px] items-end justify-between flex w-full">
                  <div className="items-center justify-end gap-[182px] flex w-full">
                    <div className="opacity-0 inline-flex items-center gap-[7px]">
                      <div className="font-normal text-primary-10 text-sm">
                        This Week
                      </div>
                      <ChevronDownIcon className="w-4 h-4" />
                    </div>
                    <div className="w-9 h-9 bg-[#ffffff29] rounded-lg overflow-hidden flex items-center justify-center">
                      <img className="w-6 h-6" alt="Ticket" src="/ticket.png" />
                    </div>
                  </div>

                  <div className="flex items-start justify-end gap-8 w-full">
                    <div className="flex flex-col items-end gap-2 flex-1">
                      <div className="font-normal text-white text-sm text-right [direction:rtl]">
                        التذاكر المعلقة
                      </div>
                      <div className="inline-flex items-center justify-end gap-[7px]">
                        <div className="opacity-0 font-normal text-primary-10 text-sm">
                          +0.00%
                        </div>
                        <div className="font-medium text-white text-[22px] text-right whitespace-nowrap">
                          45
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 flex-1">
                      <div className="font-normal text-white text-sm text-right [direction:rtl]">
                        التذاكر المكتملة
                      </div>
                      <div className="inline-flex items-center justify-center gap-[7px]">
                        <div className="font-normal text-primary-10 text-sm">
                          +24%
                        </div>
                        <div className="font-medium text-white text-[22px] whitespace-nowrap">
                          1210
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* White Card - Scales Status */}
            <Card className="w-full bg-white rounded-xl">
              <CardContent className="p-[15px] flex flex-col h-[159px] items-start gap-2.5">
                <div className="flex flex-col h-[130px] items-start justify-between w-full">
                  <div className="items-center justify-end gap-[182px] flex w-full">
                    <div className="w-9 h-9 bg-gray-0 rounded-lg overflow-hidden flex items-center justify-center">
                      <img className="w-6 h-6" alt="Frame" src="/scale.png" />
                    </div>
                  </div>

                  <div className="flex items-start justify-end gap-8 w-full">
                    <div className="flex flex-col items-end gap-2 flex-1">
                      <div className="font-normal text-actionred text-sm text-right [direction:rtl]">
                        تنبيهات الوزن الزائد
                      </div>
                      <div className="inline-flex items-center justify-center gap-[7px]">
                        <div className="font-medium text-black-60 text-[22px] whitespace-nowrap">
                          34
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 flex-1">
                      <div className="font-normal text-gray-500 text-sm text-right [direction:rtl]">
                        الموازين النشطة
                      </div>
                      <div className="inline-flex items-center justify-center gap-[7px]">
                        <div className="opacity-0 font-normal text-actiongreen text-sm">
                          +0.00%
                        </div>
                        <div className="font-medium text-black-60 text-[22px] whitespace-nowrap">
                          2 / 3
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Bar Chart Card */}
        <Card className="w-full bg-white rounded-xl">
          <CardContent className="p-5">
            <div className="flex flex-col items-end gap-9 w-full">
              {/* Chart Header */}
              <div className="w-full flex justify-between items-center">
                <div className="inline-flex items-center gap-[7px]">
                  <ChevronDownIcon className="w-4 h-4" />
                  <div className="font-normal text-gray-700 text-xs text-right whitespace-nowrap [direction:rtl]">
                    آخر 7 أيام
                  </div>
                </div>

                <div className="inline-flex items-center gap-[21px]">
                  <Badge className="bg-[#5570f114] text-indigo-500 font-medium px-3 py-1.5 rounded-lg flex items-center gap-4">
                    <ChevronDownIcon className="w-5 h-5" />
                    <span className="text-right [direction:rtl]">التذاكر</span>
                  </Badge>
                  <h3 className="font-semibold text-black-60 text-base text-right whitespace-nowrap [direction:rtl]">
                    احصائيات
                  </h3>
                </div>
              </div>

              {/* Bar Chart */}
              <div className="flex items-end justify-between w-full">
                {/* Y-axis labels */}
                <div className="inline-flex flex-col items-start gap-[37px]">
                  {yAxisLabels.map((label, index) => (
                    <div
                      key={index}
                      className="font-normal text-gray-500 text-sm text-right"
                    >
                      {label}
                    </div>
                  ))}
                </div>

                {/* Bars */}
                {barChartData.map((bar, index) => (
                  <div
                    key={index}
                    className="inline-flex flex-col items-center gap-[19px]"
                  >
                    <div className="relative w-[18px] h-[241px] bg-[#eef0f9] rounded-[50px]">
                      <div
                        className="relative bg-indigo-500 rounded-[50px]"
                        style={{ height: bar.height, top: bar.top }}
                      />
                    </div>
                    <div className="text-gray-500 text-sm [direction:rtl]">
                      {bar.day}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default DataDisplaySection;