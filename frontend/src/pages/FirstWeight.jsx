import React, { useState } from "react";
import { ClipboardList, Truck, Scale } from "lucide-react";

const FirstWeight = () => {
    const [step, setStep] = useState(1);
    const [ticketType, setTicketType] = useState("OUT");

    const steps = [
        { label: "نوع امر النقل", icon: ClipboardList },
        { label: "بيانات المركبة والحمولة", icon: Truck },
        { label: "قياس الوزن الاول", icon: Scale },
    ];

    const handleNext = () => {
        if (step < steps.length) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };
    // Vehicle state
    const [vehicleList, setVehicleList] = useState([
        { id: 1, plate: "1234", license: "A1", model: "مرسيدس", type: "نقل" },
        { id: 2, plate: "5678", license: "B2", model: "هيونداي", type: "مقطورة" },
        { id: 3, plate: "91011", license: "A2", model: "مرسيدس", type: "نقل" },
        { id: 4, plate: "52627", license: "B3", model: "هيونداي", type: "مقطورة" },
        { id: 5, plate: "53442  ", license: "A3", model: "مرسيدس", type: "نقل" }
    ]);

    const [vehicleSearch, setVehicleSearch] = useState("");
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [showVehicleForm, setShowVehicleForm] = useState(false);

    // Driver state
    const [driverList, setDriverList] = useState([
        { id: 1, name: "أحمد علي", license: "8163253" },
        { id: 2, name: "محمد سعيد", license: "8274610" }
    ]);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [showDriverForm, setShowDriverForm] = useState(false);

    // Client state
    const [clientList, setClientList] = useState([
        { id: 1, name: "شركة الأمل", phone: "01012345678" },
        { id: 2, name: "شركة النجاح", phone: "01198765432" }
    ]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [showClientForm, setShowClientForm] = useState(false);

    const filteredVehicles = vehicleList.filter(v =>
        v.plate.toLowerCase().includes(vehicleSearch.toLowerCase()) ||
        v.model.toLowerCase().includes(vehicleSearch.toLowerCase())
    );

    return (
        <div className="p-8 space-y-8">
            {/* Stepper */}
            <div className="flex justify-center items-center gap-2 mt-4 mb-10 [direction:rtl]">
                {steps.map((stepItem, index) => {
                    const Icon = stepItem.icon;
                    const stepNumber = index + 1;
                    const isActive = step >= stepNumber;
                    const isCurrent = step === stepNumber;

                    return (
                        <React.Fragment key={index}>
                            {/* Step bubble */}
                            <div className="flex flex-col items-center gap-2 w-32">
                                <div
                                    className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all duration-300 ${isActive ? "border-indigo-500 bg-white" : "border-gray-300 bg-gray-100"
                                        }`}
                                >
                                    <Icon
                                        className={`w-5 h-5 ${isActive ? "text-indigo-500" : "text-gray-400"
                                            }`}
                                    />
                                </div>
                                <div className="flex flex-col text-center text-xs">
                                    <span
                                        className={`font-medium ${isActive ? "text-indigo-500" : "text-gray-400"
                                            }`}
                                    >
                                        الخطوة {stepNumber}
                                    </span>
                                    <span
                                        className={`font-semibold ${isCurrent ? "text-indigo-500" : "text-gray-500"
                                            }`}
                                    >
                                        {stepItem.label}
                                    </span>
                                </div>
                            </div>

                            {/* Connector line */}
                            {index < steps.length - 1 && (
                                <div
                                    className={`h-[2px] w-10 transition-all duration-300 ${step > stepNumber ? "bg-indigo-500" : "bg-gray-300"
                                        }`}
                                ></div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>

            {/* Step Content */}
            <div className="mt-6">
                {step === 1 && (
                    <div className="space-y-8 text-center">
                        <h3 className="text-lg font-bold">نوع امر النقل</h3>
                        <p className="text-sm text-gray-400">تأكد من أن الشاحنة موضوعة بشكل صحيح على الميزان</p>
                        <div className="flex justify-center gap-4">
                            <button
                                className={`w-40 py-6 rounded-xl border text-lg font-bold ${ticketType === "IN" ? "bg-indigo-500 text-white" : "bg-[#f6f6f6] text-gray-500"
                                    }`}
                                onClick={() => setTicketType("IN")}
                            >
                                تفريغ
                            </button>
                            <button
                                className={`w-40 py-6 rounded-xl border text-lg font-bold ${ticketType === "OUT" ? "bg-indigo-500 text-white" : "bg-[#f6f6f6] text-gray-500"
                                    }`}
                                onClick={() => setTicketType("OUT")}
                            >
                                مبيعات
                            </button>
                        </div>
                        <div className="flex justify-center gap-4">
                            <button onClick={handleBack} className="px-6 py-2 rounded border text-gray-500">إلغاء</button>
                            <button onClick={handleNext} className="px-6 py-2 rounded bg-indigo-500 text-white">التالي</button>
                        </div>
                    </div>
                )}
                {step === 2 && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-right">بيانات المركبة والحمولة</h3>
                        <div className="grid grid-cols-2 gap-6 [direction:rtl]">

                            {/* --- VEHICLE SECTION --- */}
                            <div className="col-span-2 bg-[#f8f9fd] p-6 rounded-xl space-y-4">
                                <div className="flex justify-between items-center">
                                    <h4 className="font-semibold text-right">بيانات المركبة</h4>
                                    <button
                                        className="text-indigo-500 font-bold text-sm"
                                        onClick={() => setShowVehicleForm(true)}
                                    >
                                        + إضافة سيارة
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    placeholder="البحث حسب رقم اللوحة أو النوع..."
                                    className="w-full px-4 py-2 border rounded"
                                    value={vehicleSearch}
                                    onChange={(e) => setVehicleSearch(e.target.value)}
                                />
                                {filteredVehicles.length > 0 && (
                                    <ul className="bg-white border rounded mt-2 max-h-32 overflow-y-auto">
                                        {filteredVehicles.map(vehicle => (
                                            <li
                                                key={vehicle.id}
                                                onClick={() => {
                                                    setSelectedVehicle(vehicle);
                                                    setVehicleSearch(vehicle.plate);
                                                }}
                                                className="px-4 py-2 hover:bg-indigo-100 cursor-pointer text-right"
                                            >
                                                {vehicle.plate} - {vehicle.model}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                {selectedVehicle && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm">رقم اللوحة</label>
                                            <input className="w-full px-4 py-2 border rounded" value={selectedVehicle.plate} readOnly />
                                        </div>
                                        <div>
                                            <label className="text-sm">الرخصة</label>
                                            <input className="w-full px-4 py-2 border rounded" value={selectedVehicle.license} readOnly />
                                        </div>
                                        <div>
                                            <label className="text-sm">الموديل</label>
                                            <input className="w-full px-4 py-2 border rounded" value={selectedVehicle.model} readOnly />
                                        </div>
                                        <div>
                                            <label className="text-sm">النوع</label>
                                            <input className="w-full px-4 py-2 border rounded" value={selectedVehicle.type} readOnly />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* --- DRIVER SECTION --- */}
                            <div className="col-span-2 bg-[#f8f9fd] p-6 rounded-xl space-y-4">
                                <div className="flex justify-between items-center">
                                    <h4 className="font-semibold text-right">بيانات السائق</h4>
                                    <button
                                        className="text-indigo-500 font-bold text-sm"
                                        onClick={() => setShowDriverForm(true)}
                                    >
                                        + إضافة سائق
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    placeholder="ابحث حسب الاسم أو الرخصة..."
                                    className="w-full px-4 py-2 border rounded"
                                    onChange={(e) => {
                                        const filtered = driverList.filter(d =>
                                            d.name.includes(e.target.value) || d.license.includes(e.target.value)
                                        );
                                        setDriverList(filtered);
                                    }}
                                />
                                {selectedDriver && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm">اسم السائق</label>
                                            <input className="w-full px-4 py-2 border rounded" value={selectedDriver.name} readOnly />
                                        </div>
                                        <div>
                                            <label className="text-sm">رقم الرخصة</label>
                                            <input className="w-full px-4 py-2 border rounded" value={selectedDriver.license} readOnly />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* --- CUSTOMER SECTION --- */}
                            <div className="col-span-2 bg-[#f8f9fd] p-6 rounded-xl space-y-4">
                                <div className="flex justify-between items-center">
                                    <h4 className="font-semibold text-right">بيانات العميل / الحمولة</h4>
                                    <button
                                        className="text-indigo-500 font-bold text-sm"
                                        onClick={() => setShowClientForm(true)}
                                    >
                                        + إضافة عميل
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    placeholder="ابحث باسم العميل أو الشخص المسؤول..."
                                    className="w-full px-4 py-2 border rounded"
                                    onChange={(e) => {
                                        const filtered = clientList.filter(c =>
                                            c.name.includes(e.target.value) || c.phone.includes(e.target.value)
                                        );
                                        setClientList(filtered);
                                    }}
                                />
                                {selectedClient && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm">اسم العميل</label>
                                            <input className="w-full px-4 py-2 border rounded" value={selectedClient.name} readOnly />
                                        </div>
                                        <div>
                                            <label className="text-sm">رقم الهاتف</label>
                                            <input className="w-full px-4 py-2 border rounded" value={selectedClient.phone} readOnly />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-center gap-4 mt-8">
                            <button onClick={handleBack} className="px-6 py-2 rounded border text-gray-500">السابق</button>
                            <button onClick={handleNext} className="px-6 py-2 rounded bg-indigo-500 text-white">التالي</button>
                        </div>
                    </div>
                )}


                {step === 3 && (
                    <div className="grid grid-cols-2 gap-8 [direction:rtl]">
                        {/* Weight Display */}
                        <div className="text-center space-y-6">
                            <div className="text-9xl font-bold text-indigo-500">0</div>
                            <p className="text-sm text-gray-400">قراءة الميزان الحالية</p>
                            <input
                                type="text"
                                placeholder="ملاحظات"
                                className="mt-4 px-4 py-2 w-2/3 border rounded"
                            />
                            <button className="mt-4 px-8 py-3 rounded bg-indigo-500 text-white">حفظ الوزن الثاني</button>
                        </div>

                        {/* Side Info Panel */}
                        <div className="bg-gray-100 p-4 rounded-lg space-y-6">
                            <div>
                                <h4 className="font-bold mb-2">بيانات المركبة</h4>
                                <p>نوع السيارة: نقل فردي</p>
                                <p>الماركة: مرسيدس</p>
                                <p>الوزن في الرخصة: 12000 كج</p>
                                <p>سعة القيد: 14000 كج</p>
                            </div>
                            <div>
                                <h4 className="font-bold mb-2">بيانات السائق</h4>
                                <p>الاسم: احمد السيد علي محمد</p>
                                <p>رخصة القيادة: A / 8163253</p>
                                <p>تاريخ الإصدار: 16.01.2021</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FirstWeight;
