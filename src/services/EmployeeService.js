import axios from "../utils/axiosInstance";

export default class EmployeeService {
  getAuthHeaders() {
    const token = localStorage.getItem("accessToken");

    return {
      Authorization: `Bearer ${token}`,
    };
  }

  getById(id) {
    return axios.get(
      `https://localhost:7000/api/Employee/get-employee-by-id/${id}`,
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  update(id, data) {
    return axios.put(
      `https://localhost:7000/api/Employee/update-employee/${id}`,
      data, // ✅ Không bọc trong { dto: ... }
      {
        headers: this.getAuthHeaders(),
      }
    );
  }
}
