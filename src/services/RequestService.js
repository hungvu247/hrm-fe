// src/services/RequestService.js
import axios from "axios";

const API_URL = "https://localhost:7000/api/Request";
const API_URL_Role = "https://localhost:7000/api/Employee/role";
const APT_URL_Type = "https://localhost:7000/api/RequestType";

class RequestService {
  getAuthHeaders() {
    const token = localStorage.getItem("accessToken");
    return {
      Authorization: `Bearer ${token}`, // ✅ sửa lại cú pháp đúng
    };
  }

  // Lấy danh sách request theo nhân viên
  getByEmployee() {
    return axios.get(API_URL, {
      headers: this.getAuthHeaders(),
    });
  }

  // Lấy role của user đang đăng nhập
  getRoleUser() {
    return axios.get(API_URL_Role, {
      headers: this.getAuthHeaders(),
    });
  }
  // Lấy role của user đang đăng nhập
  getAllRequestTypes() {
    return axios.get(APT_URL_Type, {
      headers: this.getAuthHeaders(),
    });
  }

  // ✅ Thêm hàm tạo request form
  createRequestForm(data) {
    return axios.post(API_URL, data, {
      headers: {
        ...this.getAuthHeaders(),
        "Content-Type": "application/json",
      },
    });
  }

  updateStatus(id, data) {
    return axios.put(`${API_URL}/update-status/${id}`, data, {
      headers: {
        ...this.getAuthHeaders(),
        "Content-Type": "application/json",
      },
    });
  }
}

// ✅ Export class đúng tên
export default new RequestService();
