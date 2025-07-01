import React, { useState, useEffect } from "react";
import { ClipboardList, Truck, Scale, Pencil } from "lucide-react";
import { ticketAPI } from "../utils/ticket"
import { clientAPI } from "../utils/client";
import { driverAPI } from "../utils/driver";
import { vehicleAPI } from "../utils/vehicle";
import LiveWeightPage from "./LiveWeightPage";
import { useNavigate, useLocation } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const SOCKET_URL = import.meta.env.VITE_SOCKET;


const FirstWeight = () => {
    const [vehicleList, setVehicleList] = useState([]);
    const [vehicleSearch, setVehicleSearch] = useState("");
    const [filteredVehicles, setFilteredVehicles] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState(null);

    const [driverList, setDriverList] = useState([]);
    const [driverSearch, setDriverSearch] = useState("");
    const [filteredDrivers, setFilteredDrivers] = useState([]);
    const [selectedDriver, setSelectedDriver] = useState(null);

    const [clientList, setClientList] = useState([]);
    const [clientSearch, setClientSearch] = useState("");
    const [filteredClients, setFilteredClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);

    const [scales, setScales] = useState([]);
    const [selectedScale, setSelectedScale] = useState(null);

    const [farmName, setFarmName] = useState("");
    const [firstWeightValue, setFirstWeightValue] = useState("");
    const [numberOfBoxes, setNumberOfBoxes] = useState("");
    const [numberOfBirds, setNumberOfBirds] = useState("");
    const [notes, setNotes] = useState("");

    const [step, setStep] = useState(1);
    const [ticketType, setTicketType] = useState("OUT");

    const [showVehicleForm, setShowVehicleForm] = useState(false);
    const [showDriverForm, setShowDriverForm] = useState(false);
    const [showClientForm, setShowClientForm] = useState(false);

    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [ticketId, setTicketId] = useState(null);
    const [secondWeightInput, setSecondWeightInput] = useState("");

    const navigate = useNavigate();
    const location = useLocation();

    const steps = [
        { label: "نوع امر النقل", icon: ClipboardList },
        { label: "بيانات المركبة والحمولة", icon: Truck },
        { label: "قياس الوزن الاول", icon: Scale },
        { label: "قياس الوزن الثاني", icon: Scale },
    ];

    const handleNext = () => {
        if (step < steps.length) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchVehicles();
        }, 500);
        return () => clearTimeout(delayDebounce);
    }, [vehicleSearch]);

    const fetchVehicles = async () => {
        try {
            const data = await vehicleAPI.get({
                search: vehicleSearch,
                page_size: 10,
            });
            const list = Array.isArray(data) ? data : data.results || [];
            setVehicleList(list);
            setFilteredVehicles(list);
        } catch (error) {
            console.error("Error fetching vehicles:", error);
        }
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchDrivers();
        }, 500);
        return () => clearTimeout(delayDebounce);
    }, [driverSearch]);

    const fetchDrivers = async () => {
        try {
            const data = await driverAPI.get({
                search: driverSearch,
                page_size: 10,
            });
            const list = Array.isArray(data) ? data : data.results || [];
            setDriverList(list);
            setFilteredDrivers(list);
        } catch (error) {
            console.error("Error fetching drivers:", error);
        }
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchClients();
        }, 500);
        return () => clearTimeout(delayDebounce);
    }, [clientSearch]);

    const fetchClients = async () => {
        try {
            const data = await clientAPI.get({
                search: clientSearch,
                page_size: 10,
            });
            const list = Array.isArray(data) ? data : data.results || [];
            setClientList(list);
            setFilteredClients(list);
        } catch (error) {
            console.error("Error fetching clients:", error);
        }
    };

    useEffect(() => {
        fetchScales();
    }, []);

    const fetchScales = async () => {
        try {
            const data = await ticketAPI.getScales();
            const list = Array.isArray(data) ? data : data.results || [];
            setScales(list);
        } catch (error) {
            console.error("Error fetching scales:", error);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const data = await ticketAPI.getItems();
            const list = Array.isArray(data) ? data : data.results || [];
            setItems(list);
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    };



    const [liveWeight, setLiveWeight] = useState(null);

    useEffect(() => {
        if (!selectedScale) return;

        const socket = new WebSocket(`wss://${SOCKET_URL}/ws/scale/`);

        socket.onopen = () => {
            socket.send(JSON.stringify({ action: "init", scale_id: selectedScale }));
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.weight) {
                const cleanWeight = data.weight.replace(/#/g, "").trim();
                setLiveWeight(cleanWeight);
            }
        };

        return () => socket.close();
    }, [selectedScale]);


    const handleSaveTicket = async () => {
        try {
            const payload = {
                scale: selectedScale,
                vehicle: selectedVehicle?.id,
                driver: selectedDriver?.id,
                customer: selectedClient?.id,
                ticket_type: ticketType,
                first_weight: parseFloat(liveWeight),
                first_weight_date: new Date().toISOString(),
                item: selectedItem,
                farm: farmName,
                boxes_number: numberOfBoxes,
                birds_number: numberOfBirds,
                notes: notes,
            };


            console.log("Submitting Ticket:", payload);

            const response = await ticketAPI.create(payload);
            console.log("Ticket Created:", response);
            alert("تم حفظ التذكرة بنجاح ✅");
            navigate("/tickets");

        } catch (error) {
            console.error("Error saving ticket:", error);

            // If backend returned weight manipulation block (403)
            if (error.message.includes("Weight manipulation detected")) {
                alert("🚨 تم حظر المركبة بسبب التلاعب في الوزن");
                navigate("/blocked-vehicles");
            } else {
                alert(`❌ خطأ أثناء الحفظ: ${error.message}`);
            }
        }
    };

    const params = new URLSearchParams(location.search);
    const secondWeightMode = params.get("mode") === "second_weight";
    const urlTicketId = params.get("ticket");
    useEffect(() => {
        if (secondWeightMode && urlTicketId) {
            setStep(4);
            setTicketId(urlTicketId);
            fetchTicketData(urlTicketId);
        }
    }, [secondWeightMode, urlTicketId]);

    const fetchTicketData = async (id) => {
        try {
            const ticket = await ticketAPI.getOne(id);
            setSelectedVehicle(ticket.vehicle);
            setSelectedDriver(ticket.driver);
            setSelectedClient(ticket.customer);
            setSelectedItem(ticket.item);
            setFarmName(ticket.farm);
            setFirstWeightValue(ticket.first_weight);
            setNumberOfBoxes(ticket.boxes_number);
            setNumberOfBirds(ticket.birds_number);
            setNotes(ticket.notes);
        } catch (err) {
            console.error("Error loading ticket for second weight:", err);
        }
    };
    const handleSaveSecondWeight = async () => {
        try {
            await ticketAPI.update(ticketId, { second_weight: parseFloat(liveWeight) });
            alert("✅ تم حفظ الوزن الثاني بنجاح");
            navigate("/tickets");
        } catch (error) {
            alert("❌ فشل في حفظ الوزن الثاني");
        }
    };
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
                            <div className="flex flex-col items-center gap-2 w-32">
                                <div
                                    className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all duration-300 ${isActive ? "border-indigo-500 bg-white" : "border-gray-300 bg-gray-100"
                                        }`}
                                >
                                    <Icon
                                        className={`w-5 h-5 ${isActive ? "text-indigo-500" : "text-gray-400"}`}
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
                                        className={`font-semibold ${isActive ? "text-indigo-500" : "text-gray-500"
                                            }`}
                                    >
                                        {stepItem.label}
                                    </span>
                                </div>
                            </div>
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
                        <h3 className="text-lg font-bold text-right">بيانات المركبة </h3>
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
                                    value={driverSearch}
                                    onChange={(e) => setDriverSearch(e.target.value)}
                                />
                                {filteredDrivers.length > 0 && (
                                    <ul className="bg-white border rounded mt-2 max-h-32 overflow-y-auto">
                                        {filteredDrivers.map(driver => (
                                            <li
                                                key={driver.id}
                                                onClick={() => {
                                                    setSelectedDriver(driver);
                                                    setDriverSearch(driver.name);
                                                }}
                                                className="px-4 py-2 hover:bg-indigo-100 cursor-pointer text-right"
                                            >
                                                {driver.name} - {driver.license}
                                            </li>
                                        ))}
                                    </ul>
                                )}

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
                                    <h4 className="font-semibold text-right">بيانات العميل</h4>
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
                                    value={clientSearch}
                                    onChange={(e) => setClientSearch(e.target.value)}
                                />
                                {filteredClients.length > 0 && (
                                    <ul className="bg-white border rounded mt-2 max-h-32 overflow-y-auto">
                                        {filteredClients.map(client => (
                                            <li
                                                key={client.id}
                                                onClick={() => {
                                                    setSelectedClient(client);
                                                    setClientSearch(client.name);
                                                }}
                                                className="px-4 py-2 hover:bg-indigo-100 cursor-pointer text-right"
                                            >
                                                {client.name} - {client.phone}
                                            </li>
                                        ))}
                                    </ul>
                                )}

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

                            {/* --- Items SECTION --- */}
                            <div className="col-span-2 bg-[#f8f9fd] p-6 rounded-xl space-y-4">
                                <h4 className="font-semibold text-right">نوع الحمولة</h4>
                                <select
                                    className="w-full px-4 py-2 border rounded text-right"
                                    value={selectedItem || ""}
                                    onChange={(e) => setSelectedItem(e.target.value)}
                                >
                                    <option value="">اختر نوع الحمولة</option>
                                    {items.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.name} - {item.sector} - {item.type}
                                        </option>
                                    ))}
                                </select>
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
                    <>
                        <div className="grid grid-cols-2 gap-6 [direction:rtl]">
                            {/* RIGHT SIDE: Info Boxes */}
                            <div className="space-y-4">
                                {/* VEHICLE INFO */}
                                {selectedVehicle && (
                                    <div className="bg-gray-100 p-4 rounded-lg space-y-1 relative">
                                        <button
                                            className="absolute left-4 top-4 text-gray-400 hover:text-indigo-500"
                                            onClick={() => setStep(2)}
                                            title="تعديل"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <h4 className="font-bold mb-2">بيانات المركبة</h4>
                                        <p>رقم اللوحة: {selectedVehicle.plate}</p>
                                        <p>نوع السيارة: {selectedVehicle.type}</p>
                                        <p>الماركة: {selectedVehicle.model}</p>
                                        <p>الرخصة: {selectedVehicle.license}</p>
                                    </div>
                                )}

                                {/* DRIVER INFO */}
                                {selectedDriver && (
                                    <div className="bg-gray-100 p-4 rounded-lg space-y-1 relative">
                                        <button
                                            className="absolute left-4 top-4 text-gray-400 hover:text-indigo-500"
                                            onClick={() => setStep(2)}
                                            title="تعديل"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <h4 className="font-bold mb-2">بيانات السائق</h4>
                                        <p>الاسم: {selectedDriver.name}</p>
                                        <p>رخصة القيادة: A / {selectedDriver.license}</p>
                                        <p>تاريخ الإصدار: 16.01.2021</p>
                                        <p>تاريخ الانتهاء: 16.01.2021</p>
                                    </div>
                                )}

                                {/* CLIENT INFO */}
                                {selectedClient && (
                                    <div className="bg-gray-100 p-4 rounded-lg space-y-1 relative">
                                        <button
                                            className="absolute left-4 top-4 text-gray-400 hover:text-indigo-500"
                                            onClick={() => setStep(2)}
                                            title="تعديل"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <h4 className="font-bold mb-2">بيانات العميل و الحمولة</h4>
                                        <p>اسم العميل: {selectedClient.name}</p>
                                        <p>رقم الهاتف: {selectedClient.phone}</p>
                                        <p>نوع الحمولة: الدواجن الحرة</p>
                                        <p>عدد الأقفاص: 120</p>
                                        <p>عدد الطيور: 2000</p>
                                    </div>
                                )}

                                {/* ITEM INFO */}
                                {selectedItem && (
                                    <div className="bg-gray-100 p-4 rounded-lg space-y-1 relative">
                                        <button
                                            className="absolute left-4 top-4 text-gray-400 hover:text-indigo-500"
                                            onClick={() => setStep(2)}
                                            title="تعديل"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <h4 className="font-bold mb-2">معلومات الحمولة</h4>
                                        <p>
                                            <span className="font-semibold">الاسم:</span>{" "}
                                            {items.find((item) => item.id == selectedItem)?.name}
                                        </p>
                                        <p>
                                            <span className="font-semibold">القطاع:</span>{" "}
                                            {items.find((item) => item.id == selectedItem)?.sector}
                                        </p>
                                        <p>
                                            <span className="font-semibold">النوع:</span>{" "}
                                            {items.find((item) => item.id == selectedItem)?.type}
                                        </p>
                                    </div>
                                )}

                            </div>

                            {/* LEFT SIDE: Weight + Extra Fields */}
                            <div className="flex flex-col bg-gray-100 p-6 rounded-xl space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-500">قراءة الميزان الحالية</span>
                                    <Scale className="w-5 h-5 text-indigo-500" />
                                </div>

                                <div className="flex items-center justify-center text-indigo-500 text-[120px] font-bold leading-none tracking-widest h-40">
                                    {liveWeight !== null ? `${liveWeight} كجم` : "—"}
                                </div>
                                <span className="block text-sm text-gray-600 text-left mt-2">KG</span>
                                {/* <button
                                    className="mt-2 py-2 w-full bg-indigo-500 text-white rounded"
                                >
                                    قراءة الوزن الحالي
                                </button> */}
                                {/* Scale Dropdown */}
                                <div>
                                    <label className="block mb-1 text-sm">اختر الميزان</label>
                                    <select
                                        className="w-full px-4 py-2 border rounded text-right"
                                        value={selectedScale || ""}
                                        onChange={(e) => setSelectedScale(e.target.value)}
                                    >
                                        <option value="">اختر الميزان</option>
                                        {scales.map((scale) => (
                                            <option key={scale.id} value={scale.id}>
                                                {scale.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Farm Fields */}
                                <div>
                                    <label className="block mb-1 text-sm">اسم المزرعة</label>
                                    <input
                                        className="w-full px-4 py-2 border rounded text-right"
                                        value={farmName}
                                        onChange={(e) => setFarmName(e.target.value)}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block mb-1 text-sm">عدد الأقفاص</label>
                                        <input
                                            type="number"
                                            className="w-full px-4 py-2 border rounded text-right"
                                            value={numberOfBoxes}
                                            onChange={(e) => setNumberOfBoxes(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1 text-sm">عدد الطيور</label>
                                        <input
                                            type="number"
                                            className="w-full px-4 py-2 border rounded text-right"
                                            value={numberOfBirds}
                                            onChange={(e) => setNumberOfBirds(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block mb-1 text-sm">ملاحظات</label>
                                    <textarea
                                        className="w-full px-4 py-2 border rounded text-right"
                                        rows="2"
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/*  Buttons */}
                        <div className="col-span-2 flex justify-center gap-4 mt-8">
                            <button
                                className="py-2 px-4 border rounded text-gray-500 hover:bg-gray-200"
                                onClick={handleBack}
                            >
                                السابق
                            </button>
                            <button className="py-2 px-4 border rounded text-gray-600 hover:bg-gray-200">
                                🖨️ طباعة
                            </button>
                            <button className="py-2 px-6 bg-indigo-500 text-white font-bold rounded-lg"
                                onClick={handleSaveTicket}>

                                حفظ التذكرة
                            </button>
                        </div>
                    </>
                )}
                {step === 4 && (
                    <>
                        <div className="grid grid-cols-2 gap-6 [direction:rtl]">
                            {/* RIGHT SIDE: Ticket Info */}
                            <div className="space-y-4">
                                <div className="bg-gray-100 p-4 rounded-lg space-y-2 relative">
                                    <label className="block mb-2 text-xl font-bold text-gray-700">الوزن الأول</label>
                                    <div className="w-full px-4 py-3 rounded bg-white text-left text-2xl font-semibold text-gray-900">
                                        {firstWeightValue || "—"}
                                    </div>
                                </div>

                                {/* VEHICLE INFO */}
                                {selectedVehicle && (
                                    <div className="bg-gray-100 p-4 rounded-lg space-y-1 relative">
                                        <h4 className="font-bold mb-2">بيانات المركبة</h4>
                                        <p>رقم اللوحة: {selectedVehicle.plate}</p>
                                        <p>نوع السيارة: {selectedVehicle.type}</p>
                                        <p>الماركة: {selectedVehicle.model}</p>
                                        <p>الرخصة: {selectedVehicle.license}</p>
                                    </div>
                                )}

                                {/* DRIVER INFO */}
                                {selectedDriver && (
                                    <div className="bg-gray-100 p-4 rounded-lg space-y-1 relative">
                                        <h4 className="font-bold mb-2">بيانات السائق</h4>
                                        <p>الاسم: {selectedDriver.name}</p>
                                        <p>رخصة القيادة: {selectedDriver.license}</p>
                                    </div>
                                )}

                                {/* CLIENT INFO */}
                                {selectedClient && (
                                    <div className="bg-gray-100 p-4 rounded-lg space-y-1 relative">
                                        <h4 className="font-bold mb-2">بيانات العميل</h4>
                                        <p>اسم العميل: {selectedClient.name}</p>
                                        <p>رقم الهاتف: {selectedClient.phone}</p>
                                    </div>
                                )}

                                {/* ITEM INFO */}
                                {selectedItem && (
                                    <div className="bg-gray-100 p-4 rounded-lg space-y-1 relative">
                                        <h4 className="font-bold mb-2">معلومات الحمولة</h4>
                                        <p>
                                            <span className="font-semibold">الاسم:</span>{selectedItem.name}

                                        </p>
                                        <p>
                                            <span className="font-semibold">القطاع:</span>{selectedItem.sector}
                                        </p>
                                        <p>
                                            <span className="font-semibold">النوع:</span>{selectedItem.type}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* LEFT SIDE: Live Weight + Farm Fields */}
                            <div className="flex flex-col bg-gray-100 p-6 rounded-xl space-y-4">
                                {/* Scale Display */}
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-500">قراءة الميزان الحالية</span>
                                    <Scale className="w-5 h-5 text-indigo-500" />
                                </div>

                                <div className="flex items-center justify-center text-indigo-500 text-[120px] font-bold leading-none tracking-widest h-40">
                                    {liveWeight !== null ? `${liveWeight} كجم` : "—"}
                                </div>
                                <span className="block text-sm text-gray-600 text-left mt-2"></span>

                                {/* Scale Selector */}
                                <div>
                                    {/* <button
                                        className="mt-2 py-2 w-full bg-indigo-500 text-white rounded"
                                    >
                                        قراءة الوزن الحالي
                                    </button> */}
                                    <label className="block mb-1 text-sm">اختر الميزان</label>
                                    <select
                                        className="w-full px-4 py-2 border rounded text-right"
                                        value={selectedScale || ""}
                                        onChange={(e) => setSelectedScale(e.target.value)}
                                    >
                                        <option value="">اختر الميزان</option>
                                        {scales.map((scale) => (
                                            <option key={scale.id} value={scale.id}>
                                                {scale.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Farm Fields */}
                                <div>
                                    <label className="block mb-1 text-sm">اسم المزرعة</label>
                                    <input
                                        className="w-full px-4 py-2 border rounded text-right"
                                        value={farmName}
                                        onChange={(e) => setFarmName(e.target.value)}
                                    />
                                </div>


                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block mb-1 text-sm">عدد الأقفاص</label>
                                        <input
                                            type="number"
                                            className="w-full px-4 py-2 border rounded text-right"
                                            value={numberOfBoxes}
                                            onChange={(e) => setNumberOfBoxes(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1 text-sm">عدد الطيور</label>
                                        <input
                                            type="number"
                                            className="w-full px-4 py-2 border rounded text-right"
                                            value={numberOfBirds}
                                            onChange={(e) => setNumberOfBirds(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block mb-1 text-sm">ملاحظات</label>
                                    <textarea
                                        rows="2"
                                        className="w-full px-4 py-2 border rounded text-right"
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Unified Buttons Row */}
                        <div className="col-span-2 flex justify-center gap-4 mt-8">
                            <button className="py-2 px-4 border rounded text-gray-600 hover:bg-gray-200">
                                🖨️ طباعة
                            </button>
                            <button
                                onClick={handleSaveSecondWeight}
                                className="py-2 px-6 bg-indigo-500 text-white font-bold rounded-lg"
                            >
                                حفظ الوزن الثاني
                            </button>
                        </div>
                    </>
                )}


            </div>
        </div>
    );
};

export default FirstWeight;
