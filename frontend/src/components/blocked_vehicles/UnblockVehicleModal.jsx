import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useToast } from "../ui/toast";
import { blockedVehicleAPI } from "../../utils/blocked_vehicle";

const UnblockVehicleModal = ({ vehicleId, isOpen, onClose, onSuccess }) => {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const { success, error } = useToast();

  const handleUnblock = async () => {
    if (!reason) return;

    setLoading(true);
    try {
      await blockedVehicleAPI.unblock(vehicleId, { unblock_reason: reason });
      success("", "تم فك الحظر بنجاح");
      onClose();
      onSuccess?.();
    } catch (err) {
      error(err.message || "فشل في فك الحظر", "");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
      <div onClick={onClose} className="absolute inset-0" />
      <div
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
        className="absolute bg-white p-6 shadow-xl"
        style={{
          width: "645px",
          height: "353px",
          top: "63px",
          left: "395px",
          borderRadius: "12px",
        }}
      >
        {/* Header */}
        <div className="flex flex-row justify-between items-center mb-4" dir="rtl">
          <h2 className="text-lg font-semibold">رسالة تأكيد</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-lg font-bold"
          >
            ×
          </button>
        </div>


        <p className="mb-4 text-sm text-gray-800">
          هل أنت متأكد من رغبتك في فك حظر هذه السيارة من النظام؟
        </p>

        <label className="block mb-1 text-sm text-gray-700">سبب فك الحظر:</label>
        <textarea
          className="w-full border rounded-md p-2 mb-4 focus:outline-none focus:ring text-right"
          placeholder="سبب فك الحظر..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={4}
        />

        <div className="flex justify-between gap-4 mt-4">
          <button
            onClick={handleUnblock}
            disabled={loading || !reason}
            className="flex-1 py-2 rounded bg-red-600 hover:bg-red-700 text-white disabled:opacity-80"
          >
            {loading ? "جاري التنفيذ..." : "نعم، فك الحظر"}
          </button>

          <button
            onClick={onClose}
            className="flex-1 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default UnblockVehicleModal;
