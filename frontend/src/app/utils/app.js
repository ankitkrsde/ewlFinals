const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_API_URL || "https://your-backend-domain.com"
    : process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

class API {
  constructor() {
    this.baseURL = API_BASE_URL;
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

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);

      // Don't throw error for 404 - let the calling code handle it
      if (!response.ok && response.status !== 404) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText || "Request failed" };
        }
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  async upload(endpoint, formData) {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: "POST",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          // Don't set Content-Type for FormData, let browser set it with boundary
        },
        body: formData,
      });

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
      throw error;
    }
  }

  async createGuideProfile(guideData) {
    console.log("🔧 API: Creating new guide profile with:", guideData);
    const response = await this.request("/api/guides", {
      // ✅ This should be POST to /api/guides
      method: "POST",
      body: guideData,
    });
    console.log("🔧 API: Create response:", response);
    return response;
  }

  async updateGuideProfile(guideData) {
    console.log("🔧 API: Updating guide profile with:", guideData);
    const response = await this.request("/api/guides/profile", {
      // ✅ This should be PUT to /api/guides/profile
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
    return this.request("/api/health");
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
}

// Create and export a singleton instance
export const api = new API();
export default api;
