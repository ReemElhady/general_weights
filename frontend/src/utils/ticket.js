import parseErrorMessage from "./handleError";
const BASE_URL = import.meta.env.VITE_BASE_URL;
import { authHeadersJSON } from "./authHeaders";

export const ticketAPI = {
    create: async (payload) => {
        const response = await fetch(`${BASE_URL}/tickets/first-weight/`, {
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
        const response = await fetch(`${BASE_URL}/tickets/?${query}`, {
            method: 'GET',
            headers: authHeadersJSON(),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(parseErrorMessage(error));
        }

        return response.json();
    },
    getScales: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        const response = await fetch(`${BASE_URL}/business/scales/?${query}`, {
            method: 'GET',
            headers: authHeadersJSON(),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(parseErrorMessage(error));
        }

        return response.json();
    },
    getItems: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        const response = await fetch(`${BASE_URL}/business/items/?${query}`, {
            method: 'GET',
            headers: authHeadersJSON(),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(parseErrorMessage(error));
        }

        return response.json();
    },
    getIncomplete: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        const response = await fetch(`${BASE_URL}/tickets/incomplete/?${query}`, {
            method: 'GET',
            headers: authHeadersJSON(),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(parseErrorMessage(error));
        }

        return response.json();
    },


    getOne: async (id) => {
        const response = await fetch(`${BASE_URL}/tickets/${id}/`, {
            method: 'GET',
            headers: authHeadersJSON(),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(parseErrorMessage(error));
        }

        return response.json();
    },


    update: async (id, payload) => {
        const response = await fetch(`${BASE_URL}/tickets/${id}/second-weight/`, {
            method: 'PATCH',
            headers: authHeadersJSON(),
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(parseErrorMessage(error));
        }

        return response.json();
    },

    delete: async (id) => {
        const response = await fetch(`${BASE_URL}/tickets/${id}/delete/`, {
            method: 'DELETE',
            headers: authHeadersJSON(),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(parseErrorMessage(error));
        }

        return true;
    },

    exportOne: async (id) => {
        const url = `${BASE_URL}/tickets/${id}/export/`;
        const response = await fetch(url, {
            method: 'GET',
            headers: authHeadersJSON(),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(parseErrorMessage(error));
        }

        // Trigger browser download
        const blob = await response.blob();
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `ticket_${id}.xlsx`;
        link.click();
    },

    exportOnePDF: async (id) => {
        const url = `${BASE_URL}/tickets/${id}/export-pdf/`;
        const response = await fetch(url, {
            method: 'GET',
            headers: authHeadersJSON(),
        });
    
        if (!response.ok) {
            const error = await response.json();
            throw new Error(parseErrorMessage(error));
        }
    
        // Trigger browser download
        const blob = await response.blob();
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `ticket_${id}.pdf`;
        link.click();
    },
    exportAllFilteredExcel: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        const url = `${BASE_URL}/tickets/export-excel/?${query}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: authHeadersJSON(),
        });
    
        if (!response.ok) {
            const error = await response.json();
            throw new Error(parseErrorMessage(error));
        }
    
        const blob = await response.blob();
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `filtered_tickets.xlsx`;
        link.click();
    },
    
    exportAllFilteredPDF: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        const url = `${BASE_URL}/tickets/export-pdf/?${query}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: authHeadersJSON(),
        });
    
        if (!response.ok) {
            const error = await response.json();
            throw new Error(parseErrorMessage(error));
        }
    
        const blob = await response.blob();
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `filtered_tickets.pdf`;
        link.click();
    },
    
    print: async (id) => {
        const response = await fetch(`${BASE_URL}/tickets/${id}/print/`, {
            method: 'GET',
            headers: authHeadersJSON(),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(parseErrorMessage(error));
        }

        return response.json();
    },
};
