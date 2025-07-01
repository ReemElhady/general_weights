import React, { useState, useEffect } from "react";
import { ChevronUp, ChevronDown, Filter } from "lucide-react";
import { ticketAPI } from "../utils/ticket";
import { useToast } from "../components/ui/toast";
import TicketDetail from "../components/tickets/ticketDetails";
import { useNavigate } from "react-router-dom";
import { Printer } from "lucide-react";


const BASE_URL = import.meta.env.VITE_BASE_URL;


const Tickets = () => {
  const { success, error } = useToast();
  const [tickets, setTickets] = useState([]);
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [selectedAll, setSelectedAll] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [searchTerm, setSearchTerm] = useState("");
  const [ordering, setOrdering] = useState("-id");
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchTickets();
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, pagination.page, ordering, activeTab]);

  const fetchTickets = async () => {
    try {
      const params = {
        page: pagination.page,
        page_size: import.meta.env.VITE_PAGE_SIZE || 10,
        search: searchTerm,
        ordering: ordering,
      };

      // Tab filter
      if (activeTab === "completed") {
        params.is_completed = true;
      } else if (activeTab === "incomplete") {
        params.is_completed = false;
      }

      // Date filters
      if (startDate) params.from = startDate;
      if (endDate) params.to = endDate;


      const data = await ticketAPI.get(params);

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

  const handlePrint = async (id) => {
    console.log("Printing ticket:", id);

    const url = `${BASE_URL}/tickets/${id}/print/`;
    window.open(url, "_blank"); // Open in new tab
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

  const handleSecondWeight = (ticketId) => {
    navigate(`/tickets/first-weight?ticket=${ticketId}&mode=second_weight`);
  };

  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [activeMenuTicketId, setActiveMenuTicketId] = useState(null);
  useEffect(() => {
    const handleClickOutside = () => setActiveMenuTicketId(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);
  const handleMenuOpen = (e, ticketId) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuPosition({
      x: rect.left,
      y: rect.bottom + window.scrollY,
    });
    setActiveMenuTicketId(ticketId);
  };

  const handleExportAllExcel = async () => {
    try {
      await ticketAPI.exportAllFilteredExcel({
        search: searchTerm,
        ordering,
        is_completed: activeTab === "completed" ? "true" : activeTab === "incomplete" ? "false" : "",
        from: startDate,
        to: endDate,
      });

    } catch (err) {
      error("", "فشل تصدير البيانات");
    }
  };

  const handleExportAllPDF = async () => {
    try {
      await ticketAPI.exportAllFilteredPDF({
        search: searchTerm,
        ordering,
        is_completed: activeTab === "completed" ? "true" : activeTab === "incomplete" ? "false" : "",
        from: startDate,
        to: endDate,
      });
    } catch (err) {
      error("", "فشل تصدير البيانات");
    }
  };

  return (
    <div className="pt-2 px-6 space-y-4">
      {/* Tabs Row */}
      <div className="flex justify-between items-center flex-wrap gap-2 mb-2">
        {/* Left: Export buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleExportAllExcel}
            className="px-3 py-2 bg-green-500 text-white rounded"
          >
            Export Excel
          </button>
          <button
            onClick={handleExportAllPDF}
            className="px-3 py-2 bg-red-500 text-white rounded"
          >
            Export PDF
          </button>
        </div>
        {/* Right: Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => {
              setActiveTab("incomplete");
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
            className={`px-4 py-2 rounded ${activeTab === "incomplete" ? "bg-red-500 text-white" : "bg-gray-100"}`}
          >
            غير مكتملة 🚩
          </button>
          <button
            onClick={() => {
              setActiveTab("completed");
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
            className={`px-4 py-2 rounded ${activeTab === "completed" ? "bg-green-500 text-white" : "bg-gray-100"}`}
          >
            المكتملة ✅
          </button>
          <button
            onClick={() => {
              setActiveTab("all");
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
            className={`px-4 py-2 rounded ${activeTab === "all" ? "bg-indigo-500 text-white" : "bg-gray-100"}`}
          >
            كل التذاكر
          </button>
        </div>


      </div>


      {/* Filter Row (Date filters + Buttons + Search Input) */}
      <div className="flex flex-wrap md:flex-nowrap justify-between items-end gap-2 mb-4">
        {/* Left Side - Date Filters + Buttons */}
        <div className="flex flex-wrap items-end gap-2">
          {/* From Date */}
          <div className="flex flex-col">
            <label className="text-sm mb-1">من تاريخ</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border px-3 py-2 rounded-md text-right w-36 text-sm"
            />
          </div>

          {/* To Date */}
          <div className="flex flex-col">
            <label className="text-sm mb-1">إلى تاريخ</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border px-3 py-2 rounded-md text-right w-36 text-sm"
            />
          </div>

          {/* Filter Button */}
          <button
            onClick={() => fetchTickets()}
            className="flex items-center gap-1 px-3 py-2 bg-indigo-500 text-white rounded text-sm hover:bg-indigo-600"
          >
            <Filter className="w-4 h-4" />
            تصفية
          </button>

          {/* Clear Button */}
          <button
            onClick={() => {
              setStartDate("");
              setEndDate("");
              setSearchTerm("");
              fetchTickets();
            }}
            className="flex items-center gap-1 px-3 py-2 bg-gray-300 text-gray-800 rounded text-sm hover:bg-gray-400"
          >
            <span className="material-icons text-base"></span>
            مسح
          </button>
        </div>

        {/* Right Side - Search */}
        <div className="flex flex-col w-full max-w-xl">

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
                />
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setPagination((prev) => ({ ...prev, page: 1 }));
                setSearchTerm(e.target.value);
              }}
              placeholder="... البحث عن التذاكر"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5F4DEE] text-right"
            />
          </div>
        </div>
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
              <th className="py-3 px-4 text-center">السيارة</th>
              <th className="py-3 px-4 text-center">السائق</th>
              <th className="py-3 px-4 text-center">العميل</th>
              <th className="py-3 px-4 text-center">البضاعة</th>
              <th className="py-3 px-4 text-center">نوع التذكرة</th>
              <th className="py-3 px-4 text-center">الوزن الأول</th>
              <th onClick={() => toggleOrdering("created_at")} className="py-3 px-4 cursor-pointer">
                <div className="flex flex-row items-center text-right">
                  تاريخ الوزن الأول
                  {renderArrows("created_at")}
                </div>
              </th>
              <th className="py-3 px-4 text-center">الوزن الثاني</th>
              <th className="py-3 px-4 text-center">تاريخ الوزن الثاني</th>
              <th className="py-3 px-4 text-center">صافي الوزن</th>
              <th className="py-3 px-4 text-center w-24">الحالة</th>
              <th className="py-2 px-3 text-center"></th>
              <th className="py-1 px-1 text-center"></th>
              <th className="py-1 px-1 text-center"></th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="border-b hover:bg-gray-100 cursor-pointer">
                <td className="py-2 px-4">
                  <input
                    type="checkbox"
                    checked={selectedTickets.includes(ticket.id)}
                    onClick={(e) => e.stopPropagation()}
                    onChange={() => toggleSelect(ticket.id)}
                  />
                </td>
                <td className="py-2 px-4 text-center" onClick={() => setSelectedTicketId(ticket.id)}>
                  {ticket.id}
                </td>
                <td className="py-2 px-4 text-center">{ticket.vehicle?.plate}</td>
                <td className="py-2 px-4 text-center">{ticket.driver?.name}</td>
                <td className="py-2 px-4 text-center">{ticket.customer?.name}</td>
                <td className="py-2 px-4 text-center">{ticket.item?.name}</td>
                <td className="py-2 px-4 text-center">{ticket.ticket_type === "IN" ? "تفريغ" : "مبيعات"}</td>
                <td className="py-2 px-4 text-center">{ticket.first_weight || "—"}</td>
                <td className="py-2 px-4 text-center">{ticket.first_weight_date?.slice(0, 10)}</td>
                <td className="py-2 px-4 text-center">{ticket.second_weight || "—"}</td>
                <td className="py-2 px-4 text-center">{ticket.second_weight_date?.slice(0, 10) || "—"}</td>
                <td className="py-2 px-4 text-center">{ticket.net_weight || "—"}</td>
                <td className="py-2 px-4 text-center">
                  {ticket.is_completed ? (
                    <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                      مكتملة
                    </span>
                  ) : (
                    <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-700">
                      غير مكتملة
                    </span>
                  )}
                </td>
                <td className="py-2 px-4 text-center">
                  {!ticket.second_weight && activeTab !== "completed" && (
                    <button
                      className="px-4 py-1 bg-indigo-500 text-white rounded text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSecondWeight(ticket.id);
                      }}
                    >
                      الوزن الثاني
                    </button>
                  )}
                </td>
                <td className="py-2 px-4 text-center">
                  <button
                    className="px-4 py-1 bg-white-500 text-black rounded text-xs"
                    // className="px-4 py-1 bg-green-500 text-white rounded text-xs"

                    onClick={() => handlePrint(ticket.id)}
                  >
                      <Printer className="w-4 h-4" />

                  </button>
                </td>
                <td className="py-2 px-4 relative text-center">
                  <div className="relative inline-block text-left">
                    <button
                      type="button"
                      className="text-gray-500 hover:text-gray-700"
                      onClick={(e) => handleMenuOpen(e, ticket.id)}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 5.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 5.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" />
                      </svg>
                    </button>

                    {/* {ticket.showMenu && (
                      <div className="absolute left-0 mt-2 w-28 bg-white border rounded shadow-lg z-10">
                        <button
                          className="w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-100 text-center"
                          onClick={() => handlePrint(ticket.id)}
                        >
                          طباعة
                        </button>
                        <button
                          className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-100 text-center"
                          onClick={() => handleDelete(ticket.id)}
                        >
                          حذف
                        </button>
                        <button
                          className="w-full px-4 py-2 text-sm text-green-600 hover:bg-green-100 text-center"
                          onClick={() => ticketAPI.exportOne(ticket.id)}
                        >
                          Export As Excel
                        </button>

                      </div>
                    )} */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {activeMenuTicketId && (
          <div
            style={{
              position: "absolute",
              top: menuPosition.y,
              left: menuPosition.x,
              zIndex: 9999,
            }}
            className="bg-white border rounded shadow-lg w-32"
          >
            <button
              className="w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-100 text-center"
              onClick={() => handlePrint(activeMenuTicketId)}
            >
              🖨️ طباعة
            </button>
            <button
              className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-100 text-center"
              onClick={() => handleDelete(activeMenuTicketId)}
            >
              حذف
            </button>
            {/* <button
              className="w-full px-4 py-2 text-sm text-green-600 hover:bg-green-100 text-center"
              onClick={() => ticketAPI.exportOne(activeMenuTicketId)}
            >
              Export As Excel
            </button>
            <button
              className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-100 text-center"
              onClick={() => ticketAPI.exportOnePDF(activeMenuTicketId)}
            >
              Export as PDF
            </button> */}

          </div>
        )}

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
