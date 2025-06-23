import React, { useState, useEffect } from "react";
import AddScaleModal from "./AddScaleModal";
import EditScalePage from "./EditScalePage";

const Scales = () => {
  const [showModal, setShowModal] = useState(false);
  const [scales, setScales] = useState([]);
  const [selectedAll, setSelectedAll] = useState(false);
  const [selectedScales, setSelectedScales] = useState([]);
  const [editingScaleId, setEditingScaleId] = useState(null);

  useEffect(() => {
    fetchScales();
  }, []);

  const fetchScales = () => {
    fetch("http://localhost:8000/api/v1/business/scales/", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const results = (Array.isArray(data) ? data : data.results || []).map(
          (s) => ({
            ...s,
            showMenu: false,
          })
        );
        setScales(results);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  };

  const toggleSelectAll = () => {
    if (selectedAll) {
      setSelectedScales([]);
    } else {
      setSelectedScales(scales.map((scale) => scale.id));
    }
    setSelectedAll(!selectedAll);
  };

  const toggleSelect = (id) => {
    setSelectedScales((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleMenu = (id) => {
    setScales((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, showMenu: !s.showMenu } : { ...s, showMenu: false }
      )
    );
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا الميزان؟")) return;

    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/business/scales/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.ok) {
        fetchScales();
      } else {
        alert("فشل في الحذف");
      }
    } catch (err) {
      alert("حدث خطأ أثناء الحذف");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-start">
        <button
          onClick={() => setShowModal(true)}
          className="border border-[#5F4DEE] text-[#5F4DEE] px-4 py-2 rounded-lg hover:bg-[#5F4DEE] hover:text-white transition-colors"
        >
          + إضافة ميزان
        </button>
      </div>

      <div className="flex flex-wrap gap-4 justify-end items-center">
        <div className="flex items-center gap-2 order-1">
          <input
            type="text"
            placeholder="...البحث عن الموازين"
            className="border border-gray-300 rounded-lg px-4 py-2 w-64"
          />
        </div>

        <div className="flex items-center gap-2 order-2">
          <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-1">
            <span>التصفية</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L15 13.414V20a1 1 0 01-1.447.894l-4-2A1 1 0 019 18v-4.586L3.293 6.707A1 1 0 013 6V4z"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow min-h-[70vh]">
        <table className="min-w-full text-right" dir="rtl">
          <thead className="bg-gray-100 text-sm text-gray-700">
            <tr>
              <th className="py-3 px-4">
                <input
                  type="checkbox"
                  checked={selectedAll}
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="py-3 px-4">اسم الميزان</th>
              <th className="py-3 px-4">الشركة المصنعة</th>
              <th className="py-3 px-4">الموديل</th>
              <th className="py-3 px-4">نوع الاتصال</th>
              <th className="py-3 px-4">عنوان الوصول</th>
              <th className="py-3 px-4">البورت</th>
              <th className="py-3 px-4">المنفذ التسلسلي</th>
              <th className="py-3 px-4">Baudrate</th>
              <th className="py-3 px-4">Delay</th>
              <th className="py-3 px-4">عدد البتات</th>
              <th className="py-3 px-4">الحالة</th>
              <th className="py-3 px-4"></th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {scales.map((scale) => (
              <tr key={scale.id} className="border-b">
                <td className="py-2 px-4">
                  <input
                    type="checkbox"
                    checked={selectedScales.includes(scale.id)}
                    onChange={() => toggleSelect(scale.id)}
                  />
                </td>
                <td className="py-2 px-4">{scale.name}</td>
                <td className="py-2 px-4">{scale.manufacturer}</td>
                <td className="py-2 px-4">{scale.model}</td>
                <td className="py-2 px-4">{scale.connection_type}</td>
                <td className="py-2 px-4">{scale.ip}</td>
                <td className="py-2 px-4">{scale.port}</td>
                <td className="py-2 px-4">{scale.serial_port}</td>
                <td className="py-2 px-4">{scale.baudrate}</td>
                <td className="py-2 px-4">{scale.delay}</td>
                <td className="py-2 px-4">{scale.bits_number}</td>
                <td className="py-2 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      scale.status
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {scale.status ? "في الخدمة" : "خارج الخدمة (صيانة)"}
                  </span>
                </td>
                <td className="py-2 px-4 relative">
                  <div className="relative inline-block text-left">
                    <button
                      type="button"
                      className="text-gray-500 hover:text-gray-700"
                      onClick={() => toggleMenu(scale.id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 5.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 5.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" />
                      </svg>
                    </button>
                    {scale.showMenu && (
                      <div className="absolute left-0 mt-2 w-28 bg-white border rounded shadow-lg z-10">
                        <button
                          className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-right"
                          onClick={() => {
                            setEditingScaleId(scale.id);
                            toggleMenu(scale.id);
                          }}
                        >
                          تعديل
                        </button>
                        <button
                          className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-100 text-right"
                          onClick={() => handleDelete(scale.id)}
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

        <div className="flex justify-between items-center p-4 text-sm text-gray-600">
          <span>1-20 of {scales.length}</span>
          <div className="flex items-center gap-2">
            <button className="p-1 border rounded">&lt;</button>
            <span>1/1</span>
            <button className="p-1 border rounded">&gt;</button>
          </div>
        </div>
      </div>

      {editingScaleId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded shadow-lg max-w-4xl w-full max-h-[90vh] overflow-auto p-4 relative">
            <button
              className="absolute top-2 left-2 text-red-600 font-bold"
              onClick={() => setEditingScaleId(null)}
            >
              إغلاق
            </button>
            <EditScalePage
              scaleId={editingScaleId}
              onClose={() => setEditingScaleId(null)}
            />
          </div>
        </div>
      )}

      {showModal && <AddScaleModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default Scales;
