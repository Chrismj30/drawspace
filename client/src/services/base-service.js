import axios from "axios";
import { getSession } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function fetchWithAuth(endpoint, options = {}) {
  try {
    console.log("fetchWithAuth called for endpoint:", endpoint);
    
    const session = await getSession();
    console.log("Session retrieved:", !!session);
    console.log("Has idToken:", !!session?.idToken);
    
    if (!session?.idToken) {
      console.log("No idToken available in session");
      throw new Error("Authentication required");
    }

    console.log("Making request to:", `${API_URL}${endpoint}`);
    console.log("Token length:", session.idToken.length);

    const response = await axios({
      url: `${API_URL}${endpoint}`,
      method: options.method || "GET",
      headers: {
        Authorization: `Bearer ${session.idToken}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
      data: options.body,
      params: options.params,
    });

    console.log("Request successful, status:", response.status);
    return response.data;
  } catch (error) {
    console.error("API Request Error:", error.response?.data || error.message);
    console.error("Error status:", error.response?.status);
    console.error("Error headers:", error.response?.headers);
    throw error;
  }
}
