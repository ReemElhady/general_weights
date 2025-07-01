// src/utils/settings.js
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getSystemSettings = async (token) => {
  const res = await fetch(`${BASE_URL}/company/systemsettings/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("فشل في تحميل إعدادات النظام");
  return res.json();
};

export const getEmailSettings = async (token) => {
  const res = await fetch(`${BASE_URL}/emailsettings/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log(res)
  if (!res.ok) throw new Error("فشل في تحميل إعدادات البريد الإلكتروني");
  return res.json();
};

export const saveSystemSettings = async (token, systemForm, systemId) => {
  if (systemId) {
    return axios.put(`${BASE_URL}/systemsettings/${systemId}/`, systemForm, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
  } else {
    return axios.post(`${BASE_URL}/systemsettings/`, systemForm, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
  }
};

export const saveEmailSettings = async (token, emailData, emailId) => {
  const url = emailId
    ? `${BASE_URL}/emailsettings/${emailId}/`
    : `${BASE_URL}/emailsettings/`;
  const method = emailId ? "PUT" : "POST";
  return fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(emailData),
  });
};
