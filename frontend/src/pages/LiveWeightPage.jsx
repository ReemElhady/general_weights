// src/pages/LiveWeightPage.jsx
import React, { useEffect, useState, useRef } from "react";

const LiveWeightPage = ({ scaleId }) => {
  const [liveWeight, setLiveWeight] = useState(null);
  const [status, setStatus] = useState("🕐 جاري الاتصال...");
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8000/ws/scale/");
    socketRef.current = socket;

    socket.onopen = () => {
      setStatus("✅ متصل بالميزان");
      socket.send(JSON.stringify({ action: "init", scale_id: scaleId }));
    };

    socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.error) {
        setStatus(`❌ ${data.error}`);
        return;
    }

    if (data.weight) {
        const cleanWeight = data.weight.replace(/#/g, "").trim();
        setLiveWeight(cleanWeight);
    }
    };



    socket.onerror = () => {
      setStatus("❌ خطأ في الاتصال");
    };

    socket.onclose = () => {
      setStatus("⚠️ تم قطع الاتصال");
    };

    return () => {
      socket.close();
    };
  }, [scaleId]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-4" dir="rtl">
      <h1 className="text-2xl font-bold mb-4">الوزن المباشر</h1>
      <div className="text-center text-gray-600 mb-2">{status}</div>

      <div className="bg-white p-6 rounded shadow text-center text-4xl font-bold text-green-600 w-64">
        {liveWeight !== null ? `${liveWeight} كجم` : "—"}
      </div>
    </div>
  );
};

export default LiveWeightPage;
