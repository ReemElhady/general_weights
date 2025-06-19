import React from "react";
import { ChevronLeftIcon } from "lucide-react";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

// Sample data based on the UI
const iconTicket = "/ticket-1.png"; // Default icon for tickets

const tickets = [
  {
    id: "ع ق ل 3745",
    date: "15 Mar 2025, 12:47 PM",
    customerName: "احمد علي السيد",
    status: {
      text: "في انتظار الوزن الاول",
      type: "pending",
    },
    weights: {
      first: "-",
      second: "-",
      third: "-",
    },
    iconSrc: iconTicket,
  },
  {
    id: "ع ق ل 3745",
    date: "15 Mar 2025, 12:47 PM",
    customerName: "احمد علي السيد",
    status: {
      text: "في انتظار الوزن الثاني",
      type: "pending",
    },
    weights: {
      first: "12,000",
      second: "-",
      third: "-",
    },
    iconSrc: iconTicket,
  },
  {
    id: "ع ق ل 3745",
    date: "15 Mar 2025, 12:47 PM",
    customerName: "احمد علي السيد",
    status: {
      text: "مكتملة",
      type: "completed",
    },
    weights: {
      first: "12,000",
      second: "28,000",
      third: "16,000",
    },
    iconSrc: iconTicket,
  },
  {
    id: "ع ق ل 3745",
    date: "15 Mar 2025, 12:47 PM",
    customerName: "احمد علي السيد",
    status: {
      text: "مكتملة",
      type: "completed",
    },
    weights: {
      first: "12,000",
      second: "28,000",
      third: "16,000",
    },
    iconSrc: iconTicket,
  },
  {
    id: "ع ق ل 3745",
    date: "15 Mar 2025, 12:47 PM",
    customerName: "احمد علي السيد",
    status: {
      text: "مكتملة",
      type: "completed",
    },
    weights: {
      first: "12,000",
      second: "28,000",
      third: "16,000",
    },
    iconSrc: iconTicket,
  },
  {
    id: "ع ق ل 3745",
    date: "15 Mar 2025, 12:47 PM",
    customerName: "احمد علي السيد",
    status: {
      text: "مكتملة",
      type: "completed",
    },
    weights: {
      first: "12,000",
      second: "28,000",
      third: "16,000",
    },
    iconSrc: iconTicket,
  },
];

const ChartSection = () => {
  return (
    <section className="w-full max-w-[425px]">
      <Card className="shadow-[0px_0px_1px_#0f224314,0px_8px_64px_#0e21430d]">
        <CardHeader className="pb-0 flex flex-row justify-between items-center">
          <CardTitle className="[font-family:'Rubik',Helvetica] font-semibold text-black-60 text-base [direction:rtl]">
            التذاكر الأخيرة
          </CardTitle>
          <a
            href="#"
            className="[font-family:'Rubik',Helvetica] font-normal text-indigo-500 text-xs underline [direction:rtl]"
          >
            عرض المزيد
          </a>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-3">
            {tickets.map((ticket, index) => (
              <div
                key={index}
                className="flex flex-col gap-2.5 pb-3 border-b border-[#f1f2f8]"
              >
                <div className="flex items-start gap-3.5 w-full">
                  <div className="flex flex-col gap-2.5 flex-1">
                    <div className="flex items-start justify-between w-full">
                      <div className="inline-flex items-start">
                        <span className="text-black-20 text-xs [font-family:'Rubik',Helvetica] font-normal">
                          {ticket.date}
                        </span>
                      </div>
                      <div className="[font-family:'Rubik',Helvetica] font-normal text-black-60 text-xs text-left [direction:rtl]">
                        {ticket.customerName}
                      </div>
                    </div>
                    <div className="flex items-end justify-between w-full">
                      <Badge
                        className={`h-5 px-2 py-px justify-end ${
                          ticket.status.type === "pending"
                            ? "bg-indigo-0 text-indigo-500"
                            : "bg-[#e0fcee] text-[#147f49]"
                        }`}
                      >
                        <span className="[font-family:'Rubik',Helvetica] font-medium text-[11px] tracking-[0.33px] leading-[13.2px] [direction:rtl]">
                          {ticket.status.text}
                        </span>
                      </Badge>
                      <div className="inline-flex items-start">
                        <span className="[font-family:'Rubik',Helvetica] font-medium text-black-80 text-base text-left [direction:rtl]">
                          {ticket.id}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="w-[49px] h-[49px] bg-[url(/rectangle-3-5.png)] bg-cover bg-[50%_50%] relative">
                    <img
                      className="absolute top-[13px] left-[13px] w-6 h-6"
                      alt="Ticket"
                      src={ticket.iconSrc}
                    />
                  </div>
                </div>
                <div className="flex h-12 items-center justify-center px-2.5 py-3 w-full">
                  <div className="flex items-center gap-[7px] w-full">
                    <div className="flex w-[98px] justify-center bg-gray-50 items-center px-2 py-px rounded">
                      <div className="[font-family:'Inter',Helvetica] font-medium text-gray-700 text-xs tracking-[0.36px] leading-[18px]">
                        {ticket.weights.third}
                      </div>
                    </div>
                    <ChevronLeftIcon className="w-4 h-4" />
                    <div className="flex w-[97px] justify-center bg-gray-50 items-center px-2 py-px rounded">
                      <div className="[font-family:'Inter',Helvetica] font-medium text-gray-700 text-xs tracking-[0.36px] leading-[18px]">
                        {ticket.weights.second}
                      </div>
                    </div>
                    <ChevronLeftIcon className="w-4 h-4" />
                    <div className="flex w-[97px] justify-center bg-gray-50 items-center px-2 py-px rounded">
                      <div className="[font-family:'Inter',Helvetica] font-medium text-gray-700 text-xs tracking-[0.36px] leading-[18px]">
                        {ticket.weights.first}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default ChartSection;