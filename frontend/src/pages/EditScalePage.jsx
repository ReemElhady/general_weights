import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import RawDataDisplay from "../components/RawDataDisplay";

const DELAY_CHOICES = [1, 0.75, 0.5, 0.25, 0.1];
const BITS_NUMBER_CHOICES = [5, 6, 7, 8, 16, 32, 64, 128, 256, 512, 1024];
const SERIAL_PORT_CHOICES = ["COM1", "COM2", "COM3", "COM4", "COM5", "COM6"];
const BAUDRATE_CHOICES = [110, 300, 600, 1200, 2400, 4800, 9600, 14400, 19200, 38400];
const PARITY_CHOICES = ["none", "even", "odd", "mark", "space"];
const STOP_BITS_CHOICES = [1, 1.5, 2];
const FLOW_CONTROL_CHOICES = ["none", "hardware", "Xon/Xoff"];

const EditScaleModal = ({ scaleId, onClose }) => {
  const [form, setForm] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8000/api/v1/business/scales/${scaleId}/`, {
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

    await fetch(`http://localhost:8000/api/v1/business/scales/${scaleId}/`, {
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
        className="relative bg-white p-4 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto text-sm shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-bold">تعديل الميزان</h3>
          <button onClick={onClose} className="text-xl font-bold">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-2">
         <div className="flex flex-col">
            <label className="mb-1">اسم الميزان</label>
            <input name="name" value={form.name} onChange={handleChange} className="border p-2 rounded" required />
          </div>

          <div className="flex flex-col">
            <label className="mb-1">الشركة المصنعة</label>
            <input name="manufacturer" value={form.manufacturer} onChange={handleChange} className="border p-2 rounded" />
          </div>

          <div className="flex flex-col">
            <label className="mb-1">الموديل</label>
            <input name="model" value={form.model} onChange={handleChange} className="border p-2 rounded" />
          </div>

          <div className="col-span-3">
            <label className="block mb-1">نوع الاتصال</label>
            <select name="connection_type" value={form.connection_type} onChange={handleChange} className="border p-2 rounded w-full">
              <option value="tcp">TCP</option>
              <option value="serial">Serial</option>
            </select>
          </div>

          {form.connection_type === "tcp" && (
            <>
              <div className="flex flex-col">
                <label className="mb-1">عنوان الوصول (IP)</label>
                <input name="ip" value={form.ip} onChange={handleChange} className="border p-2 rounded" />
              </div>
              <div className="flex flex-col">
                <label className="mb-1">البورت</label>
                <input name="port" value={form.port} onChange={handleChange} className="border p-2 rounded" />
              </div>
            </>
          )}

          {form.connection_type === "serial" && (
            <>
              <div className="flex flex-col">
                <label className="mb-1">المنفذ التسلسلي</label>
                <select name="serial_port" value={form.serial_port} onChange={handleChange} className="border p-2 rounded">
                  <option value="">اختر</option>
                  {SERIAL_PORT_CHOICES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label className="mb-1">Baudrate</label>
                <select name="baudrate" value={form.baudrate} onChange={handleChange} className="border p-2 rounded">
                  {BAUDRATE_CHOICES.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label className="mb-1">Parity</label>
                <select name="parity" value={form.parity} onChange={handleChange} className="border p-2 rounded">
                  {PARITY_CHOICES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label className="mb-1">Stop Bits</label>
                <select name="stop_bits" value={form.stop_bits} onChange={handleChange} className="border p-2 rounded">
                  {STOP_BITS_CHOICES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label className="mb-1">Flow Control</label>
                <select name="flow_control" value={form.flow_control} onChange={handleChange} className="border p-2 rounded">
                  {FLOW_CONTROL_CHOICES.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div className="flex flex-col">
            <label className="mb-1">Delay</label>
            <select name="delay" value={form.delay} onChange={handleChange} className="border p-2 rounded">
              {DELAY_CHOICES.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="mb-1">عدد البتات</label>
            <select name="bits_number" value={form.bits_number} onChange={handleChange} className="border p-2 rounded">
              {BITS_NUMBER_CHOICES.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="mb-1">بداية الوزن</label>
            <input name="weight_start_index" value={form.weight_start_index} onChange={handleChange} className="border p-2 rounded" />
          </div>

          <div className="flex flex-col">
            <label className="mb-1">نهاية الوزن</label>
            <input name="weight_end_index" value={form.weight_end_index} onChange={handleChange} className="border p-2 rounded" />
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

          <div className="col-span-3 bg-gray-100 p-4 rounded">
            <div className="flex flex-col items-start w-full mb-4">
              <label className="flex items-center gap-2">
                <input type="checkbox" name="frontCameraEnabled" checked={form.frontCameraEnabled} onChange={handleChange} />
                <span>الكاميرا الأمامية</span>
              </label>
              {form.frontCameraEnabled && (
                <div className="grid grid-cols-2 gap-4 mt-2 w-full">
                  <div className="flex flex-col">
                    <label className="mb-1">عنوان الوصول</label>
                    <input name="front_camera_ip" value={form.front_camera_ip} onChange={handleChange} className="border p-2 rounded" />
                  </div>
                  <div className="flex flex-col">
                    <label className="mb-1">البورت</label>
                    <input name="front_camera_port" value={form.front_camera_port} onChange={handleChange} className="border p-2 rounded" />
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col items-start w-full">
              <label className="flex items-center gap-2">
                <input type="checkbox" name="rearCameraEnabled" checked={form.rearCameraEnabled} onChange={handleChange} />
                <span>الكاميرا الخلفية</span>
              </label>
              {form.rearCameraEnabled && (
                <div className="grid grid-cols-2 gap-4 mt-2 w-full">
                  <div className="flex flex-col">
                    <label className="mb-1">عنوان الوصول</label>
                    <input name="rear_camera_ip" value={form.rear_camera_ip} onChange={handleChange} className="border p-2 rounded" />
                  </div>
                  <div className="flex flex-col">
                    <label className="mb-1">البورت</label>
                    <input name="rear_camera_port" value={form.rear_camera_port} onChange={handleChange} className="border p-2 rounded" />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="col-span-3 mt-4">
            <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded">حفظ</button>
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


