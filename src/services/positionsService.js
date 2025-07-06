import axios from "../utils/axiosInstance";
export default class PositionService {
  getAuthHeaders() {
    const token = localStorage.getItem("accessToken");
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  getPaged({ search = "", skip = 0, top = 5, orderBy = "PositionName" }) {
    const params = new URLSearchParams({
      search,
      skip,
      top,
      orderBy,
    });

    return axios.get(`https://localhost:7000/api/Position?${params}`, {
      headers: this.getAuthHeaders(),
    });
  }

  getById(id) {
    return axios.get(`https://localhost:7000/api/Position/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  add(values) {
    return axios.post("https://localhost:7000/api/Position", values, {
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeaders(),
      },
    });
  }

  update(values) {
    return axios.put(
      `https://localhost:7000/api/Position/${values.positionId}`,
      values,
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  delete(id) {
    return axios.delete(`https://localhost:7000/api/Position/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
}
