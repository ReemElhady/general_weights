import React, { useState, useEffect } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { ticketAPI } from "../utils/ticket";
import { useToast } from "../components/ui/toast";
import TicketDetail from "../components/tickets/ticketDetails";

const Tickets = () => {
  const { success, error } = useToast();
  const [tickets, setTickets] = useState([]);
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [selectedAll, setSelectedAll] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [searchTerm, setSearchTerm] = useState("");
  const [ordering, setOrdering] = useState("-id");
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchTickets();
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, pagination.page, ordering]);

  const fetchTickets = async () => {
    try {
      const data = await ticketAPI.get({
        page: pagination.page,
        page_size: import.meta.env.VITE_PAGE_SIZE || 10,
        search: searchTerm,
        ordering: ordering,
      });

      const results = (Array.isArray(data) ? data : data.results || []).map((t) => ({
        ...t,
        showMenu: false,
      }));

      setTickets(results);
      setPagination((prev) => ({
        ...prev,
        totalPages: data.total_pages || 1,
      }));
    } catch (err) {
      alert(err.message);
    }
  };

  const toggleOrdering = (field) => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    setOrdering((prev) => (prev === field ? `-${field}` : field));
  };

  const renderArrows = (field) => {
    const isAsc = ordering === field;
    const isDesc = ordering === `-${field}`;
    return (
      <span className="inline-flex flex-col ml-1">
        <ChevronUp className={`w-3 h-3 ${isAsc ? "text-gray-800" : "text-gray-400"}`} />
        <ChevronDown className={`w-3 h-3 ${isDesc ? "text-gray-800" : "text-gray-400"}`} />
      </span>
    );
  };

  const toggleSelectAll = () => {
    if (selectedAll) {
      setSelectedTickets([]);
    } else {
      setSelectedTickets(tickets.map((t) => t.id));
    }
    setSelectedAll(!selectedAll);
  };

  const toggleSelect = (id) => {
    setSelectedTickets((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذه التذكرة؟")) return;
    try {
      await ticketAPI.delete(id);
      fetchTickets();
      success("", "تم حذف التذكرة بنجاح");
    } catch (err) {
      error("", "فشل في حذف التذكرة");
    }
  };

  const toggleMenu = (id) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, showMenu: !t.showMenu } : { ...t, showMenu: false }
      )
    );
  };

  const handlePageChange = (direction) => {
    setPagination((prev) => {
      const newPage = direction === "next" ? prev.page + 1 : prev.page - 1;
      if (newPage < 1 || newPage > prev.totalPages) return prev;
      return { ...prev, page: newPage };
    });
  };

  return (
    <div className="pt-2 px-6 space-y-4">
      {/* Top Search */}
      <div className="flex justify-end mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setPagination((prev) => ({ ...prev, page: 1 }));
            setSearchTerm(e.target.value);
          }}
          placeholder="... البحث عن التذاكر"
          className="w-full max-w-md pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5F4DEE] text-right"
        />
      </div>

      {/* Tickets Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full text-right" dir="rtl">
          <thead className="bg-gray-100 text-sm text-gray-700">
            <tr>
              <th className="py-3 px-4">
                <input type="checkbox" checked={selectedAll} onChange={toggleSelectAll} />
              </th>
              <th onClick={() => toggleOrdering("id")} className="py-3 px-4 cursor-pointer">
                <div className="flex flex-row items-center text-right">
                  رقم التذكرة
                  {renderArrows("id")}
                </div>
              </th>
              <th className="py-3 px-4">نوع التذكرة</th>
              <th className="py-3 px-4">السيارة</th>
              <th className="py-3 px-4">السائق</th>
              <th className="py-3 px-4">الوزن الأول</th>
              <th onClick={() => toggleOrdering("created_at")} className="py-3 px-4 cursor-pointer">
                <div className="flex flex-row items-center text-right">
                  التاريخ
                  {renderArrows("created_at")}
                </div>
              </th>
              <th className="py-3 px-4"></th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="border-b">
                <td className="py-2 px-4">
                  <input
                    type="checkbox"
                    checked={selectedTickets.includes(ticket.id)}
                    onChange={() => toggleSelect(ticket.id)}
                  />
                </td>
                <td className="py-2 px-4" onClick={() => setSelectedTicketId(ticket.id)}>{ticket.id}</td>
                <td className="py-2 px-4">{ticket.ticket_type === "IN" ? "تفريغ" : "مبيعات"}</td>
                <td className="py-2 px-4">{ticket.vehicle?.plate}</td>
                <td className="py-2 px-4">{ticket.driver?.name}</td>
                <td className="py-2 px-4">{ticket.first_weight || "—"}</td>
                <td className="py-2 px-4">{ticket.created_at?.slice(0, 10)}</td>
                <td className="py-2 px-4 relative">
                  <div className="relative inline-block text-left">
                    <button
                      type="button"
                      className="text-gray-500 hover:text-gray-700"
                      onClick={() => toggleMenu(ticket.id)}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 5.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 5.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" />
                      </svg>
                    </button>
                    {ticket.showMenu && (
                      <div className="absolute left-0 mt-2 w-28 bg-white border rounded shadow-lg z-10">
                        <button
                          className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-100 text-right"
                          onClick={() => handleDelete(ticket.id)}
                        >
                          حذف
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between items-center p-4 text-sm text-gray-600">
          <span>
            الصفحة {pagination.page} من {pagination.totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange("prev")}
              className="p-1 border rounded"
              disabled={pagination.page === 1}
            >
              &lt;
            </button>
            <span>{pagination.page}</span>
            <button
              onClick={() => handlePageChange("next")}
              className="p-1 border rounded"
              disabled={pagination.page === pagination.totalPages}
            >
              &gt;
            </button>
          </div>
        </div>
      </div>

      {/* Ticket Details Popup */}
      {selectedTicketId && (
        <TicketDetail
          ticketId={selectedTicketId}
          onClose={() => setSelectedTicketId(null)}
        />
      )}
    </div>

  );
};

export default Tickets;
