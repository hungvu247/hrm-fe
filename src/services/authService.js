import axios from "axios";

const API_URL = "https://localhost:7000/api";

const AuthService = {
  login: (credentials) => axios.post(`${API_URL}/Account/login`, credentials),
};

export default AuthService;
