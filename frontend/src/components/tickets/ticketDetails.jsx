import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { ticketAPI } from "../../utils/ticket";
import { useToast } from "../ui/toast";

const TicketDetail = ({ ticketId, onClose }) => {
    const { error } = useToast();
    const [ticket, setTicket] = useState(null);

    useEffect(() => {
        fetchTicketDetails();
    }, [ticketId]);

    const fetchTicketDetails = async () => {
        try {
            const data = await ticketAPI.getOne(ticketId);
            setTicket(data);
        } catch (err) {
            error("", "فشل في تحميل تفاصيل التذكرة");
            console.error(err);
        }
    };

    if (!ticket) return null;

    const Field = ({ label, value }) => (
        <div className="flex flex-col">
            <span className="font-semibold text-gray-600">{label}:</span>
            <span className="font-bold text-gray-900">{value ?? "—"}</span>
        </div>
    );

    return ReactDOM.createPortal(
        <div dir="rtl" className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="absolute inset-0" onClick={onClose}></div>
            <div
                onClick={(e) => e.stopPropagation()}
                className="relative z-50 bg-white p-6 rounded-xl w-full max-w-lg text-sm shadow-xl overflow-y-auto max-h-[80vh]"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-indigo-700">تفاصيل التذكرة رقم #{ticket.id}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-lg font-bold">×</button>
                </div>

                {/* Ticket Details Grid */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <Field label="نوع التذكرة" value={ticket.ticket_type === "IN" ? "تفريغ" : "مبيعات"} />
                    <Field label="رقم المركبة" value={ticket.vehicle?.plate} />
                    <Field label="السائق" value={ticket.driver?.name} />
                    <Field label="العميل" value={ticket.customer?.name} />
                    <Field label="الوزن الأول" value={ticket.first_weight} />
                    {/* <Field label="الوزن الثاني" value={ticket.second_weight} /> */}
                    <Field label="المزرعة" value={ticket.farm} />
                    <Field label="عدد الأقفاص" value={ticket.boxes_number} />
                    <Field label="عدد الطيور" value={ticket.birds_number} />
                    <Field label="الميزان" value={ticket.scale?.name} />
                    <Field label="الملاحظات" value={ticket.notes} />
                </div>

                {/* Footer */}
                <div className="mt-6">
                    <button
                        onClick={onClose}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 transition text-white py-2 rounded font-semibold"
                    >
                        إغلاق
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default TicketDetail;
