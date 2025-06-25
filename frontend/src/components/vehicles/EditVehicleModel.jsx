import React, { useState, useEffect } from 'react';
import { driverAPI } from '../../utils/driver';
import { vehicleAPI } from '../../utils/vehicle';
import { useToast } from "../ui/toast";

const EditVehicleModel = ({ vehicleId, onClose }) => {
    const [drivers, setDrivers] = useState([]);
    const [selectedDrivers, setSelectedDrivers] = useState([]);
    const { success, error } = useToast();

    const [form, setForm] = useState({
        plate: '',
        license: '',
        license_weight: '',
        license_expiry: NaN,
        chassis_number: '',
        model: '',
        type: '',
        capacity: '',
        last_inspection_date: NaN,
        first_weight: '',
        total_weight_operations: NaN,
        year: '',
        notes: '',
        status: 'active',
        driver_ids: [],
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [vehicleData, driverData] = await Promise.all([
                    vehicleAPI.getOne(vehicleId),
                    driverAPI.get({ page_size: 5000 }),
                ]);

                const allDrivers = Array.isArray(driverData) ? driverData : driverData.results || [];
                setDrivers(allDrivers);

                const assignedDrivers = vehicleData.drivers || [];

                setForm({
                    plate: vehicleData.plate || '',
                    license: vehicleData.license || '',
                    license_expiry: vehicleData.license_expiry || NaN,
                    license_weight: vehicleData.license_weight || '',
                    chassis_number: vehicleData.chassis_number || '',
                    model: vehicleData.model || '',
                    type: vehicleData.type || '',
                    capacity: vehicleData.capacity || '',
                    last_inspection_date: vehicleData.last_inspection_date || NaN,
                    first_weight: vehicleData.first_weight || '',
                    total_weight_operations: vehicleData.total_weight_operations || NaN,
                    year: vehicleData.year || '',
                    notes: vehicleData.notes || '',
                    status: vehicleData.status || 'active',
                    driver_ids: assignedDrivers.map((d) => d.id),
                });

                setSelectedDrivers(assignedDrivers);
            } catch (err) {
                error(err.message, "فشل في تحميل البيانات");
            }
        };

        fetchData();
    }, [vehicleId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await vehicleAPI.update(vehicleId, form);
            onClose();
            success("", "تم حفظ التعديلات بنجاح");
        } catch (err) {
            error(err.message, "فشل في حفظ التعديلات");
        }
    };

    return (
        <div dir="rtl" className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="absolute inset-0" onClick={onClose} />
            <div
                onClick={(e) => e.stopPropagation()}
                className="relative z-50 bg-white rounded-xl w-full max-w-lg max-h-[90vh] shadow-xl"
            >
                <div className="flex items-center justify-between px-6 pt-6">
                    <h2 className="text-lg font-semibold">تعديل بيانات السائق</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-lg font-bold">×</button>
                </div>

                <div className="overflow-y-auto scrollbar-hide max-h-[calc(100vh-150px)] p-6">
                    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 text-sm">
                    <div className="grid grid-cols-2 gap-4 col-span-3">
                            <div className="flex flex-col">
                                <label className="mb-1">رقم السيارة *</label>
                                <input
                                    name="plate"
                                    value={form.plate}
                                    onChange={handleChange}
                                    className="border rounded px-3 py-2 focus:outline-none focus:ring"
                                    required
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="mb-1">رقم الشاسيه</label>
                                <input
                                    name="chassis_number"
                                    value={form.chassis_number}
                                    onChange={handleChange}
                                    className="border rounded px-3 py-2 focus:outline-none focus:ring"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 col-span-3">
                            <div className="flex flex-col">
                                <label className="mb-1">الماركة</label>
                                <input
                                    name="type"
                                    value={form.type}
                                    onChange={handleChange}
                                    className="border rounded px-3 py-2 focus:outline-none focus:ring"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="mb-1">الموديل</label>
                                <input
                                    name="model"
                                    value={form.model}
                                    onChange={handleChange}
                                    className="border rounded px-3 py-2 focus:outline-none focus:ring"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="mb-1">السنة</label>
                                <select
                                    name="year"
                                    value={form.year}
                                    onChange={handleChange}
                                    className="border rounded px-3 py-2 focus:outline-none focus:ring"
                                >
                                    <option value="">اختر السنة</option>
                                    {Array.from({ length: new Date().getFullYear() - 1979 }, (_, i) => {
                                        const year = new Date().getFullYear() - i;
                                        return (
                                            <option key={year} value={year}>
                                                {year}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>

                        </div>

                        <div className="flex flex-col">
                            <label className="mb-1">الوزن الفارغ (طن)</label>
                            <input
                                type='number'
                                name="first_weight"
                                value={form.first_weight}
                                onChange={handleChange}
                                className="border rounded px-3 py-2 focus:outline-none focus:ring"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="mb-1">الوزن في الرخصة (طن)</label>
                            <input
                                type='number'
                                name="license_weight"
                                value={form.license_weight}
                                onChange={handleChange}
                                className="border rounded px-3 py-2 focus:outline-none focus:ring"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="mb-1">السعة القصوى (طن)</label>
                            <input
                                type='number'
                                name="capacity"
                                value={form.capacity}
                                onChange={handleChange}
                                className="border rounded px-3 py-2 focus:outline-none focus:ring"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4 col-span-3">
                            <div className="flex flex-col">
                                <label className="mb-1">الرخصة *</label>
                                <input
                                    name="license"
                                    value={form.license}
                                    onChange={handleChange}
                                    className="border rounded px-3 py-2 focus:outline-none focus:ring"
                                    required
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="mb-1">تاريخ إنتهاء الرخصة</label>
                                <input
                                    type="date"
                                    name="license_expiry"
                                    value={form.license_expiry}
                                    onChange={handleChange}
                                    className="border rounded px-3 py-2 focus:outline-none focus:ring text-right"
                                />
                            </div>
                        </div>

                        {/* Full width: License Expiry */}
                        <div className="flex flex-col col-span-3">
                            <label className="mb-1 text-right">تاريخ أخر فحص</label>
                            <input
                                type="date"
                                name="last_inspection_date"
                                value={form.last_inspection_date}
                                onChange={handleChange}
                                className="border rounded px-3 py-2 focus:outline-none focus:ring text-right"
                                />
                        </div>

                        {/* Full width: Notes */}
                        <div className="flex flex-col col-span-3">
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

                        {/* Status Switch */}
                        <div className="flex justify-between items-center col-span-3 mt-2">
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
                                <div className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${form.status === 'active' ? 'bg-indigo-600' : 'bg-gray-300'}`}>
                                    <span className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${form.status === 'active' ? 'translate-x-5' : ''}`} />
                                </div>
                                <span className="mr-2 text-sm">
                                    {form.status === 'active' ? 'نشط' : 'غير نشط'}
                                </span>
                            </label>
                        </div>

                        {/* Driver Selection */}
                        <div className="flex flex-col col-span-3">
                            <label className="mb-1">اختر السائق</label>
                            <select
                                className="border rounded px-3 py-2 focus:outline-none focus:ring"
                                onChange={(e) => {
                                    const selectedId = parseInt(e.target.value);
                                    const selectedDriver = drivers.find((d) => d.id === selectedId);
                                    if (selectedDriver && !selectedDrivers.find((d) => d.id === selectedId)) {
                                        setSelectedDrivers((prev) => [...prev, selectedDriver]);
                                        setForm((prev) => ({
                                            ...prev,
                                            driver_ids: [...prev.driver_ids, selectedId],
                                        }));
                                    }
                                }}
                                defaultValue=""
                            >
                                <option value="" disabled>اختر السائق ...</option>
                                {drivers.map((driver) => (
                                    <option key={driver.id} value={driver.id}>
                                        {driver.name || `سائق ${driver.id}`}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Selected Drivers */}
                        {selectedDrivers.length > 0 && (
                            <div className="flex flex-wrap gap-2 col-span-3 mt-2">
                                {selectedDrivers.map((d) => (
                                    <div
                                        key={d.id}
                                        className="flex items-center gap-2 bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm"
                                    >
                                        <span>{d.name || `سائق ${d.id}`}</span>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedDrivers((prev) => prev.filter((x) => x.id !== d.id));
                                                setForm((prev) => ({
                                                    ...prev,
                                                    driver_ids: prev.driver_ids.filter((id) => id !== d.id),
                                                }));
                                            }}
                                            className="text-indigo-600 hover:text-red-600 font-bold"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="col-span-3 mt-4">
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
        </div>
    );
};

export default EditVehicleModel;
