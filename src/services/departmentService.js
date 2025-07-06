import axios from "../utils/axiosInstance";

export default class DepartmentService {
  getAuthHeaders() {
    const token = localStorage.getItem("accessToken");
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  getPaged({ search = "", skip = 0, top = 5, orderBy = "DepartmentName" }) {
    const params = new URLSearchParams({
      search,
      skip,
      top,
      orderBy,
    });

    return axios.get(`https://localhost:7000/api/Department?${params}`, {
      headers: this.getAuthHeaders(),
    });
  }

  getById(id) {
    return axios.get(`https://localhost:7000/api/Department/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  add(values) {
    return axios.post("https://localhost:7000/api/Department", values, {
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeaders(),
      },
    });
  }

  update(values) {
    return axios.put(
      `https://localhost:7000/api/Department/${values.departmentId}`,
      values,
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  delete(id) {
    return axios.delete(`https://localhost:7000/api/Department/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
}
