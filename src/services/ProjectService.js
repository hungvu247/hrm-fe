import axios from "../utils/axiosInstance";

export default class ProjectService {
  getAuthHeaders() {
    const token = localStorage.getItem("accessToken");
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  
  getPaged({ search = "", page = 1, pageSize = 10 }) {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    params.append("page", page);
    params.append("pageSize", pageSize);

    return axios.get(`https://localhost:7000/api/project?${params.toString()}`);
  }

  getDocumentsByProjectId(projectId) {
  return axios.get(
    `https://localhost:7000/api/ProjectDocuments/document/${projectId}`,
    { headers: this.getAuthHeaders() }
  );
  }


  //  Get chi tiết theo ID
  getById(id) {
    return axios.get(`https://localhost:7000/api/Project/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  //  Thêm project
  add(values) {
    return axios.post("https://localhost:7000/api/Project", values, {
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeaders(),
      },
    });
  }

  //  Cập nhật project
  update(values) {
    return axios.put(
      `https://localhost:7000/api/Project/${values.id}`,
      values,
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  //  Xoá project
   deleteProject(id) {
    return axios.delete(`https://localhost:7000/api/Project/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
}
