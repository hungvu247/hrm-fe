import React, { useState } from "react";
import { Button, Form } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import ProjectService from "../../services/ProjectService";

export default function ProjectAdd() {
  const projectService = new ProjectService();
  const navigate = useNavigate();

  const [project, setProject] = useState({
    projectName: "",
    description: "",
    startDate: "",
    endDate: "",
  });

  const handleChange = (e, { name, value }) => {
    setProject({ ...project, [name]: value });
  };

  const handleSubmit = async () => {
  try {
    await projectService.add(project);
    alert("Thêm dự án thành công!");
    navigate("/dashboard/projects");
  } catch (err) {
    console.error("Lỗi khi thêm:", err);

    // Nếu có message từ backend
    if (err.response && err.response.data && err.response.data.message) {
      alert(`Lỗi: ${err.response.data.message}`);
    } else {
      alert("Không thể thêm dự án!");
    }
  }
};


  return (
    <div>
        <br></br>
      <h2>Thêm Project</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Input
          label="Tên Dự Án"
          name="projectName"
          value={project.projectName}
          onChange={handleChange}
          required
        />
        <Form.TextArea
          label="Mô tả"
          name="description"
          value={project.description}
          onChange={handleChange}
        />
        <Form.Input
          type="date"
          label="Ngày bắt đầu"
          name="startDate"
          value={project.startDate}
          onChange={handleChange}
          required
        />
        <Form.Input
          type="date"
          label="Ngày kết thúc"
          name="endDate"
          value={project.endDate}
          onChange={handleChange}
          required
        />
        <Button type="submit" color="green">Thêm</Button>
        <Button type="button" onClick={() => navigate("/projects")}>
          Hủy
        </Button>
      </Form>
    </div>
  );
}
