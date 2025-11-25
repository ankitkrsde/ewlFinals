// Enhanced environment detection for Vercel and production
const getApiBaseUrl = () => {
  // For all environments - use the environment variable with localhost fallback
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
};

const API_BASE_URL = getApiBaseUrl();

class API {
  constructor() {
    this.baseURL = API_BASE_URL;
    console.log("🚀 API Base URL:", this.baseURL); // Debug log

    // Add request timeout
    this.timeout = 60000; // 60 seconds
  }

  async request(endpoint, options = {}) {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

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

    // Add timeout to fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    config.signal = controller.signal;

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      clearTimeout(timeoutId);

      // Handle different response types
      const contentType = response.headers.get("content-type");

      // Don't throw error for 404 - let the calling code handle it
      if (!response.ok && response.status !== 404) {
        let errorData;

        if (contentType && contentType.includes("application/json")) {
          errorData = await response.json();
        } else {
          const errorText = await response.text();
          try {
            errorData = JSON.parse(errorText);
          } catch {
            errorData = {
              message: errorText || `HTTP error! status: ${response.status}`,
            };
          }
        }

        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      // Parse response based on content type
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error.name === "AbortError") {
        console.error("API Request timeout:", endpoint);
        throw new Error("Request timeout - please try again");
      }

      console.error("API Error:", error.message, "Endpoint:", endpoint);

      // Enhanced error messages
      if (error.message.includes("Failed to fetch")) {
        throw new Error("Network error - please check your connection");
      }

      throw error;
    }
  }

  async upload(endpoint, formData) {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    // Add timeout to upload request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: "POST",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          // Don't set Content-Type for FormData, let browser set it with boundary
        },
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText || "Upload failed" };
        }
        throw new Error(
          errorData.message || `Upload failed! status: ${response.status}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error.name === "AbortError") {
        console.error("Upload timeout:", endpoint);
        throw new Error("Upload timeout - please try again");
      }

      console.error("Upload Error:", error);
      throw error;
    }
  }

  // Auth methods
  async login(credentials) {
    return this.request("/api/auth/login", {
      method: "POST",
      body: credentials,
    });
  }

  async register(userData) {
    return this.request("/api/auth/register", {
      method: "POST",
      body: userData,
    });
  }

  async getProfile() {
    return this.request("/api/users/me");
  }

  async updateProfile(profileData) {
    return this.request("/api/auth/updatedetails", {
      method: "PUT",
      body: profileData,
    });
  }

  async updatePassword(passwordData) {
    return this.request("/api/auth/updatepassword", {
      method: "PUT",
      body: passwordData,
    });
  }

  async deleteAvatar() {
    return this.request("/api/auth/deleteAvatar", {
      method: "DELETE",
    });
  }

  async getGuideProfile() {
    try {
      const response = await this.request("/api/guides/me");
      console.log("📦 Guide profile API response:", response);

      // Handle 404 - guide profile doesn't exist yet
      if (response.message && response.message.includes("Resource not found")) {
        console.log(
          "🔍 No guide profile found - this is normal for new guides"
        );
        return {
          success: true,
          data: null,
          message: "No guide profile found",
        };
      }

      // Handle authentication errors
      if (response.message && response.message.includes("Not authorized")) {
        console.log("🔐 Authentication issue");
        return {
          success: false,
          data: null,
          message: "Authentication required",
        };
      }

      // Return the actual data
      if (response.success) {
        return {
          success: true,
          data: response.data || null,
        };
      }

      return response;
    } catch (error) {
      console.error("Error in getGuideProfile:", error);
      // If it's a 404, handle it gracefully
      if (
        error.message.includes("404") ||
        error.message.includes("Resource not found")
      ) {
        return {
          success: true,
          data: null,
          message: "No guide profile found",
        };
      }

      // Handle network errors specifically
      if (
        error.message.includes("Network error") ||
        error.message.includes("Failed to fetch")
      ) {
        return {
          success: false,
          data: null,
          message: "Network error - please check your connection",
        };
      }

      throw error;
    }
  }

  async createGuideProfile(guideData) {
    console.log("🔧 API: Creating new guide profile with:", guideData);
    const response = await this.request("/api/guides", {
      method: "POST",
      body: guideData,
    });
    console.log("🔧 API: Create response:", response);
    return response;
  }

  async updateGuideProfile(guideData) {
    console.log("🔧 API: Updating guide profile with:", guideData);
    const response = await this.request("/api/guides/profile", {
      method: "PUT",
      body: guideData,
    });
    console.log("🔧 API: Update response:", response);
    return response;
  }

  async getGuidePublicProfile(guideId) {
    return this.request(`/api/guides/${guideId}`);
  }

  async getMyGuideStats() {
    const response = await this.request("/api/guides/stats");
    // Transform the response
    if (response.success && response.data) {
      return {
        success: true,
        data: response.data,
      };
    }
    return response;
  }

  // Guide methods (public)
  async getGuides(query = "") {
    return this.request(`/api/guides${query}`);
  }

  async getGuideEarnings() {
    const response = await this.request("/api/guides/earnings");
    // Transform the response
    if (response.success && response.data) {
      return {
        success: true,
        data: response.data,
      };
    }
    return response;
  }

  async getGuideById(id) {
    return this.request(`/api/guides/${id}`);
  }

  // Booking methods
  async createBooking(bookingData) {
    return this.request("/api/bookings", {
      method: "POST",
      body: bookingData,
    });
  }

  async getMyBookings() {
    return this.request("/api/bookings/my-bookings");
  }

  // Review methods
  async createReview(reviewData) {
    return this.request("/api/reviews", {
      method: "POST",
      body: reviewData,
    });
  }

  // Message methods
  async getMessages(userId) {
    return this.request(`/api/messages/${userId}`);
  }

  async sendMessage(messageData) {
    return this.request("/api/messages", {
      method: "POST",
      body: messageData,
    });
  }

  // Health check
  async healthCheck() {
    try {
      const response = await this.request("/api/health");
      return {
        success: true,
        data: response,
        server: this.baseURL,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        server: this.baseURL,
      };
    }
  }

  // Generic methods
  get(endpoint) {
    return this.request(endpoint);
  }

  post(endpoint, data) {
    return this.request(endpoint, {
      method: "POST",
      body: data,
    });
  }

  put(endpoint, data) {
    return this.request(endpoint, {
      method: "PUT",
      body: data,
    });
  }

  delete(endpoint) {
    return this.request(endpoint, {
      method: "DELETE",
    });
  }

  // Utility method to check API connectivity
  async checkConnectivity() {
    try {
      const startTime = Date.now();
      const response = await this.healthCheck();
      const endTime = Date.now();

      return {
        connected: response.success,
        responseTime: endTime - startTime,
        server: this.baseURL,
        message: response.success ? "Connected successfully" : response.message,
      };
    } catch (error) {
      return {
        connected: false,
        responseTime: null,
        server: this.baseURL,
        message: error.message,
      };
    }
  }
}

// Create and export a singleton instance
export const api = new API();
export default api;
