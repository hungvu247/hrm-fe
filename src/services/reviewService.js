import axios from "axios";

const API_URL = "https://localhost:7000/api/PerformanceReviews";
export default class ReviewService {
  getAuthHeaders() {
    const token = localStorage.getItem("accessToken");
    return {
      Authorization: `Bearer ${token}`,
    };
  }
  getByProjectId(projectId) {
    return axios.get(`${API_URL}/project/${projectId}`);
  }
}


