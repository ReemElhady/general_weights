import React, { useEffect, useRef, useState } from "react";

const RawDataDisplay = ({ scaleId }) => {
  const [socketStatus, setSocketStatus] = useState("جاري الاتصال...");
  const [structuredRaw, setStructuredRaw] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    const socketUrl = "ws://localhost:8000/ws/scale/";
    const socket = new WebSocket(socketUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      setSocketStatus("✅ السوكيت مفتوح");
      socket.send(JSON.stringify({ action: "init", scale_id: scaleId }));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.error) {
        setSocketStatus(`❌ ${data.error}`);
        return;
      }

      if (data.structured_raw) {
        setStructuredRaw(data.structured_raw);
      }
    };

    socket.onerror = (err) => {
      console.error("WebSocket Error:", err);
      setSocketStatus("❌ خطأ في الاتصال بالسوكيت");
    };

    socket.onclose = () => {
      setSocketStatus("⚠️ السوكيت مغلق");
    };

    return () => {
      socket.close();
    };
  }, [scaleId]);

  const handleCloseSocket = () => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
      setSocketStatus("🚫 تم إغلاق السوكيت يدويًا");
    }
  };

  return (
    <div className="mt-6">
      <h5 className="text-base font-semibold mb-2">البيانات الخام:</h5>

      <div
        dir="ltr"
        id="raw-display-container"
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "8px",
          flexWrap: "nowrap",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          backgroundColor: "#fafafa",
          margin: "auto",
          overflowX: "auto",
        }}
      >
        {structuredRaw.map((item, index) => (
          <div key={index} style={{ textAlign: "center", margin: "0 4px" }}>
            <div style={{ fontWeight: "bold", fontSize: "12px" }}>{index}</div>
            <div style={{ background: "#eee", padding: "4px 8px", borderRadius: "4px" }}>{item}</div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleCloseSocket}
        className="btn btn-sm btn-danger mt-2 d-block mx-auto"
      >
        إيقاف السوكيت
      </button>

      <p dir="ltr" style={{ marginTop: "5px", fontWeight: "bold", textAlign: "center" }}>
        {socketStatus}
      </p>
    </div>
  );
};

export default RawDataDisplay;
