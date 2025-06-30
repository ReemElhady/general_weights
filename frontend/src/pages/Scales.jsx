import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AddScaleModal from "../components/scales/AddScaleModal";
import EditScalePage from "../components/scales/EditScalePage";
import { ChevronUp, ChevronDown } from "lucide-react";

const DEFAULT_PAGE_SIZE = parseInt(import.meta.env.VITE_DEFAULT_PAGE_SIZE || "10", 10);

const Scales = () => {
  const [showModal, setShowModal] = useState(false);
  const [scales, setScales] = useState([]);
  const [selectedAll, setSelectedAll] = useState(false);
  const [selectedScales, setSelectedScales] = useState([]);
  const [editingScaleId, setEditingScaleId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [ordering, setOrdering] = useState("-id");
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [headerMenuOpen, setHeaderMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const headerMenuRef = useRef(null);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchScales();
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, pagination.page, ordering, pageSize]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setScales((prev) => prev.map((s) => ({ ...s, showMenu: false })));
      }
      if (headerMenuRef.current && !headerMenuRef.current.contains(event.target)) {
        setHeaderMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchScales = () => {
    fetch(
      `http://localhost:8000/api/v1/business/scales/?search=${searchTerm}&page=${pagination.page}&ordering=${ordering}&page_size=${pageSize}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        const results = (Array.isArray(data.results) ? data.results : []).map(
          (s) => ({ ...s, showMenu: false })
        );
        setScales(results);
        setPagination((prev) => ({
          ...prev,
          totalPages: data.total_pages || 1,
        }));
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
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

  const handlePageChange = (direction) => {
    setPagination((prev) => {
      const newPage = direction === "next" ? prev.page + 1 : prev.page - 1;
      if (newPage < 1 || newPage > prev.totalPages) return prev;
      return { ...prev, page: newPage };
    });
  };
  return (
    <div className="pt-2 px-6 space-y-4" ref={menuRef} >
      <div className="flex flex-col-reverse sm:flex-row items-start sm:items-center justify-between gap-4">
        <button
          onClick={() => setShowModal(true)}
          className="w-[125px] h-[36px] px-[12px] py-[6px] border border-[#5F4DEE] text-[#5F4DEE] rounded-[6px] flex items-center justify-center gap-2 hover:bg-[#5F4DEE] hover:text-white transition-colors"
        >
          + إضافة ميزان
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
              placeholder="... البحث عن الموازين"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5F4DEE] text-right"
            />
          </div>
        </div>

      </div>
      <div className="overflow-x-auto bg-white rounded-lg shadow min-h-[37vh]" ref={headerMenuRef}>
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
              <th className="py-3 px-4 cursor-pointer" onClick={() => toggleOrdering("name")}>
                <div className="flex items-center">
                  اسم الميزان {renderArrows("name")}
                </div>
              </th>
              <th className="py-3 px-4 cursor-pointer" onClick={() => toggleOrdering("manufacturer")}>الشركة المصنعة {renderArrows("manufacturer")}</th>
              <th className="py-3 px-4 cursor-pointer" onClick={() => toggleOrdering("model")}>الموديل {renderArrows("model")}</th>
              <th className="py-3 px-4">نوع الاتصال</th>
              <th className="py-3 px-4">عنوان الوصول</th>
              <th className="py-3 px-4">البورت</th>
              <th className="py-3 px-4">الحالة</th>
              <th className="py-3 px-4 relative">
                <button onClick={() => setHeaderMenuOpen(!headerMenuOpen)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-gray-600 hover:text-black"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 5.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 5.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" />
                  </svg>
                </button>
                {headerMenuOpen && (
                  <div className="absolute left-0 mt-2 w-40 bg-white border rounded shadow z-20 text-sm">
                    <div className="px-4 py-2 text-gray-700 border-b">عدد العناصر:</div>
                    <select
                      className="w-full px-4 py-2 border-b text-right"
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(parseInt(e.target.value));
                        setPagination((prev) => ({ ...prev, page: 1 }));
                        setHeaderMenuOpen(false);
                      }}
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                    <button
                      className={`w-full px-4 py-2 text-red-600 hover:bg-red-100 text-right ${
                        selectedScales.length === 0 && "cursor-not-allowed opacity-50"
                      }`}
                      disabled={selectedScales.length === 0}
                      onClick={() => {
                        if (window.confirm("هل أنت متأكد من حذف العناصر المحددة؟")) {
                          Promise.all(
                            selectedScales.map((id) =>
                              fetch(`http://localhost:8000/api/v1/business/scales/${id}/`, {
                                method: "DELETE",
                                headers: {
                                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                                },
                              })
                            )
                          ).then(() => {
                            fetchScales();
                            setSelectedScales([]);
                            setSelectedAll(false);
                            setHeaderMenuOpen(false);
                          });
                        }
                      }}
                    >
                      حذف المحدد
                    </button>
                  </div>
                )}
              </th>
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
                      className="text-gray-500 hover:text-gray-700 menu-button"
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
                      <div className="absolute left-0 mt-2 w-32 bg-white border rounded shadow-lg z-10 menu-dropdown">
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
                          className="w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-100 text-right"
                          onClick={() => {
                            toggleMenu(scale.id);
                            navigate(`/live-weight/${scale.id}`);
                          }}
                        >
                          الوزن المباشر
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

      {editingScaleId && (
        <EditScalePage
          scaleId={editingScaleId}
          onClose={() => setEditingScaleId(null)}
        />
      )}

      {showModal && (
        <AddScaleModal
          onClose={() => setShowModal(false)}
          onScaleAdded={(newScale) => {
            setScales((prev) => [...prev, newScale]);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
};

export default Scales;
