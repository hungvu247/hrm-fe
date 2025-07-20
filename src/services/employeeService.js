import axios from "axios";

export default class EmployeeService {
    getAuthHeaders() {
        const token = localStorage.getItem("accessToken");
        return {
            Authorization: `Bearer ${token}`,
        };
    }

    getAll(pageNumber = 1, pageSize = 10, searchData = {}) {
        return axios.post(
            `https://localhost:7000/api/Employee/get-all-employee`,
            searchData,
            {
                headers: this.getAuthHeaders(),
                params: {
                    pageNumber,
                    pageSize,
                },
            }
        );
    }


    getById(id) {
        return axios.get(`https://localhost:7000/api/Employee/get-employee-by-id/${id}`, {
            headers: this.getAuthHeaders(),
        });
    }

    addEmployee(employeeData) {
        return axios.post("https://localhost:7000/api/Employee/add-employee", employeeData, {
            headers: this.getAuthHeaders()
        });
    }

    updateEmployee(id, data) {
        console.log("edit employee", data);
        return axios.put(
            `https://localhost:7000/api/Employee/update-employee/${id}`,
            data,
            {
                headers: this.getAuthHeaders(),
            }
        );
    }
}
