const BASE_URL = import.meta.env.VITE_BASE_URL;

// Helper function to parse error messages
const parseErrorMessage = (error) => {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error.non_field_errors && Array.isArray(error.non_field_errors)) {
    return error.non_field_errors.join('. ');
  }
  
  if (error.detail) {
    return error.detail;
  }
  
  if (error.message) {
    return error.message;
  }
  
  // Handle field-specific errors
  const fieldErrors = [];
  Object.keys(error).forEach(field => {
    if (Array.isArray(error[field])) {
      error[field].forEach(msg => {
        fieldErrors.push(`${field}: ${msg}`);
      });
    } else if (typeof error[field] === 'string') {
      fieldErrors.push(`${field}: ${error[field]}`);
    }
  });
  
  if (fieldErrors.length > 0) {
    return fieldErrors.join('. ');
  }
  
  return 'حدث خطأ غير متوقع';
};

export const authAPI = {
  login: async (credentials) => {
    const response = await fetch(`${BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(parseErrorMessage(error));
    }
    
    return response.json();
  },

  register: async (userData) => {
    const response = await fetch(`${BASE_URL}/api/v1/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(parseErrorMessage(error));
    }
    
    return response.json();
  }
};

export const setAuthToken = (token) => {
  localStorage.setItem("token", token);
};

export const removeAuthToken = () => {
  localStorage.removeItem("token");
};

export const getAuthToken = () => {
  return localStorage.getItem("token");
};