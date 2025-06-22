import React, { useState } from "react";
import AddScaleModal from "./AddScaleModal"; // لو المودال في نفس المجلد
import { getAuthToken } from "../utils/auth";


const Scales = () => {
  const [showModal, setShowModal] = useState(false);

  console.log(getAuthToken);

  return (
    <div className="space-y-8 p-4">
      <div className="text-right text-2xl font-bold">الموازين</div>

      <div className="text-right">
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#5F4DEE] text-white px-4 py-2 rounded-lg"
        >
          + إضافة ميزان
        </button>
      </div>

      {showModal && <AddScaleModal onClose={() => setShowModal(false)} />}

    </div>
  );
};

export default Scales;
