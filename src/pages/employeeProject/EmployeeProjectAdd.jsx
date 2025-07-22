import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Container, Form } from "semantic-ui-react";
import Headline from "../../layouts/Headline";
import EmployeeProjectService from "../../services/employeeProjectService";

export default function EmployeeProjectAdd() {
  const { projectId } = useParams(); // lấy projectId từ URL
  const [employees, setEmployees] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  const navigate = useNavigate();
  const employeeProjectService = new EmployeeProjectService();

  useEffect(() => {
    // Lấy danh sách nhân viên
    employeeProjectService
      .getAllEmployee()
      .then((response) => {
        setEmployees(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    // Lấy project theo ID (nếu có projectId)
    if (projectId) {
      employeeProjectService
        .getProjectById(projectId)
        .then((response) => {
          console.log("Project by ID:", response.data);
          setSelectedProject(response.data);
          formik.setFieldValue("ProjectId", response.data.ProjectId); // gán luôn ProjectId vào formik
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [projectId]);

  const initialValues = {
    EmployeeId: "",
    ProjectId: "",
    RoleInProject: "",
  };

  const validationSchema = Yup.object({
    EmployeeId: Yup.number().required("Employee is required"),
    ProjectId: Yup.number().required("Project is required"),
    RoleInProject: Yup.string().required("Role in project is required"),
  });

  const handleSubmit = (values) => {
    console.log("Submitted:", values);
    employeeProjectService
      .add(values)
      .then((res) => {
        console.log("Response từ server:", res);

        if (res?.data?.StatusCode === 5000) {
          console.log("Đã tồn tại");
        } else {
          console.log("Ok");
          navigate(`/dashboard/employee-projects/${projectId}`); // quay lại list
        }
      })
      .catch((err) => {
        console.error("Error khi gọi API:", err);
      });
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <Container className="content">
      <Headline content="Add Employee to Project" />
      <Form onSubmit={formik.handleSubmit}>
        <Form.Select
          label="Employee"
          name="EmployeeId"
          options={employees.map((e) => ({
            key: e.employeeId,
            value: e.employeeId,
            text: e.username,
          }))}
          value={formik.values.employeeId}
          onChange={(e, { value }) => formik.setFieldValue("EmployeeId", value)}
          error={
            formik.touched.EmployeeId && formik.errors.EmployeeId
              ? { content: formik.errors.EmployeeId }
              : null
          }
        />

        <Form.Input
          label="Project"
          name="ProjectId"
          value={selectedProject ? selectedProject.ProjectName : ""}
          readOnly
        />

        <Form.Input
          label="Role In Project"
          name="RoleInProject"
          value={formik.values.RoleInProject}
          onChange={formik.handleChange}
          error={
            formik.touched.RoleInProject && formik.errors.RoleInProject
              ? { content: formik.errors.RoleInProject }
              : null
          }
        />

        <Button type="submit" color="blue" content="Add" fluid />
      </Form>
    </Container>
  );
}
