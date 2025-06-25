import React, { useState, useEffect } from "react";
import AddVehicleModal from "../components/vehicles/AddVehicleModal";
import EditVehicleModel from "../components/vehicles/EditVehicleModel";
import { vehicleAPI } from "../utils/vehicle";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useToast } from "../components/ui/toast";

const Vehicles = () => {
  const { success, error } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const [selectedAll, setSelectedAll] = useState(false);
  const [editingVehicleId, setEditingVehicleId] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [searchTerm, setSearchTerm] = useState("");
  const [ordering, setOrdering] = useState("id"); // default ordering

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchVehicles();
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, pagination.page, ordering]);

  const fetchVehicles = async () => {
    try {
      const data = await vehicleAPI.get({
        page: pagination.page,
        page_size: import.meta.env.VITE_PAGE_SIZE || 10,
        search: searchTerm,
        ordering: ordering,
      });

      const results = (Array.isArray(data) ? data : data.results || []).map((c) => ({
        ...c,
        showMenu: false,
      }));

      setVehicles(results);
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
        <ChevronUp
          className={`w-3 h-3 ${isAsc ? "text-gray-800" : "text-gray-400"}`}
        />
        <ChevronDown
          className={`w-3 h-3 ${isDesc ? "text-gray-800" : "text-gray-400"}`}
        />
      </span>
    );
  };


  const toggleSelectAll = () => {
    if (selectedAll) {
      setSelectedVehicles([]);
    } else {
      setSelectedVehicles(vehicles.map((c) => c.id));
    }
    setSelectedAll(!selectedAll);
  };

  const toggleSelect = (id) => {
    setSelectedVehicles((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleMenu = (id) => {
    setVehicles((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, showMenu: !c.showMenu } : { ...c, showMenu: false }
      )
    );
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا العميل؟")) return;
    try {
      await vehicleAPI.delete(id);
      fetchVehicles();
      success("", "تم حذف السيارة بنجاح");
    } catch (err) {
      error("", "فشل في حذف السيارة");
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
      {/* Top bar */}
      <div className="flex flex-col-reverse sm:flex-row items-start sm:items-center justify-between gap-4">
        <button
          onClick={() => setShowModal(true)}
          className="w-[125px] h-[36px] px-[12px] py-[6px] border border-[#5F4DEE] text-[#5F4DEE] rounded-[6px] flex items-center justify-center gap-2 hover:bg-[#5F4DEE] hover:text-white transition-colors"
        >
          + إضافة سيارة
        </button>

        <div className="flex flex-col w-full max-w-xl">
          <div className="relative w-full">
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
              placeholder="... البحث عن السيارات"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5F4DEE] text-right"
            />
          </div>
        </div>

      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full text-right" dir="rtl">
          <thead className="bg-gray-100 text-sm text-gray-700">
            <tr>
              <th className="py-3 px-4">
                <input type="checkbox" checked={selectedAll} onChange={toggleSelectAll} />
              </th>
              <th
                className="py-3 px-4 cursor-pointer select-none text-right"
                onClick={() => toggleOrdering("id")}
              >
                <div className="flex flex-row items-center text-right">
                  #
                  {renderArrows("id")}
                </div>
              </th>
              <th
                className="py-3 px-4 cursor-pointer select-none text-right"
                onClick={() => toggleOrdering("plate")}
              >
                <div className="flex flex-row items-center text-right">
                  رقم السيارة
                  {renderArrows("plate")}
                </div>
              </th>
              <th className="py-3 px-4 text-right">الشخص المسؤول</th>
              <th className="py-3 px-4 text-right">الهاتف</th>
              <th className="py-3 px-4 text-right">البريد الإلكتروني</th>
              <th
                className="py-3 px-4 cursor-pointer select-none text-right"
                onClick={() => toggleOrdering("joined_at")}
              >
                <div className="flex flex-row items-center text-right">
                  <span className="ml-auto">تاريخ/وقت الإضافة</span>
                  {renderArrows("joined_at")}
                </div>
              </th>
              <th className="py-3 px-4 text-right">الحالة</th>
              <th className="py-3 px-4"></th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id} className="border-b">
                <td className="py-2 px-4">
                  <input
                    type="checkbox"
                    checked={selectedVehicles.includes(vehicle.id)}
                    onChange={() => toggleSelect(vehicle.id)}
                  />
                </td>
                <td className="py-2 px-4">{vehicle.id}</td>
                <td className="py-2 px-4">{vehicle.name}</td>
                <td className="py-2 px-4">{vehicle.manager}</td>
                <td className="py-2 px-4">{vehicle.phone || "—"}</td>
                <td className="py-2 px-4">{vehicle.email || "—"}</td>
                <td className="py-2 px-4">{vehicle.joined_at}</td>
                <td className="py-2 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${vehicle.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                      }`}
                  >
                    {vehicle.status === "active" ? "نشط" : "غير نشط"}
                  </span>
                </td>
                <td className="py-2 px-4 relative">
                  <div className="relative inline-block text-left">
                    <button
                      type="button"
                      className="text-gray-500 hover:text-gray-700"
                      onClick={() => toggleMenu(vehicle.id)}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 5.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 5.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" />
                      </svg>
                    </button>
                    {vehicle.showMenu && (
                      <div className="absolute left-0 mt-2 w-28 bg-white border rounded shadow-lg z-10">
                        <button
                          className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-right"
                          onClick={() => {
                            setEditingVehicleId(vehicle.id);
                            toggleMenu(vehicle.id);
                          }}
                        >
                          تعديل
                        </button>
                        <button
                          className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-100 text-right"
                          onClick={() => handleDelete(vehicle.id)}
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
      {editingVehicleId && (
        <div>
        <EditVehicleModel
          vehicleId={editingVehicleId}
          onClose={() => {
            setEditingVehicleId(null);
            fetchVehicles();
          }}
        />
        </div>
      )}
      {showModal && (
        <AddVehicleModal
          onClose={() => {
            setShowModal(false);
            setOrdering("-id"); // newest first
            setPagination((prev) => ({ ...prev, page: 1 }));
            fetchVehicles();
          }}
        />
      )}
    </div>
  );
};

export default Vehicles;