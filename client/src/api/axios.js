import axios from "axios";

const API = axios.create({
	baseURL: "https://task-manager-api-ctih.onrender.com",
});

// Add token automatically in every request (if exists)
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
