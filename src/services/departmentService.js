import axios from "axios";

export default class DepartmentService {
  getAll() {
    return axios.get("https://localhost:7000/api/Department");
  }

  getById(id) {
    return axios.get(`https://localhost:7000/api/Department/${id}`);
  }

  add(values) {
    return axios.post("https://localhost:7000/api/Department", values, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  update(values) {
    return axios.put(
      `http://localhost:7000/api/department/${values.departmentId}`,
      values
    );
  }

  delete(id) {
    return axios.delete(`http://localhost:7000/api/department/${id}`);
  }
}
