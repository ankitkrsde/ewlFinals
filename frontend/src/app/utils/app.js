const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://your-backend-domain.com/api"
    : "http://localhost:5000/api";

export const api = {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === "object") {
      config.body = JSON.stringify(config.body);
    }

    const response = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "API request failed");
    }

    return data;
  },

  get(endpoint) {
    return this.request(endpoint);
  },

  post(endpoint, data) {
    return this.request(endpoint, {
      method: "POST",
      body: data,
    });
  },

  put(endpoint, data) {
    return this.request(endpoint, {
      method: "PUT",
      body: data,
    });
  },

  delete(endpoint) {
    return this.request(endpoint, {
      method: "DELETE",
    });
  },
};

export default api;
