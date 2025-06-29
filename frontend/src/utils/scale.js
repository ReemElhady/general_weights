import parseErrorMessage from "./handleError";
const BASE_URL = import.meta.env.VITE_BASE_URL;
import { authHeadersJSON } from "./authHeaders";

export const scaleAPI = {
  create: async (payload) => {
    const response = await fetch(`${BASE_URL}/business/scales/`, {
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

  get: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${BASE_URL}/business/scales/?${query}`, {
      method: 'GET',
      headers: authHeadersJSON(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(parseErrorMessage(error));
    }

    return  response.json();
  },

  getOne: async (id) => {
    const response = await fetch(`${BASE_URL}/business/scales/${id}/`, {
      method: 'GET',
      headers: authHeadersJSON(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(parseErrorMessage(error));
    }

    return  response.json();
  },


  update: async (id, payload) => {
    const response = await fetch(`${BASE_URL}/business/scales/${id}/`, {
      method: 'PUT',
      headers: authHeadersJSON(),
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(parseErrorMessage(error));
    }
    
    return response.json();
  },

  // Delete driver by ID
  delete: async (id) => {
    const response = await fetch(`${BASE_URL}/business/scales/${id}/`, {
      method: 'DELETE',
      headers: authHeadersJSON(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(parseErrorMessage(error));
    }

    return true;
  },
};
