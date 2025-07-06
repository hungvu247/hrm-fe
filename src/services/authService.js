// src/services/authService.js
import axios from "../utils/axiosInstance";

const API_URL = "https://localhost:7000/api";

const AuthService = {
  login: (credentials) => axios.post(`${API_URL}/Account/login`, credentials),

  refreshToken: (tokens) =>
    axios.post(`${API_URL}/Account/refresh-token`, tokens),
};

export default AuthService;
