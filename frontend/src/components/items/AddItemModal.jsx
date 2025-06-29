import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { itemAPI } from '../../utils/item';
import { useToast } from "../ui/toast";

const AddItemModal = ({ onClose }) => {
    const { success, error } = useToast();

    const [form, setForm] = useState({
        name: '',
        sector: '',
        type: '',
        notes: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await itemAPI.create(form);
            onClose();
            success("", "تم إضافة العنصر بنجاح");
        } catch (err) {
            error(err.message, "فشل في تحميل العنصر");
        }
    };

    return ReactDOM.createPortal(
        <div dir="rtl" className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="absolute inset-0" onClick={onClose} />
            <div
                onClick={(e) => e.stopPropagation()}
                className="relative z-50 bg-white p-6 rounded-xl w-full max-w-lg text-sm shadow-xl"
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold">إضافة عنصر</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-lg font-bold">×</button>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex flex-col col-span-2">
                        <label className="mb-1">الاسم *</label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="border rounded px-3 py-2 focus:outline-none focus:ring w-full"
                            required
                        />
                    </div>

                    <div className="flex flex-col col-span-2">
                        <label className="mb-1">القطاع *</label>
                        <select
                            name="sector"
                            value={form.sector}
                            onChange={handleChange}
                            className="border rounded px-3 py-2 focus:outline-none focus:ring"
                        >
                            <option value="">اختر القطاع</option>
                            <option value="type1">حي</option>
                            <option value="type2">نافق</option>
                        </select>
                    </div>

                    <div className="flex flex-col col-span-2">
                        <label className="mb-1">النوع *</label>
                        <select
                            name="type"
                            value={form.type}
                            onChange={handleChange}
                            className="border rounded px-3 py-2 focus:outline-none focus:ring"
                        >
                            <option value="">اختر النوع</option>
                            <option value="type1">طيور</option>
                            <option value="type2">زراعة</option>
                            <option value="type3">اغنام</option>
                        </select>
                    </div>


                    <div className="flex flex-col col-span-2">
                        <label className="mb-1">ملاحظات</label>
                        <textarea
                            name="notes"
                            value={form.notes}
                            onChange={handleChange}
                            className="border rounded px-3 py-2 focus:outline-none focus:ring resize-none"
                            placeholder="ملاحظات إضافية..."
                            rows={3}
                        />
                    </div>


                    <div className="col-span-2 mt-4">
                        <button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-700 transition text-white py-2 rounded font-semibold"
                        >
                            إضافة العنصر
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default AddItemModal;
