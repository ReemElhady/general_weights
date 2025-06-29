import parseErrorMessage from "./handleError";
const BASE_URL = import.meta.env.VITE_BASE_URL;
import { authHeadersJSON } from "./authHeaders";

export const blockedVehicleAPI = {

  get: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${BASE_URL}/vehicles/blocked/?${query}`, {
      method: 'GET',
      headers: authHeadersJSON(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(parseErrorMessage(error));
    }

    return  response.json();
  },

  unblock: async (id, payload) => {
    const response = await fetch(`${BASE_URL}/vehicles/${id}/unblock/`, {
      method: 'POST',
      headers: authHeadersJSON(),
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(parseErrorMessage(error));
    }
    
    return response.json();
  },

};
