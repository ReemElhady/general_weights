import React, { useState, useEffect } from "react";
import axios from "axios";


const Settings = () => {
  // System Settings
  const [companyName, setCompanyName] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [startTicketNumber, setStartTicketNumber] = useState("");
  const [weightMethod, setWeightMethod] = useState("");
  const [weightUnit, setWeightUnit] = useState("");
  const [manipulationThreshold, setManipulationThreshold] = useState("");
  const [enableManipulation, setEnableManipulation] = useState(false);
  const [companyLogo, setCompanyLogo] = useState(null);
  const [logoFileName, setLogoFileName] = useState("");


  // Email Settings
  const [emailHost, setEmailHost] = useState("smtp.gmail.com");
  const [emailPort, setEmailPort] = useState(587);
  const [emailHostUser, setEmailHostUser] = useState("");
  const [emailHostPassword, setEmailHostPassword] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [useTls, setUseTls] = useState(true);



useEffect(() => {
  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem("token");

      const resSystem = await fetch("http://localhost:8000/api/v1/company/systemsettings/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (resSystem.ok) {
        const data = await resSystem.json();
        console.log("📦 بيانات النظام:", data);  

        // لو البيانات عبارة عن list
        const system = Array.isArray(data) ? data[0] : data;

        setCompanyName(system.company_name || "");
        setPaymentType(system.payment_type || "");
        setStartTicketNumber(system.start_ticket_number || "");
        setWeightMethod(system.weighing_method || "");
        setWeightUnit(system.weighing_unit || "");
        setManipulationThreshold(system.manipulation_threshold || "");
        setEnableManipulation(system.manipulation_threshold > 0);
        setLogoFileName(system.company_logo ? system.company_logo.split("/").pop() : "");

      } else {
        console.warn("⚠️ فشل في تحميل بيانات النظام:", await resSystem.text());
      }

      const resEmail = await fetch("http://localhost:8000/api/v1/company/emailsettings/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (resEmail.ok) {
        const data = await resEmail.json();
        console.log("📧 بيانات الإيميل:", data); 

        const email = Array.isArray(data) ? data[0] : data;

        setEmailHost(email.email_host || "");
        setEmailPort(email.email_port || 587);
        setEmailHostUser(email.email_host_user || "");
        setEmailHostPassword(email.email_host_password || "");
        setRecipientEmail(email.recipient_email || "");
        setUseTls(email.use_tls ?? true);
      } else {
        console.warn("⚠️ فشل في تحميل بيانات الإيميل:", await resEmail.text());
      }
    } catch (error) {
      console.error("❌ فشل تحميل البيانات:", error);
    }
  };

  fetchSettings();
}, []);




  const handleSubmit = async () => {
    try {
      const systemForm = new FormData();
      systemForm.append("company_name", companyName);
      systemForm.append("payment_type", paymentType);
      systemForm.append("start_ticket_number", startTicketNumber);
      systemForm.append("weighing_method", weightMethod);
      systemForm.append("weighing_unit", weightUnit);
      systemForm.append("manipulation_threshold", enableManipulation ? manipulationThreshold : 0);
      if (companyLogo) systemForm.append("company_logo", companyLogo);

      await axios.post("http://localhost:8000/api/v1/company/systemsettings/", systemForm, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${localStorage.getItem("token")}`, },
      });

      await fetch("http://localhost:8000/api/v1/company/emailsettings/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          email_host: emailHost,
          email_port: emailPort,
          email_host_user: emailHostUser,
          email_host_password: emailHostPassword,
          recipient_email: recipientEmail,
          use_tls: useTls
        }),
      });


      alert("تم حفظ الإعدادات بنجاح");
    } catch (error) {
      console.error("تفاصيل الخطأ:", error.response?.data || error.message);
      alert("حدث خطأ أثناء الحفظ");
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9fb] flex justify-center items-start px-4 pt-2">
      <div className="relative w-[1280px] flex gap-6 pb-6">
        <div className="bg-white rounded-xl shadow-md shadow-gray-300 p-6 overflow-auto mt-0" style={{ width: "935px" }}>
          <h2 className="text-xl font-bold mb-6">إعدادات النظام</h2>

          <form className="grid grid-cols-2 gap-4 text-right">
            <div className="shadow p-3 rounded border border-gray-300 col-span-2">
              <label className="flex flex-col">
                <span className="mb-1 font-medium">اسم الشركة *</span>
                <input type="text" className="border border-gray-300 rounded-xl p-3 text-base focus:outline-none focus:ring-2 focus:ring-primary"
 value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
              </label>
            </div>

            <div className="shadow p-3 rounded border border-gray-300">
              <label className="flex flex-col">
                <span className="mb-1 font-medium">نوع الدفع</span>
                <input type="text" className="border border-gray-300 rounded-xl p-3 text-base focus:outline-none focus:ring-2 focus:ring-primary"
 value={paymentType} onChange={(e) => setPaymentType(e.target.value)} />
              </label>
            </div>
            <div className="shadow p-3 rounded border border-gray-300">
              <label className="flex flex-col">
                <span className="mb-1 font-medium">رقم تذكرة البداية</span>
                <input type="text" className="border border-gray-300 rounded-xl p-3 text-base focus:outline-none focus:ring-2 focus:ring-primary"
 value={startTicketNumber} onChange={(e) => setStartTicketNumber(e.target.value)} />
              </label>
            </div>

            <div className="shadow p-3 rounded border border-gray-300">
              <label className="flex flex-col ">
                <span className="mb-1 font-medium">طريقة الوزن *</span>
                <select
                  className="input input-bordered"
                  value={weightMethod}
                  onChange={(e) => setWeightMethod(e.target.value)}
                >
                  <option value="">اختر طريقة الوزن</option>
                  <option value="manual">يدوي</option>
                  <option value="auto">تلقائي</option>
                </select>
              </label>
            </div>

            <div className="shadow p-3 rounded border border-gray-300">
              <label className="flex flex-col">
                <span className="mb-1 font-medium">وحدة الوزن</span>
                <select
                  className="input input-bordered"
                  value={weightUnit}
                  onChange={(e) => setWeightUnit(e.target.value)}
                >
                  <option value="">اختر وحدة الوزن</option>
                  <option value="kg">كيلوجرام</option>
                  <option value="ton">طن</option>
                </select>
              </label>
            </div>

            <div className="shadow p-3 rounded border border-gray-300 col-span-2">
              <div className="flex items-center justify-end mb-2 gap-2">
                <input type="checkbox" checked={enableManipulation} onChange={(e) => setEnableManipulation(e.target.checked)} />
                <span className="font-medium">تنبيهات الوزن الزائد</span>
              </div>
              <label className="flex flex-col">
                <span className="mb-1 font-medium">قيمة التلاعب</span>
                <input type="number" className="border border-gray-300 rounded-xl p-3 text-base focus:outline-none focus:ring-2 focus:ring-primary"
 value={manipulationThreshold} onChange={(e) => setManipulationThreshold(e.target.value)} disabled={!enableManipulation} />
              </label>
            </div>

            <div className="shadow p-4 rounded col-span-2 border border-gray-300">
  <label className="flex flex-col">
    <span className="mb-1 font-medium">شعار الشركة *</span>

    <div className="flex items-center gap-2 justify-end">
      {/* زر اختيار الملف */}
      <label className="min-w-[120px] text-center bg-primary text-white px-4 py-2 rounded cursor-pointer hover:bg-primary/90 text-sm">
        اختيار ملف
        <input
          type="file"
          className="hidden"
          onChange={(e) => {
            setCompanyLogo(e.target.files[0]);
            setLogoFileName(e.target.files[0]?.name || "");
          }}
        />
      </label>

      {/* مربع النص لعرض اسم الصورة */}
      <input
        type="text"
        className="w-full border border-gray-300 rounded p-2 text-sm bg-white"
        value={companyLogo?.name || logoFileName || ""}
        placeholder="اختر صورة..."
        readOnly
      />
    </div>
  </label>
</div>



            <h2 className="text-xl font-bold col-span-2 mt-8">إعدادات البريد الإلكتروني</h2>

            <div className="shadow p-3 rounded border border-gray-300">
              <label className="flex flex-col">
                <span className="mb-1 font-medium">Email Host</span>
                <input type="text" className="border border-gray-300 rounded-xl p-3 text-base focus:outline-none focus:ring-2 focus:ring-primary"
 value={emailHost} onChange={(e) => setEmailHost(e.target.value)} />
              </label>
            </div>

            <div className="shadow p-3 rounded border border-gray-300">
              <label className="flex flex-col">
                <span className="mb-1 font-medium">Email Port</span>
                <input type="number" className="border border-gray-300 rounded-xl p-3 text-base focus:outline-none focus:ring-2 focus:ring-primary"
 value={emailPort} onChange={(e) => setEmailPort(e.target.value)} />
              </label>
            </div>

            <div className="shadow p-3 rounded border border-gray-300">
              <label className="flex flex-col">
                <span className="mb-1 font-medium">Email Host User</span>
                <input type="email" className="border border-gray-300 rounded-xl p-3 text-base focus:outline-none focus:ring-2 focus:ring-primary"
 value={emailHostUser} onChange={(e) => setEmailHostUser(e.target.value)} />
              </label>
            </div>

            <div className="shadow p-3 rounded border border-gray-300">
              <label className="flex flex-col">
                <span className="mb-1 font-medium">Email Host Password</span>
                <input type="password" className="border border-gray-300 rounded-xl p-3 text-base focus:outline-none focus:ring-2 focus:ring-primary"
 value={emailHostPassword} onChange={(e) => setEmailHostPassword(e.target.value)} />
              </label>
            </div>

            <div className="shadow p-3 rounded col-span-2 border border-gray-300">
              <label className="flex flex-col">
                <span className="mb-1 font-medium">Recipient Email</span>
                <input type="email" className="border border-gray-300 rounded-xl p-3 text-base focus:outline-none focus:ring-2 focus:ring-primary"
 value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} />
              </label>
            </div>

            <div className="shadow p-3 rounded col-span-2 flex items-center gap-2 border border-gray-300">
              <input type="checkbox" checked={useTls} onChange={(e) => setUseTls(e.target.checked)} />
              <span className="font-medium">استخدام TLS</span>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-md shadow-gray-300 p-6 flex flex-col items-center mt-2 h-fit pt-4 pb-6" style={{ width: "315px", gap: "12px" }}>
          <h3 className="text-lg font-semibold w-full text-center bg-[#5F4DEE] text-white py-2 rounded">إعدادات النظام</h3>
          <button className="border border-[#5F4DEE] text-[#5F4DEE] px-4 py-2 rounded-lg hover:bg-[#5F4DEE] hover:text-white transition-colors" onClick={handleSubmit}>
            حفظ الإعدادات
          </button>
          <a
            href="mailto:contact@m-iit.com"
            className="text-sm text-gray-500 flex items-center gap-1"
          >
            <span role="img" aria-label="lock">🔒</span> تواصل مع الدعم
          </a>

        </div>
      </div>
    </div>
  );
};

export default Settings;
