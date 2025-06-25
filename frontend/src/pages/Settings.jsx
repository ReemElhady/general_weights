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
  const [companyLogoUrl, setCompanyLogoUrl] = useState("");

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
          const system = Array.isArray(data) ? data[0] : data;

          setCompanyName(system.company_name || "");
          setPaymentType(system.payment_type || "");
          setStartTicketNumber(system.start_ticket_number || "");
          setWeightMethod(system.weighing_method || "");
          setWeightUnit(system.weighing_unit || "");
          setManipulationThreshold(system.manipulation_threshold || "");
          setEnableManipulation(system.manipulation_threshold > 0);
          setLogoFileName(system.company_logo ? system.company_logo.split("/").pop() : "");
          setCompanyLogoUrl(system.company_logo ? `http://localhost:8000${system.company_logo}` : "");
        }

        const resEmail = await fetch("http://localhost:8000/api/v1/company/emailsettings/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (resEmail.ok) {
          const data = await resEmail.json();
          const email = Array.isArray(data) ? data[0] : data;

          setEmailHost(email.email_host || "");
          setEmailPort(email.email_port || 587);
          setEmailHostUser(email.email_host_user || "");
          setEmailHostPassword(email.email_host_password || "");
          setRecipientEmail(email.recipient_email || "");
          setUseTls(email.use_tls ?? true);
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
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      await fetch("http://localhost:8000/api/v1/company/emailsettings/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          email_host: emailHost,
          email_port: emailPort,
          email_host_user: emailHostUser,
          email_host_password: emailHostPassword,
          recipient_email: recipientEmail,
          use_tls: useTls,
        }),
      });

      alert("تم حفظ الإعدادات بنجاح");
    } catch (error) {
      console.error("تفاصيل الخطأ:", error.response?.data || error.message);
      alert("حدث خطأ أثناء الحفظ");
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9fb] flex justify-center items-start px-4 pt-2" >
      <div className="relative w-[1280px] flex gap-6 pb-6">
        <div className="bg-white rounded-xl shadow-md shadow-gray-300 p-6 overflow-auto mt-0" style={{ width: "935px" }}>
          <h2 className="text-xl font-bold mb-6"> </h2>

          <form className="grid grid-cols-2 gap-4 text-right" dir="rtl">
            <div className="   border-gray-300 col-span-2">
              <label className="flex flex-col">
                <span className="mb-1 font-medium">اسم الشركة *</span>
                <input type="text" className="border border-gray-300 rounded-xl p-3 text-base focus:outline-none focus:ring-2 focus:ring-primary"
                  value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
              </label>
            </div>

            <div className=" border-gray-300">
              <label className="flex flex-col">
                <span className="mb-1 font-medium">نوع الدفع *</span>
                <input type="text" className="border border-gray-300 rounded-xl p-3 text-base focus:outline-none focus:ring-2 focus:ring-primary"
                  value={paymentType} onChange={(e) => setPaymentType(e.target.value)} />
              </label>
            </div>
            <div className=" border-gray-300">
              <label className="flex flex-col">
                <span className="mb-1 font-medium">رقم تذكرة البداية *</span>
                <input type="text" className="border border-gray-300 rounded-xl p-3 text-base focus:outline-none focus:ring-2 focus:ring-primary"
                  value={startTicketNumber} onChange={(e) => setStartTicketNumber(e.target.value)} />
              </label>
            </div>

            <div className=" border-gray-300">
              <label className="flex flex-col">
                <span className="mb-1 font-medium">طريقة الوزن *</span>
                <select
                  className="border border-gray-300 rounded-xl p-3 text-base focus:outline-none focus:ring-2 focus:ring-primary"
                  value={weightMethod}
                  onChange={(e) => setWeightMethod(e.target.value)}
                >
                  <option value="">اختر طريقة الوزن</option>
                  <option value="manual">يدوي</option>
                  <option value="auto">تلقائي</option>
                </select>
              </label>
            </div>

            <div className=" border-gray-300 ">
              <label className="flex flex-col">
                <span className="mb-1 font-medium">وحدة الوزن *</span>
                <select
                  className="border border-gray-300 rounded-xl p-3 text-base focus:outline-none focus:ring-2 focus:ring-primary"
                  value={weightUnit}
                  onChange={(e) => setWeightUnit(e.target.value)}
                >
                  <option value="">اختر وحدة الوزن</option>
                  <option value="kg">كيلوجرام</option>
                  <option value="ton">طن</option>
                </select>
              </label>
            </div>

          <div className="border border-gray-300 bg-gray-100 col-span-2 rounded-2xl p-3" dir="ltr">
            <div className="flex items-center justify-end mb-2 gap-2">
              <input
                type="checkbox"
                checked={enableManipulation}
                onChange={(e) => setEnableManipulation(e.target.checked)}
                className="accent-[#5F4DEE] w-5 h-5"
              />
              <span className="font-medium">* تنبيهات الوزن الزائد </span>
            </div>

            {enableManipulation && (
              <label className="flex flex-col" dir="rtl">
                <span className="mb-1 font-medium"> قيمة التلاعب * </span>
                <input
                  type="number"
                  className="border border-gray-300 rounded-xl p-3 text-base focus:outline-none focus:ring-2 focus:ring-primary"
                  value={manipulationThreshold}
                  onChange={(e) => setManipulationThreshold(e.target.value)}
                />
              </label>
            )}
          </div>

            <div className="col-span-2">
      <label className="flex flex-col w-full">
        <span className="mb-1 font-medium text-right text-sm text-gray-700">شعار الشركة *</span>
        <label
          htmlFor="logo-upload"
          className="cursor-pointer w-full h-40 border-2 border-dashed border-emerald-400 bg-emerald-50 rounded-2xl flex items-center justify-center overflow-hidden hover:bg-emerald-100 transition"
        >
          {!companyLogo && !companyLogoUrl ? (
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="text-emerald-500 bg-emerald-100 p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16V4m0 0L3 8m4-4l4 4M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2h-2m-4 0h4m-4 0H7m0 0v-4"
                  />
                </svg>
              </div>
              <p className="text-sm text-gray-600">أفلت الملف هنا أو اختره من جهاز الكمبيوتر</p>
            </div>
          ) : companyLogo ? (
            <img
              src={URL.createObjectURL(companyLogo)}
              alt="Company Logo Preview"
              className="object-contain h-full"
            />
          ) : (
            <img
              src={companyLogoUrl}
              alt="Company Logo"
              className="object-contain h-full"
            />
          )}

          <input
            id="logo-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setCompanyLogo(file);
                setLogoFileName(file.name);
              }
            }}
          />
        </label>
        {companyLogo && (
          <p className="mt-2 text-sm text-gray-700 text-center">
            الملف المحدد: <span className="font-semibold">{companyLogo.name}</span>
          </p>
        )}
      </label>
    </div>
            <h2 className="text-xl font-bold col-span-2 mt-8">إعدادات البريد الإلكتروني</h2>

            <div className=" border-gray-300">
              <label className="flex flex-col">
                <span className="mb-1 font-medium">Email Host</span>
                <input type="text" className="border border-gray-300 rounded-xl p-3 text-base focus:outline-none focus:ring-2 focus:ring-primary"
                  value={emailHost} onChange={(e) => setEmailHost(e.target.value)} />
              </label>
            </div>

            <div className=" border-gray-300">
              <label className="flex flex-col">
                <span className="mb-1 font-medium">Email Port</span>
                <input type="number" className="border border-gray-300 rounded-xl p-3 text-base focus:outline-none focus:ring-2 focus:ring-primary"
                  value={emailPort} onChange={(e) => setEmailPort(e.target.value)} />
              </label>
            </div>

            <div className=" border-gray-300">
              <label className="flex flex-col">
                <span className="mb-1 font-medium">Email Host User</span>
                <input type="email" className="border border-gray-300 rounded-xl p-3 text-base focus:outline-none focus:ring-2 focus:ring-primary"
                  value={emailHostUser} onChange={(e) => setEmailHostUser(e.target.value)} />
              </label>
            </div>

            <div className=" border-gray-300">
              <label className="flex flex-col">
                <span className="mb-1 font-medium">Email Host Password</span>
                <input type="password" className="border border-gray-300 rounded-xl p-3 text-base focus:outline-none focus:ring-2 focus:ring-primary"
                  value={emailHostPassword} onChange={(e) => setEmailHostPassword(e.target.value)} />
              </label>
            </div>

            <div className=" col-span-2  border-gray-300">
              <label className="flex flex-col">
                <span className="mb-1 font-medium">Recipient Email</span>
                <input type="email" className="border border-gray-300 rounded-xl p-3 text-base focus:outline-none focus:ring-2 focus:ring-primary"
                  value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} />
              </label>
            </div>

            <div className=" p-3 rounded col-span-2 flex items-center gap-2  border-gray-300">
              <input type="checkbox" checked={useTls} onChange={(e) => setUseTls(e.target.checked)} />
              <span className="font-medium">استخدام TLS</span>
            </div>
            <div className="col-span-2 mt-6">
              <button
                onClick={handleSubmit}
                className="w-full bg-[#5F4DEE] text-white py-3 rounded-lg hover:bg-[#4a3dcc] transition-colors text-lg font-semibold"
              >
                حفظ الإعدادات
              </button>
            </div>
          </form>
        </div>

        <div className="flex flex-col items-center gap-3" dir="rtl">
  {/* كرت إعدادات النظام */}
  <div
    className="bg-white shadow-md shadow-gray-300 flex justify-center items-center"
    style={{
      width: "315px",
      height: "95px",
      borderRadius: "12px",
    }}
  >
    <button
      className="flex items-center gap-2 bg-[#5F4DEE] text-white font-semibold justify-center"
      style={{
        width: "275px",
        height: "55px",
        borderRadius: "12px",
      }}
    >
      <span role="img" aria-label="settings" className="text-xl">⚙️</span>
      إعدادات النظام
    </button>
  </div>

  {/* كرت تواصل مع الدعم */}
  <div
    className="bg-white shadow-md shadow-gray-300 flex justify-center items-center"
    style={{
      width: "315px",
      height: "46px",
      borderRadius: "12px",
      padding: "11px 16px",
    }}
  >
    <a
      href="mailto:contact@m-iit.com"
      className="flex items-center gap-2 text-sm text-black font-medium"
    >
      <span role="img" aria-label="headphones" className="text-xl">🎧</span>
      تواصل مع الدعم
    </a>
  </div>
</div>

      </div>
    </div>
  );
};

export default Settings;
