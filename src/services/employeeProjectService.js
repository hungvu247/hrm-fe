import axios from "axios";

export default class EmployeeContactService {

    getAuthHeaders() {
        const token = localStorage.getItem("accessToken");
        return {
            Authorization: `Bearer ${token}`,
        };
    }

    getAll(dto) {
        console.log("✅ check data DTO object:", dto);
        console.log("✅ check data DTO JSON:", JSON.stringify(dto));

        return axios.post(
            `https://localhost:7000/api/EmployeeProject/get-by-project-id`,
            dto,
            { headers: this.getAuthHeaders() }
        );
    }

    add(payload) {
        return axios.post(
            `https://localhost:7000/api/EmployeeProject/add`,
            payload,
            { headers: this.getAuthHeaders() }
        );
    }
    update(payload) {
        return axios.put(
            `https://localhost:7000/api/EmployeeProject/update`,
            payload,
            { headers: this.getAuthHeaders() }
        );
    }
    getAllEmployee() {
        return axios.get(
            "https://localhost:7000/api/EmployeeProject/get-all-employee2",
            { headers: this.getAuthHeaders() }
        )
    }

    getAllProjects(){
        return axios.get("https://localhost:7000/api/EmployeeProject/get-all-project",
            { headers: this.getAuthHeaders() })
    }

    getProjectById(id) {
        return axios.get(`https://localhost:7000/api/EmployeeProject/get-project-by-id/${id}`, {
            headers: this.getAuthHeaders()
        });
    }


    delete(EmployeeId, ProjectId) {
        return axios.delete(`https://localhost:7000/api/EmployeeProject/delete/${EmployeeId}/${ProjectId}`, {
            headers: this.getAuthHeaders()
        },);
    }

    getToEdit(EmployeeId, ProjectId) {
        return axios.get(`https://localhost:7000/api/EmployeeProject/get-to-edit/${EmployeeId}/${ProjectId}`, {
            headers: this.getAuthHeaders()
        },);
    }
}