import React, { useEffect, useState } from "react";

const DELAY_CHOICES = [1, 0.75, 0.5, 0.25, 0.1];
const BITS_NUMBER_CHOICES = [5,6,7,8,16,32,64,128,256,512,1024];
const SERIAL_PORT_CHOICES = ["COM1","COM2","COM3","COM4","COM5","COM6"];
const BAUDRATE_CHOICES = [110,300,600,1200,2400,4800,9600,14400,19200,38400];
const PARITY_CHOICES = ["none","even","odd","mark","space"];
const STOP_BITS_CHOICES = [1,1.5,2];
const FLOW_CONTROL_CHOICES = ["none","hardware","Xon/Xoff"];

const EditScalePage = ({ scaleId, onClose }) => {
  const [scaleData, setScaleData] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8000/api/v1/business/scales/${scaleId}/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(res => res.json())
      .then(data => setScaleData(data))
      .catch(() => alert("فشل في تحميل بيانات الميزان"));
  }, [scaleId]);

  const handleChange = (field, value) => {
    setScaleData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:8000/api/v1/business/scales/${scaleId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(scaleData),
      });
      if (res.ok) {
        alert("تم تعديل الميزان بنجاح");
        onClose();
        window.location.reload();
      } else {
        const errData = await res.json();
        alert("فشل في تعديل الميزان: " + JSON.stringify(errData));
      }
    } catch {
      alert("حدث خطأ أثناء التعديل");
    }
  };

  if (!scaleData) return <div>جاري التحميل...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow mt-6">
      <h2 className="text-xl mb-4">تعديل الميزان</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label>اسم الميزان</label>
          <input
            type="text"
            value={scaleData.name || ""}
            onChange={e => handleChange("name", e.target.value)}
            className="border p-2 w-full rounded"
            required
          />
        </div>

        <div>
          <label>الشركة المصنعة</label>
          <input
            type="text"
            value={scaleData.manufacturer || ""}
            onChange={e => handleChange("manufacturer", e.target.value)}
            className="border p-2 w-full rounded"
          />
        </div>

        <div>
          <label>الموديل</label>
          <input
            type="text"
            value={scaleData.model || ""}
            onChange={e => handleChange("model", e.target.value)}
            className="border p-2 w-full rounded"
          />
        </div>

        <div>
          <label>نوع الاتصال</label>
          <select
            value={scaleData.connection_type || "tcp"}
            onChange={e => handleChange("connection_type", e.target.value)}
            className="border p-2 rounded"
            required
          >
            <option value="serial">Serial</option>
            <option value="tcp">TCP</option>
          </select>
        </div>

        {scaleData.connection_type === "tcp" && (
          <>
            <div>
              <label>عنوان الوصول (IP)</label>
              <input
                type="text"
                value={scaleData.ip || ""}
                onChange={e => handleChange("ip", e.target.value)}
                className="border p-2 w-full rounded"
              />
            </div>
            <div>
              <label>البورت</label>
              <input
                type="number"
                value={scaleData.port || ""}
                onChange={e => handleChange("port", e.target.value)}
                className="border p-2 w-full rounded"
              />
            </div>
          </>
        )}

        {scaleData.connection_type === "serial" && (
          <>
            <div>
              <label>المنفذ التسلسلي</label>
              <select
                value={scaleData.serial_port || ""}
                onChange={e => handleChange("serial_port", e.target.value)}
                className="border p-2 rounded"
              >
                <option value="">-- اختر --</option>
                {SERIAL_PORT_CHOICES.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div>
              <label>Baudrate</label>
              <select
                value={scaleData.baudrate || 9600}
                onChange={e => handleChange("baudrate", Number(e.target.value))}
                className="border p-2 rounded"
              >
                {BAUDRATE_CHOICES.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div>
              <label>Parity</label>
              <select
                value={scaleData.parity || "none"}
                onChange={e => handleChange("parity", e.target.value)}
                className="border p-2 rounded"
              >
                {PARITY_CHOICES.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div>
              <label>Stop Bits</label>
              <select
                value={scaleData.stop_bits || 1}
                onChange={e => handleChange("stop_bits", Number(e.target.value))}
                className="border p-2 rounded"
              >
                {STOP_BITS_CHOICES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label>Flow Control</label>
              <select
                value={scaleData.flow_control || "none"}
                onChange={e => handleChange("flow_control", e.target.value)}
                className="border p-2 rounded"
              >
                {FLOW_CONTROL_CHOICES.map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
          </>
        )}

        <div>
          <label>Delay</label>
          <select
            value={scaleData.delay || 0.5}
            onChange={e => handleChange("delay", Number(e.target.value))}
            className="border p-2 rounded"
          >
            {DELAY_CHOICES.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div>
          <label>عدد البتات</label>
          <select
            value={scaleData.bits_number || 8}
            onChange={e => handleChange("bits_number", Number(e.target.value))}
            className="border p-2 rounded"
          >
            {BITS_NUMBER_CHOICES.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        <div>
          <label>الكاميرا الأمامية (IP)</label>
          <input
            type="text"
            value={scaleData.front_camera_ip || ""}
            onChange={e => handleChange("front_camera_ip", e.target.value)}
            className="border p-2 w-full rounded"
          />
        </div>

        <div>
          <label>البورت الخاص بالكاميرا الأمامية</label>
          <input
            type="text"
            value={scaleData.front_camera_port || ""}
            onChange={e => handleChange("front_camera_port", e.target.value)}
            className="border p-2 w-full rounded"
          />
        </div>

        <div>
          <label>الكاميرا الخلفية (IP)</label>
          <input
            type="text"
            value={scaleData.rear_camera_ip || ""}
            onChange={e => handleChange("rear_camera_ip", e.target.value)}
            className="border p-2 w-full rounded"
          />
        </div>

        <div>
          <label>البورت الخاص بالكاميرا الخلفية</label>
          <input
            type="text"
            value={scaleData.rear_camera_port || ""}
            onChange={e => handleChange("rear_camera_port", e.target.value)}
            className="border p-2 w-full rounded"
          />
        </div>

        <div>
          <label>الحالة</label>
          <select
            value={scaleData.status ? "active" : "inactive"}
            onChange={e => handleChange("status", e.target.value === "active")}
            className="border p-2 rounded"
          >
            <option value="active">في الخدمة</option>
            <option value="inactive">خارج الخدمة (صيانة)</option>
          </select>
        </div>

        <div className="flex justify-between mt-6">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            حفظ التعديلات
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 px-6 py-2 rounded hover:bg-gray-400"
          >
            إلغاء
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditScalePage;
