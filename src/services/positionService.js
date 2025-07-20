import axios from "axios";

export default class PositionService{
    getAuthHeaders() {
        const token = localStorage.getItem("accessToken");
        return {
            Authorization: `Bearer ${token}`,
        };
    }

    getAll() {
        return axios.get("https://localhost:7000/api/Position/get-all-position", {
            headers: this.getAuthHeaders(),
        });
    }

    getById(id) {
        return axios.get(`https://localhost:7000/api/Position/get-position-by-id/${id}`, {
            headers: this.getAuthHeaders(),
        });
    }
}