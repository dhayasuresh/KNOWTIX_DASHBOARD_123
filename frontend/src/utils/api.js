// utils/api.js
const API_URL = "http://localhost:5000"; // Your JSON server or backend URL

export const fetchData = async (endpoint) => {
  try {
    const response = await fetch(`${API_URL}/${endpoint}`);
    if (!response.ok) throw new Error("Network response not ok");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
};

export const postData = async (endpoint, body) => {
  try {
    const response = await fetch(`${API_URL}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error("Network response not ok");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Post error:", error);
    return null;
  }
};
