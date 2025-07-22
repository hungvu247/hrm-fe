import React, { useEffect, useState } from "react";
import { Button, Form, Message } from "semantic-ui-react";
import ProjectService from "../../services/ProjectService";
import { useParams, useNavigate } from "react-router-dom";

export default function ProjectEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const projectService = new ProjectService();

  const [project, setProject] = useState({
    id: "",
    projectName: "",
    description: "",
    startDate: "",
    endDate: ""
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProject();
  }, []);

  const loadProject = async () => {
    try {
      const res = await projectService.getById(id);
      const data = res.data;

      setProject({
        id: data.projectId,
        projectName: data.projectName,
        description: data.description,
        startDate: data.startDate.slice(0, 10), // yyyy-MM-dd
        endDate: data.endDate.slice(0, 10),
      });
      setLoading(false);
    } catch (err) {
      setError("Không thể tải dữ liệu.");
      setLoading(false);
    }
  };

  const handleChange = (e, { name, value }) => {
    setProject({ ...project, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      await projectService.update(project);
      navigate("/dashboard/projects"); // quay về danh sách
    } catch (err) {
      setError("Cập nhật thất bại!");
    }
  };

  if (loading) return <p>Đang tải...</p>;

  return (
    <div>
        <br></br>
      <h2>Cập nhật Project</h2>

      {error && <Message negative>{error}</Message>}

      <Form onSubmit={handleSubmit}>
        <Form.Input
          label="Tên dự án"
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
        />
        <Form.Input
          type="date"
          label="Ngày kết thúc"
          name="endDate"
          value={project.endDate}
          onChange={handleChange}
        />

        <Button type="submit" color="green">
          Lưu thay đổi
        </Button>
        <Button type="button" onClick={() => navigate("/projects")}>
          Hủy
        </Button>
      </Form>
    </div>
  );
}
