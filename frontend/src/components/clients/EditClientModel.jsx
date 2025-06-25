
// EditClientModel.jsx
import React, { useState, useEffect } from 'react';
import { clientAPI } from '../../utils/client';
import { useToast } from "../ui/toast";


const EditClientModel = ({ clientId, onClose }) => {
    const { success, error } = useToast();
    

    const [form, setForm] = useState({
        name: '',
        manager: '',
        email: '',
        phone: '',
        notes: '',  
        status: 'active',
    });

    useEffect(() => {
        const fetchClient = async () => {
            try {
                const response = await clientAPI.getOne(clientId);
                setForm({
                    name: response.name || '',
                    manager: response.manager || '',
                    email: response.email || '',
                    phone: response.phone || '',
                    notes: response.notes || '',
                    status: response.status || 'active',
                });
            } catch (err) {
                error("", "فشل في تحميل البيانات");
            }
        };
        fetchClient();
    }, [clientId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await clientAPI.update(clientId, form);
            onClose();
            success("", "تم حفظ التعديلات بنجاح");
        } catch (err) {
            error("", "فشل في حفظ التعديلات");
        }
    };

    return (
        <div dir="rtl" className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="absolute inset-0" onClick={onClose} />
            <div
                onClick={(e) => e.stopPropagation()}
                className="relative z-50 bg-white p-6 rounded-xl w-full max-w-lg text-sm shadow-xl"
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold">تعديل بيانات</h2>
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

                    <div className="flex flex-col">
                        <label className="mb-1">الشخص المسؤول *</label>
                        <input
                            name="manager"
                            value={form.manager}
                            onChange={handleChange}
                            className="border rounded px-3 py-2 focus:outline-none focus:ring"
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1">رقم الهاتف</label>
                        <input
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            className="border rounded px-3 py-2 focus:outline-none focus:ring"
                        />
                    </div>

                    <div className="flex flex-col col-span-2">
                        <label className="mb-1">ايميل التواصل</label>
                        <input
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="border rounded px-3 py-2 focus:outline-none focus:ring"
                        />
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

                    <div className="flex justify-between items-center col-span-2 mt-2">
                        <label className="text-sm">الحالة</label>
                        <label className="inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                name="status"
                                checked={form.status === 'active'}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        status: e.target.checked ? 'active' : 'inactive',
                                    }))
                                }
                                className="sr-only"
                            />
                            <div className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${form.status === 'active' ? 'bg-indigo-600' : 'bg-gray-300'
                                }`}>
                                <span className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${form.status === 'active' ? 'translate-x-5' : ''
                                    }`} />
                            </div>
                            <span className="mr-2 text-sm">
                                {form.status === 'active' ? 'نشط' : 'غير نشط'}
                            </span>
                        </label>
                    </div>

                    <div className="col-span-2 mt-4">
                        <button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-700 transition text-white py-2 rounded font-semibold"
                        >
                            حفظ التغييرات
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditClientModel;
