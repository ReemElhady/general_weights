import React, { useState, useEffect } from "react";
import AddClientModal from "../components/clients/AddClientModal";
import EditClientPage from "../components/clients/EditClientPage";
import { clientAPI } from "../utils/client";

const Customers = () => {
  const [showModal, setShowModal] = useState(false);
  const [clients, setClients] = useState([]);
  const [selectedClients, setSelectedClients] = useState([]);
  const [selectedAll, setSelectedAll] = useState(false);
  const [editingClientId, setEditingClientId] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchClients();
    }, 500); // debounce input


    return () => clearTimeout(delayDebounce);
  }, [searchTerm, pagination.page]);

  const fetchClients = async () => {
    try {
      const data = await clientAPI.get({
        page: pagination.page,
        page_size: import.meta.env.VITE_PAGE_SIZE || 10,
        search: searchTerm,
      });

      const results = (Array.isArray(data) ? data : data.results || []).map((c) => ({
        ...c,
        showMenu: false,
      }));

      setClients(results);
      setPagination((prev) => ({
        ...prev,
        totalPages: data.total_pages || 1,
      }));
    } catch (err) {
      alert(err.message);
    }
  };

  const toggleSelectAll = () => {
    if (selectedAll) {
      setSelectedClients([]);
    } else {
      setSelectedClients(clients.map((c) => c.id));
    }
    setSelectedAll(!selectedAll);
  };

  const toggleSelect = (id) => {
    setSelectedClients((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleMenu = (id) => {
    setClients((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, showMenu: !c.showMenu } : { ...c, showMenu: false }
      )
    );
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا العميل؟")) return;

    try {
      await clientAPI.delete(id);
      fetchClients();
    } catch (err) {
      alert("حدث خطأ أثناء الحذف: " + err.message);
    }
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
      {/* Top bar: Add client & Search */}
      <div className="flex flex-col-reverse sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Add Client Button */}
        <button
          onClick={() => setShowModal(true)}
          className="w-[121px] h-[36px] px-[12px] py-[6px] border border-[#5F4DEE] text-[#5F4DEE] rounded-[6px] flex items-center justify-center gap-2 hover:bg-[#5F4DEE] hover:text-white transition-colors"
        >
          + إضافة عميل
        </button>

        {/* Search input */}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setPagination((prev) => ({ ...prev, page: 1 }));
            setSearchTerm(e.target.value);
          }}
          placeholder="ابحث عن عميل..."
          className="w-full max-w-[300px] border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5F4DEE]"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full text-right" dir="rtl">
          <thead className="bg-gray-100 text-sm text-gray-700">
            <tr>
              <th className="py-3 px-4">
                <input type="checkbox" checked={selectedAll} onChange={toggleSelectAll} />
              </th>
              <th className="py-3 px-4">الاسم</th>
              <th className="py-3 px-4">الشخص المسؤول</th>
              <th className="py-3 px-4">الهاتف</th>
              <th className="py-3 px-4">البريد الإلكتروني</th>
              <th className="py-3 px-4">تاريخ/وقت الاضافة</th>
              <th className="py-3 px-4">الحالة</th>
              <th className="py-3 px-4"></th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {clients.map((client) => (
              <tr key={client.id} className="border-b">
                <td className="py-2 px-4">
                  <input
                    type="checkbox"
                    checked={selectedClients.includes(client.id)}
                    onChange={() => toggleSelect(client.id)}
                  />
                </td>
                <td className="py-2 px-4">{client.name}</td>
                <td className="py-2 px-4">{client.manager}</td>
                <td className="py-2 px-4">{client.phone || "—"}</td>
                <td className="py-2 px-4">{client.email || "—"}</td>
                <td className="py-2 px-4">{client.joined_at}</td>
                <td className="py-2 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${client.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                      }`}
                  >
                    {client.status === "active" ? "نشط" : "غير نشط"}
                  </span>
                </td>
                <td className="py-2 px-4 relative">
                  <div className="relative inline-block text-left">
                    <button
                      type="button"
                      className="text-gray-500 hover:text-gray-700"
                      onClick={() => toggleMenu(client.id)}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 5.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 5.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" />
                      </svg>
                    </button>
                    {client.showMenu && (
                      <div className="absolute left-0 mt-2 w-28 bg-white border rounded shadow-lg z-10">
                        <button
                          className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-right"
                          onClick={() => {
                            setEditingClientId(client.id);
                            toggleMenu(client.id);
                          }}
                        >
                          تعديل
                        </button>
                        <button
                          className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-100 text-right"
                          onClick={() => handleDelete(client.id)}
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

      {/* Modals */}
      {editingClientId && (
        <EditClientPage
          clientId={editingClientId}
          onClose={() => {
            setEditingClientId(null);
            fetchClients();
          }}
        />
      )}

      {showModal && (
        <AddClientModal
          onClose={() => {
            setShowModal(false);
            fetchClients();
          }}
        />
      )}
    </div>
  );
};

export default Customers;
