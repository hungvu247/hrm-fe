import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, Container, Form } from "semantic-ui-react";

import Headline from "../../layouts/Headline";
import EmployeeService from "../../services/employeeService";
import DepartmentService from "../../services/departmentService";
import PositionService from "../../services/positionService";
import RoleService from "../../services/roleService";

export default function EmployeeEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [roles, setRoles] = useState([]);

  const employeeService = new EmployeeService();

  const loadDropdownData = async () => {
    const departmentService = new DepartmentService();
    const positionService = new PositionService();
    const roleService = new RoleService();
    try {
      const [departmentsRes, positionsRes, rolesRes] = await Promise.all([
        departmentService.getAll2(),
        positionService.getAll(),
        roleService.getAll(),
      ]);
      setDepartments(departmentsRes.data || []);
      setPositions(positionsRes.data || []);
      setRoles(rolesRes.data || []);
    } catch (err) {
      console.error("Failed to load dropdowns:", err);
    }
  };

  const [initialValues, setInitialValues] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    phoneNumber: "",
    address: "",
    hireDate: "",
    salary: "",
    status: "",
    positionId: "",
    departmentId: "",
    username: "",
    password: "",
    email: "",
    roleId: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await employeeService.getById(id);
        console.log(res.data);
        const employee = res.data;

        setInitialValues({
          firstName: employee.firstName || "",
          lastName: employee.lastName || "",
          dateOfBirth: employee.dateOfBirth || "",
          phoneNumber: employee.phoneNumber || "",
          address: employee.address || "",
          hireDate: employee.hireDate || "",
          salary: employee.salary || "",
          status: employee.status || "",
          positionId: employee.positionId || "",
          departmentId: employee.departmentId || "",
          username: employee.username || "", // nếu có
          password: "", // thường để rỗng khi edit
          email: employee.email || "",
          roleId: employee.roleId || "",
        });
      } catch (error) {
        console.error("Lỗi khi lấy employee:", error);
      }
    };

    fetchData();
    loadDropdownData(); // nếu bạn cần load danh sách dropdown
  }, [id]);

  const validationSchema = Yup.object({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    dateOfBirth: Yup.date().required("Date of Birth is required"),
    phoneNumber: Yup.string().required("Phone number is required"),
    address: Yup.string().required("Address is required"),
    hireDate: Yup.date().required("Hire date is required"),
    salary: Yup.number().required("Salary is required"),
    status: Yup.string().required("Status is required"),
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
    email: Yup.string().required("Email is required"),
  });

  const formik = useFormik({
    enableReinitialize: true, // cần thiết để set lại initialValues sau khi load
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        await employeeService.updateEmployee(id, values);
        navigate("/dashboard/employees");
      } catch (err) {
        console.error("Update failed:", err);
      }
    },
  });
  return (
    <Container className="content">
      <Headline content="Edit Employee" />
      <Form onSubmit={formik.handleSubmit}>
        <Form.Group widths="equal">
          <Form.Input
            label="First Name"
            name="firstName"
            value={formik.values.firstName}
            onChange={formik.handleChange}
            error={
              formik.touched.firstName && formik.errors.firstName
                ? { content: formik.errors.firstName }
                : null
            }
          />
          <Form.Input
            label="Last Name"
            name="lastName"
            value={formik.values.lastName}
            onChange={formik.handleChange}
            error={
              formik.touched.lastName && formik.errors.lastName
                ? { content: formik.errors.lastName }
                : null
            }
          />
        </Form.Group>

        <Form.Group widths="equal">
          <Form.Input
            label="Email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={
              formik.touched.email && formik.errors.email
                ? { content: formik.errors.email }
                : null
            }
          />
          <Form.Input
            label="Phone Number"
            name="phoneNumber"
            value={formik.values.phoneNumber}
            onChange={formik.handleChange}
            error={
              formik.touched.phoneNumber && formik.errors.phoneNumber
                ? { content: formik.errors.phoneNumber }
                : null
            }
          />
        </Form.Group>

        <Form.Group widths="equal">
          <Form.Input
            type="date"
            label="Date of Birth"
            name="dateOfBirth"
            value={formik.values.dateOfBirth}
            onChange={formik.handleChange}
            error={
              formik.touched.dateOfBirth && formik.errors.dateOfBirth
                ? { content: formik.errors.dateOfBirth }
                : null
            }
          />
          <Form.Input
            type="date"
            label="Hire Date"
            name="hireDate"
            value={formik.values.hireDate}
            onChange={formik.handleChange}
            error={
              formik.touched.hireDate && formik.errors.hireDate
                ? { content: formik.errors.hireDate }
                : null
            }
          />
          <Form.Input
            type="number"
            label="Salary"
            name="salary"
            value={formik.values.salary}
            onChange={formik.handleChange}
            error={
              formik.touched.salary && formik.errors.salary
                ? { content: formik.errors.salary }
                : null
            }
          />
        </Form.Group>

        <Form.TextArea
          label="Address"
          name="address"
          value={formik.values.address}
          onChange={formik.handleChange}
          error={
            formik.touched.address && formik.errors.address
              ? { content: formik.errors.address }
              : null
          }
        />

        <Form.Group widths="equal">
          <Form.Select
            label="Department"
            name="departmentId"
            options={departments.map((d) => ({
              key: d.departmentId,
              value: d.departmentId,
              text: d.departmentName,
            }))}
            value={formik.values.departmentId}
            onChange={(e, { value }) =>
              formik.setFieldValue("departmentId", value)
            }
            error={
              formik.touched.departmentId && formik.errors.departmentId
                ? { content: formik.errors.departmentId }
                : null
            }
          />
          <Form.Select
            label="Position"
            name="positionId"
            options={positions.map((p) => ({
              key: p.positionId,
              value: p.positionId,
              text: p.positionName,
            }))}
            value={formik.values.positionId}
            onChange={(e, { value }) =>
              formik.setFieldValue("positionId", value)
            }
            error={
              formik.touched.positionId && formik.errors.positionId
                ? { content: formik.errors.positionId }
                : null
            }
          />
          <Form.Select
            label="Role"
            name="roleId"
            options={roles.map((r) => ({
              key: r.roleId,
              value: r.roleId,
              text: r.roleName,
            }))}
            value={formik.values.roleId}
            onChange={(e, { value }) => formik.setFieldValue("roleId", value)}
            error={
              formik.touched.roleId && formik.errors.roleId
                ? { content: formik.errors.roleId }
                : null
            }
          />
        </Form.Group>

        <Form.Group widths="equal">
          <Form.Input
            label="Username"
            name="username"
            value={formik.values.username}
            onChange={formik.handleChange}
            error={
              formik.touched.username && formik.errors.username
                ? { content: formik.errors.username }
                : null
            }
          />
          <Form.Input
            label="Password"
            type="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={
              formik.touched.password && formik.errors.password
                ? { content: formik.errors.password }
                : null
            }
          />
        </Form.Group>

        <Form.Select
          label="Status"
          name="status"
          options={[
            { key: 0, value: "0", text: "Active" },
            { key: 1, value: "1", text: "Inactive" },
            { key: 2, value: "2", text: "On Leave" },
            { key: 3, value: "3", text: "Probation" },
            { key: 4, value: "4", text: "Suspended" },
          ]}
          value={formik.values.status}
          onChange={(e, { value }) => formik.setFieldValue("status", value)}
          error={
            formik.touched.status && formik.errors.status
              ? { content: formik.errors.status }
              : null
          }
        />

        <Button type="submit" color="green" content="Update Employee" fluid />
      </Form>
    </Container>
  );
}
