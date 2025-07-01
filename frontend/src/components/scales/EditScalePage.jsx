import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import RawDataDisplay from "../RawDataDisplay";

const DELAY_CHOICES = [1, 0.75, 0.5, 0.25, 0.1];
const BITS_NUMBER_CHOICES = [5, 6, 7, 8, 16, 32, 64, 128, 256, 512, 1024];
const SERIAL_PORT_CHOICES = ["COM1", "COM2", "COM3", "COM4", "COM5", "COM6"];
const BAUDRATE_CHOICES = [110, 300, 600, 1200, 2400, 4800, 9600, 14400, 19200, 38400];
const PARITY_CHOICES = ["none", "even", "odd", "mark", "space"];
const STOP_BITS_CHOICES = [1, 1.5, 2];
const FLOW_CONTROL_CHOICES = ["none", "hardware", "Xon/Xoff"];

const BASE_URL = import.meta.env.VITE_BASE_URL;
const SOCKET_URL = import.meta.env.VITE_SOCKET;


const EditScaleModal = ({ scaleId, onClose }) => {
  const [form, setForm] = useState(null);

  useEffect(() => {
    fetch(`${BASE_URL}/business/scales/${scaleId}/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setForm({
          ...data,
          frontCameraEnabled: !!(data.front_camera_ip || data.front_camera_port),
          rearCameraEnabled: !!(data.rear_camera_ip || data.rear_camera_port),
        });
      });
  }, [scaleId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form };

    if (!form.frontCameraEnabled) {
      delete payload.front_camera_ip;
      delete payload.front_camera_port;
    }
    if (!form.rearCameraEnabled) {
      delete payload.rear_camera_ip;
      delete payload.rear_camera_port;
    }

    if (form.connection_type === "tcp") {
      ["serial_port", "baudrate", "parity", "stop_bits", "flow_control"].forEach((f) => delete payload[f]);
    }
    if (form.connection_type === "serial") {
      ["ip", "port"].forEach((f) => delete payload[f]);
    }

    await fetch(`${BASE_URL}/business/scales/${scaleId}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(payload),
    });

    onClose();
    window.location.reload();
  };

  if (!form) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999]"
      onClick={onClose}
      dir="rtl"
    >
      <div
  className="relative scrollbar-hide z-[10000] bg-white p-6 rounded-lg text-right shadow-lg overflow-y-auto text-sm"
  style={{ width: '645px', height: '644px' }}
  onClick={(e) => e.stopPropagation()}
>
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">تعديل ميزان</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-lg font-bold">
                ×
            </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-2 ">
          <div className="flex gap-4">
  <div className="flex flex-col">
    <label className="mb-1 text-sm font-medium text-gray-700">اسم الميزان *</label>
    <input
      name="name"
      value={form.name}
      onChange={handleChange}
      className="input-field-3"
    />
  </div>

  <div className="flex flex-col">
    <label className="mb-1 text-sm font-medium text-gray-700">الشركة المصنعة</label>
    <input
      name="manufacturer"
      value={form.manufacturer}
      onChange={handleChange}
      className="input-field-3"
    />
  </div>

  <div className="flex flex-col">
    <label className="mb-1 text-sm font-medium text-gray-700">الموديل</label>
    <input
      name="model"
      value={form.model}
      onChange={handleChange}
      className="input-field-3"
    />
  </div>
</div>


<div className="col-span-3">
  <label className="block mb-1 text-sm font-medium text-gray-700">نوع الاتصال *</label>
  <select
    name="connection_type"
    value={form.connection_type}
    onChange={handleChange}
    className="h-10 w-full px-4 py-2 text-sm bg-white border border-[rgba(134,143,160,0.16)] shadow-[0_1px_2px_rgba(0,0,0,0.06)] rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
  >
    <option value="tcp">TCP</option>
    <option value="serial">Serial</option>
  </select>
</div>


          {form.connection_type === 'tcp' && (
            <>
  
             <div className="col-span-3 grid grid-cols-2 gap-4">
  <div className="flex flex-col">
    <label className="mb-1 text-sm font-medium text-gray-700">عنوان الوصول (IP) *</label>
    <input
      name="ip"
      value={form.ip}
      onChange={handleChange}
    className="h-10 w-full px-4 py-2 text-sm bg-white border border-[rgba(134,143,160,0.16)] shadow-[0_1px_2px_rgba(0,0,0,0.06)] rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
    />
  </div>

  <div className="flex flex-col">
    <label className="mb-1 text-sm font-medium text-gray-700">البورت *</label>
    <input
      name="port"
      value={form.port}
      onChange={handleChange}
    className="h-10 w-full px-4 py-2 text-sm bg-white border border-[rgba(134,143,160,0.16)] shadow-[0_1px_2px_rgba(0,0,0,0.06)] rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
    />
  </div>
</div>


            </>
          )}

          {form.connection_type === 'serial' && (
            <>
              <div className="flex flex-col">
  <label className="mb-1 text-sm font-medium text-gray-700">المنفذ التسلسلي</label>
  <select
    name="serial_port"
    value={form.serial_port}
    onChange={handleChange}
    className="h-10 w-[193px] px-4 py-2 text-sm bg-white border border-[rgba(134,143,160,0.16)] shadow-[0_1px_2px_rgba(0,0,0,0.06)] rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
  >
    <option value="">اختر</option>
    {["COM1", "COM2", "COM3", "COM4", "COM5", "COM6"].map(port => (
      <option key={port} value={port}>{port}</option>
    ))}
  </select>
</div>

<div className="flex flex-col">
  <label className="mb-1 text-sm font-medium text-gray-700">معدل الباود</label>
  <select
    name="baudrate"
    value={form.baudrate}
    onChange={handleChange}
    className="h-10 w-[193px] px-4 py-2 text-sm bg-white border border-[rgba(134,143,160,0.16)] shadow-[0_1px_2px_rgba(0,0,0,0.06)] rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
  >
    <option value="">اختر</option>
    {[110, 300, 600, 1200, 2400, 4800, 9600, 14400, 19200, 38400].map(rate => (
      <option key={rate} value={rate}>{rate}</option>
    ))}
  </select>
</div>

<div className="flex flex-col">
  <label className="mb-1 text-sm font-medium text-gray-700">التكافؤ</label>
  <select
    name="parity"
    value={form.parity}
    onChange={handleChange}
    className="h-10 w-[193px] px-4 py-2 text-sm bg-white border border-[rgba(134,143,160,0.16)] shadow-[0_1px_2px_rgba(0,0,0,0.06)] rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
  >
    <option value="">اختر</option>
    {["none", "even", "odd", "mark", "space"].map(p => (
      <option key={p} value={p}>{p}</option>
    ))}
  </select>
</div>


              <div className="col-span-3 grid grid-cols-2 gap-4">
  <div className="flex flex-col">
    <label className="mb-1 text-sm font-medium text-gray-700">عدد البتات الوقوف</label>
    <select
      name="stop_bits"
      value={form.stop_bits}
      onChange={handleChange}
      className="h-10 w-full px-4 py-2 text-sm bg-white border border-[rgba(134,143,160,0.16)] shadow-[0_1px_2px_rgba(0,0,0,0.06)] rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
    >
      <option value="">اختر</option>
      {[1, 1.5, 2].map(val => (
        <option key={val} value={val}>{val}</option>
      ))}
    </select>
  </div>

  <div className="flex flex-col">
    <label className="mb-1 text-sm font-medium text-gray-700">التحكم في التدفق</label>
    <select
      name="flow_control"
      value={form.flow_control}
      onChange={handleChange}
      className="h-10 w-full px-4 py-2 text-sm bg-white border border-[rgba(134,143,160,0.16)] shadow-[0_1px_2px_rgba(0,0,0,0.06)] rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
    >
      <option value="">اختر</option>
      {["none", "hardware", "Xon/Xoff"].map(val => (
        <option key={val} value={val}>{val}</option>
      ))}
    </select>
  </div>
</div>

            </>
          )}

          <div className="col-span-3 grid grid-cols-2 gap-4">
  <div className="flex flex-col">
    <label className="mb-1 text-sm font-medium text-gray-700">التأخير</label>
    <select
      name="delay"
      value={form.delay}
      onChange={handleChange}
    className="h-10 w-full px-4 py-2 text-sm bg-white border border-[rgba(134,143,160,0.16)] shadow-[0_1px_2px_rgba(0,0,0,0.06)] rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
    >
      <option value="">اختر</option>
      {[1, 0.75, 0.5, 0.25, 0.1].map(val => (
        <option key={val} value={val}>{val}</option>
      ))}
    </select>
  </div>

  <div className="flex flex-col">
    <label className="mb-1 text-sm font-medium text-gray-700">عدد البتات</label>
    <select
      name="bits_number"
      value={form.bits_number}
      onChange={handleChange}
    className="h-10 w-full px-4 py-2 text-sm bg-white border border-[rgba(134,143,160,0.16)] shadow-[0_1px_2px_rgba(0,0,0,0.06)] rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
    >
      <option value="">اختر</option>
      {[5,6,7,8,16,32,64,128,256,512,1024].map(val => (
        <option key={val} value={val}>{val}</option>
      ))}
    </select>
  </div>
</div>


             <div className="col-span-3 grid grid-cols-2 gap-4">
  <div className="flex flex-col">
    <label className="mb-1 text-sm font-medium text-gray-700">بداية الوزن</label>
    <input
      name="weight_start_index"
      value={form.weight_start_index}
      onChange={handleChange}
    className="h-10 w-full px-4 py-2 text-sm bg-white border border-[rgba(134,143,160,0.16)] shadow-[0_1px_2px_rgba(0,0,0,0.06)] rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
    />
  </div>
  <div className="flex flex-col">
    <label className="mb-1 text-sm font-medium text-gray-700">نهاية الوزن</label>
    <input
      name="weight_end_index"
      value={form.weight_end_index}
      onChange={handleChange}
    className="h-10 w-full px-4 py-2 text-sm bg-white border border-[rgba(134,143,160,0.16)] shadow-[0_1px_2px_rgba(0,0,0,0.06)] rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
    />
  </div>
</div>

          <div className="col-span-3 my-4 flex justify-between items-center">
            <label className="text-sm">الحالة</label>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="status"
                checked={form.status}
                onChange={handleChange}
                className="sr-only"
              />
              <div className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${form.status ? 'bg-indigo-600' : 'bg-gray-300'}`}> 
                <span
                  className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${form.status ? 'translate-x-5' : ''}`}
                ></span>
              </div>
              <span className="mr-2 text-sm">في الخدمة</span>
            </label>
          </div>

          <div className="col-span-3 bg-gray-100 p-4 rounded-md">
            <div className="flex flex-col items-start w-full">
              <label className="flex items-center gap-2">
                <input type="checkbox" name="frontCameraEnabled" checked={form.frontCameraEnabled} onChange={handleChange} />
                <span>الكاميرا الأمامية</span>
              </label>
              {form.frontCameraEnabled && (
                <div className="grid grid-cols-2 gap-4 mt-2 w-full">
  <div className="flex flex-col">
    <label className="mb-1 text-sm font-medium text-gray-700">عنوان الوصول</label>
    <input
      name="front_camera_ip"
      value={form.front_camera_ip}
      onChange={handleChange}
    className="h-10 w-full px-4 py-2 text-sm bg-white border border-[rgba(134,143,160,0.16)] shadow-[0_1px_2px_rgba(0,0,0,0.06)] rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
    />
  </div>
  <div className="flex flex-col">
    <label className="mb-1 text-sm font-medium text-gray-700">البورت</label>
    <input
      name="front_camera_port"
      value={form.front_camera_port}
      onChange={handleChange}
    className="h-10 w-full px-4 py-2 text-sm bg-white border border-[rgba(134,143,160,0.16)] shadow-[0_1px_2px_rgba(0,0,0,0.06)] rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
    />
  </div>
</div>

              )}
            </div>
            </div>
            <div className="col-span-3 bg-gray-100 p-4 rounded-md">
            <div className="flex flex-col items-start w-full ">
              <label className="flex items-center gap-2">
                <input type="checkbox" name="rearCameraEnabled" checked={form.rearCameraEnabled} onChange={handleChange} />
                <span>الكاميرا الخلفية</span>
              </label>
              {form.rearCameraEnabled && (
                <div className="grid grid-cols-2 gap-4 mt-2 w-full">
  <div className="flex flex-col">
    <label className="mb-1 text-sm font-medium text-gray-700">عنوان الوصول</label>
    <input
      name="rear_camera_ip"
      value={form.rear_camera_ip}
      onChange={handleChange}
    className="h-10 w-full px-4 py-2 text-sm bg-white border border-[rgba(134,143,160,0.16)] shadow-[0_1px_2px_rgba(0,0,0,0.06)] rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
    />
  </div>
  <div className="flex flex-col">
    <label className="mb-1 text-sm font-medium text-gray-700">البورت</label>
    <input
      name="rear_camera_port"
      value={form.rear_camera_port}
      onChange={handleChange}
    className="h-10 w-full px-4 py-2 text-sm bg-white border border-[rgba(134,143,160,0.16)] shadow-[0_1px_2px_rgba(0,0,0,0.06)] rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
    />
  </div>
</div>

              )}
            </div>
          </div>

          <div className="col-span-3">
            <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded"> حفظ </button>
          </div>
        </form>

        {/* ✅ عرض البيانات الخام عبر WebSocket */}
        {form?.id && <RawDataDisplay scaleId={form.id} />}
      </div>
    </div>,
    document.body
  );
};

export default EditScaleModal;


