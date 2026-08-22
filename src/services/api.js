import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8069",
  headers: { "Content-Type": "application/json" }
});

export default api;
