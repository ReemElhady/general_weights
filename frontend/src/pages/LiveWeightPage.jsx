// src/pages/LiveWeightPage.jsx
import React, { useEffect, useState, useRef } from "react";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const SOCKET_URL = import.meta.env.VITE_SOCKET;


const LiveWeightPage = ({ scaleId }) => {
  const [liveWeight, setLiveWeight] = useState(null);
  const [status, setStatus] = useState("🕐 جاري الاتصال...");
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = new WebSocket(`ws://${SOCKET_URL}/ws/scale/`);
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
  <div className="flex items-center justify-center text-indigo-500 text-[120px] font-bold leading-none tracking-widest h-40">
    {liveWeight !== null ? `${liveWeight} كجم` : "—"}
  </div>
  );
}

export default LiveWeightPage;
