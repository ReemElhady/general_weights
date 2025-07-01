import { authHeadersJSON } from "./authHeaders";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const fetchYearStats = async (selectedYear) => {
  const res = await fetch(
    `${BASE_URL}/tickets/analytics/yearly/?year=${selectedYear}`,
    { headers: authHeadersJSON() }
  );
  return res.json();
};

export const fetchChartData = async (selectedYear, period, selectedMonth) => {
  let url = `${BASE_URL}/tickets/analytics/summary/?year=${selectedYear}`;

  if (period === "weekly" || period === "monthly") {
    url += `&mode=${period}`;
    if (selectedMonth) url += `&month=${selectedMonth}`;
  } else if (period === "last7days") {
    url += `&mode=last_7_days`;
  }

  const res = await fetch(url, { headers: authHeadersJSON() });
  return res.json();
};

export const fetchScalesStats = async () => {
  const res = await fetch(
    `${BASE_URL}/business/scales/analytics/`,
    { headers: authHeadersJSON() }
  );
  return res.json();
};

export const fetchBlockedVehicles = async () => {
  const res = await fetch(
    `${BASE_URL}/vehicles/blocked/`,
    { headers: authHeadersJSON() }
  );
  return res.json();
};

export const fetchTickets = async () => {
  try {
    const response = await fetch(`${BASE_URL}/tickets/`, {
      method: "GET",
      headers: authHeadersJSON(),
    });
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return []; 
  }
};
