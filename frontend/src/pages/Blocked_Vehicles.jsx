import React, { useState, useEffect } from "react";
import UnblockVehicleModal from '../components/blocked_vehicles/UnblockVehicleModal'
import { blockedVehicleAPI } from "../utils/blocked_vehicle";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useToast } from "../components/ui/toast";
import { Ban } from "lucide-react";

const Blocked_Vehicles = () => {
  const { success, error } = useToast();
  const [vehicles, setVehicles] = useState([]);
  const [stats, setStats] = useState({ blocked: 0, unblocked: 0 });
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const [selectedAll, setSelectedAll] = useState(false);
  const [unblockingVehicleId, setUnblockingVehicleId] = useState(null);
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
      const data = await blockedVehicleAPI.get({
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
      setStats({
        blocked: data.blocked_count || 0,
        unblocked: data.unblocked_count || 0,
      });

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
      await blockedVehicleAPI.delete(id);
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
      <div className="flex flex-col-reverse sm:flex-row items-start sm:items-center justify-end gap-4">
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

      {/* Stats Bar */}
      <div className="flex items-center gap-4 text-sm text-gray-600 mt-2" dir="rtl">
        <span className="flex items-center gap-1">
          <span className="text-purple-700 font-medium">السيارات المحظورة</span>
          <span>({stats.blocked})</span>
        </span>

        <span className="text-gray-300">|</span>

        <span className="flex items-center gap-1">
          <span className="text-gray-500">فك الحظر</span>
          <span>({stats.unblocked})</span>
        </span>
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
                onClick={() => toggleOrdering("vehicle.plate")}
              >
                <div className="flex flex-row items-center text-right">
                  رقم السيارة
                  {renderArrows("vehicle.plate")}
                </div>
              </th>
              <th className="py-3 px-4 text-right">الرخصة</th>
              <th className="py-3 px-4 text-right">الموديل</th>
              <th className="py-3 px-4 text-right">الماركة</th>
              <th className="py-3 px-4 text-right">قيمة التلاعب</th>
              <th className="py-3 px-4 text-right">حظر بواسطة</th>
              <th className="py-3 px-4 text-right">التاريخ/الوقت الحظر</th>
              <th className="py-3 px-4 text-right">الحالة</th>
              <th className="py-3 px-4"></th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {vehicles.map((blockedVehicle) => (
              <tr key={blockedVehicle.id} className="border-b">
                <td className="py-2 px-4">
                  <input
                    type="checkbox"
                    checked={selectedVehicles.includes(blockedVehicle.id)}
                    onChange={() => toggleSelect(blockedVehicle.id)}
                  />
                </td>
                <td className="py-2 px-4">{blockedVehicle.id}</td>
                <td className="py-2 px-4">{blockedVehicle.vehicle.plate}</td>
                <td className="py-2 px-4">{blockedVehicle.vehicle.license || "-"}</td>
                <td className="py-2 px-4">{blockedVehicle.model || "—"}</td>
                <td className="py-2 px-4">{blockedVehicle.type || "—"}</td>
                <td className="py-2 px-4">{blockedVehicle.manipulative_value || "-"}</td>
                <td className="py-2 px-4">{`${blockedVehicle.manipulative_user.first_name} ${blockedVehicle.manipulative_user.last_name}` || "-"}</td>
                <td className="py-2 px-4">
                  {blockedVehicle.manipulative_date
                    ? `${new Date(blockedVehicle.manipulative_date).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", })} - ${new Date(blockedVehicle.manipulative_date).toLocaleDateString("en-GB")}`
                    : "-"}
                </td>
                <td className="py-2 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${blockedVehicle.status === "unblocked"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                      }`}
                  >
                    {blockedVehicle.status === "unblocked" ? "ليست محظورة" : "محظورة"}
                  </span>
                </td>
                <td className="py-2 px-4 relative">
                  <button
                    className="w-[120px] h-[30px] px-4 py-[4px] text-sm text-red-600 border border-red-600 rounded-[8px] hover:bg-red-50 flex items-center justify-center gap-1"
                    onClick={() => {
                      setUnblockingVehicleId(blockedVehicle.id);
                      toggleMenu(blockedVehicle.id);
                    }}
                  >
                    <Ban className="w-4 h-4" />
                    <span>فك الحظر</span>
                  </button>


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

      {unblockingVehicleId && (
        <div>
          <UnblockVehicleModal
            vehicleId={unblockingVehicleId}
            isOpen={!!unblockingVehicleId}
            onClose={() => setUnblockingVehicleId(null)}
            onSuccess={() => {
              fetchVehicles();
              success("", "تم فك الحظر بنجاح");
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Blocked_Vehicles;