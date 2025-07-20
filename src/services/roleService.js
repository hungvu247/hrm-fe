import axios from "axios";

export default class RoleService{
    getAuthHeaders() {
        const token = localStorage.getItem("accessToken");
        return {
            Authorization: `Bearer ${token}`,
        };
    }

    getAll() {
        return axios.get("https://localhost:7000/api/Role/get-all-role", {
            headers: this.getAuthHeaders(),
        });
    }

    getById(id) {
        return axios.get(`https://localhost:7000/api/Role/get-role-by-id/${id}`, {
            headers: this.getAuthHeaders(),
        });
    }

}