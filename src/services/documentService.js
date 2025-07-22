import axios from "axios";

const API_URL = "https://localhost:7000/api/ProjectDocuments";

export default class DocumentService {
  // GET: Lấy toàn bộ tài liệu
  async getAll() {
    return await axios.get(`${API_URL}`);
  }

  // GET: Lấy tài liệu theo ProjectId
  async getByProjectId(projectId) {
    return await axios.get(`${API_URL}/document/${projectId}`);
  }

  // GET: Lấy chi tiết tài liệu theo DocumentId
  async getById(id) {
    return await axios.get(`${API_URL}/${id}`);
  }

  // POST: Thêm tài liệu mới
  async create(data) {
    return await axios.post(`${API_URL}`, data);
  }

  // PUT: Cập nhật tài liệu
  async update(id, data) {
    return await axios.put(`${API_URL}/${id}`, data);
  }

  // DELETE: Xóa tài liệu
  async delete(id) {
    return await axios.delete(`${API_URL}/${id}`);
  }
}
