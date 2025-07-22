import axios from "axios";

export default class EmployeeContactService {
    getAuthHeaders() {
        const token = localStorage.getItem("accessToken");
        return {
            Authorization: `Bearer ${token}`,
        };
    }

    // ✅ Lấy tất cả liên hệ nhân viên (có filter + phân trang)
    getAll(pageNumber = 1, pageSize = 10, searchData = {}) {
        const dto = {
            page: pageNumber,
            pageSize: pageSize,
            ...searchData
        };

        return axios.post(
            `https://localhost:7000/api/EmployeeContact/get-all-employee-contact`,
            dto,
            { headers: this.getAuthHeaders() }
        );
    }

    // ✅ Thêm mới liên hệ
    addContact(contactData) {
        return axios.post(
            `https://localhost:7000/api/EmployeeContact/add-contact`,
            contactData,
            { headers: this.getAuthHeaders() }
        );
    }

    // ✅ Xóa theo contactId
    deleteById(contactId) {
        return axios.delete(
            `https://localhost:7000/api/EmployeeContact/delete-contact/${contactId}`,
            { headers: this.getAuthHeaders() }
        );
    }

    // ✅ Xóa theo employeeId và type
    deleteByEmployeeIdAndType(employeeId, type) {
        return axios.delete(
            `https://localhost:7000/api/EmployeeContact/delete-contact/${employeeId}/${type}`,
            { headers: this.getAuthHeaders() }
        );
    }

    // ✅ Cập nhật liên hệ
    updateContact(contactId, updateData) {
        console.log(updateData);
        return axios.put(
            `https://localhost:7000/api/EmployeeContact/update-contact/${contactId}`,
            updateData,
            { headers: this.getAuthHeaders() }
        );
    }

    getById(id) {
        return axios.get(`https://localhost:7000/api/EmployeeContact/get-by-id/${id}`, {
            headers: this.getAuthHeaders(),
        });
    }
}
