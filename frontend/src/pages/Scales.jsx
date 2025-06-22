import React, { useState, useEffect } from "react";
import AddScaleModal from "./AddScaleModal";

const Scales = () => {
  const [showModal, setShowModal] = useState(false);
  const [scales, setScales] = useState([]);
  const [selectedAll, setSelectedAll] = useState(false);
  const [selectedScales, setSelectedScales] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/v1/business/scales/", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("API Response:", data);
        const results = Array.isArray(data) ? data : data.results || [];
        setScales(results);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  }, []);

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


      {/* الجدول */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full text-right" dir="rtl">
          <thead className="bg-gray-100 text-sm text-gray-700">
            <tr>
              <th className="py-3 px-4">
                <input type="checkbox" checked={selectedAll} onChange={toggleSelectAll} />
              </th>
              <th className="py-3 px-4">اسم الميزان</th>
              <th className="py-3 px-4">الشركة المصنعة</th>
              <th className="py-3 px-4">الموديل</th>
              <th className="py-3 px-4">نوع الاتصال</th>
              <th className="py-3 px-4">عنوان الوصول</th>
              <th className="py-3 px-4">البورت</th>
              <th className="py-3 px-4">المنفذ التسلسلي</th>
              <th className="py-3 px-4">Baudrate</th>
              <th className="py-3 px-4">Parity</th>
              <th className="py-3 px-4">Stop Bits</th>
              <th className="py-3 px-4">Flow Control</th>
              <th className="py-3 px-4">Delay</th>
              <th className="py-3 px-4">عدد البتات</th>
              <th className="py-3 px-4">الحالة</th>
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
                <td className="py-2 px-4">{scale.parity}</td>
                <td className="py-2 px-4">{scale.stop_bits}</td>
                <td className="py-2 px-4">{scale.flow_control}</td>
                <td className="py-2 px-4">{scale.delay}</td>
                <td className="py-2 px-4">{scale.bits_number}</td>
                <td className="py-2 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      scale.status ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {scale.status ? "في الخدمة" : "خارج الخدمة (صيانة)"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* pagination */}
        <div className="flex justify-between items-center p-4 text-sm text-gray-600">
          <span>1-20 of {scales.length}</span>
          <div className="flex items-center gap-2">
            <button className="p-1 border rounded">&lt;</button>
            <span>1/1</span>
            <button className="p-1 border rounded">&gt;</button>
          </div>
        </div>
      </div>

      {/* المودال */}
      {showModal && <AddScaleModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default Scales;
