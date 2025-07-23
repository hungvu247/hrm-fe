import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { Button, Container, Form, Checkbox } from "semantic-ui-react";
import Headline from "../../layouts/Headline";
import EmployeeService from "../../services/employeeService";
import EmployeeContactService from "../../services/employeeContactService"; // bạn cần tạo service này

export default function EmployeeContactAdd() {
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();
  const contactService = new EmployeeContactService();

  useEffect(() => {
    const employeeService = new EmployeeService();
    employeeService.getAll().then((res) => {
      console.log(res.data.data);
      setEmployees(res.data.data || []);
    });
  }, []);

  const initialValues = {
    employeeId: "",
    contactType: "",
    contactValue: "",
    isPrimary: false,
  };

  const validationSchema = Yup.object({
    employeeId: Yup.number().required("Employee is required"),
    contactType: Yup.number().required("Contact type is required"),
    contactValue: Yup.string().required("Contact value is required"),
    isPrimary: Yup.boolean(),
  });

  const handleSubmit = (values) => {
    console.log("Submitted:", values);
    contactService.addContact(values).then(() => {
      navigate("/dashboard/employee-contacts");
    });
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <Container className="content">
      <Headline content="Add Employee Contact" />
      <Form onSubmit={formik.handleSubmit}>
        <Form.Select
          label="Employee"
          name="employeeId"
          options={employees.map((e) => ({
            key: e.employeeId,
            value: e.employeeId,
            text: `${e.firstName} ${e.lastName}`,
          }))}
          value={formik.values.employeeId}
          onChange={(e, { value }) => formik.setFieldValue("employeeId", value)}
          error={
            formik.touched.employeeId && formik.errors.employeeId
              ? { content: formik.errors.employeeId }
              : null
          }
        />

        <Form.Select
          label="Contact Type"
          name="contactType"
          options={[
            { key: 0, value: 0, text: "Phone" },
            { key: 1, value: 1, text: "Email" },
            { key: 2, value: 2, text: "Zalo" },
            { key: 3, value: 3, text: "Facebook" },
            { key: 4, value: 4, text: "LinkedIn" },
            { key: 5, value: 5, text: "Other" },
          ]}
          value={formik.values.contactType}
          onChange={(e, { value }) =>
            formik.setFieldValue("contactType", value)
          }
          error={
            formik.touched.contactType && formik.errors.contactType
              ? { content: formik.errors.contactType }
              : null
          }
        />

        <Form.Input
          label="Contact Value"
          name="contactValue"
          value={formik.values.contactValue}
          onChange={formik.handleChange}
          error={
            formik.touched.contactValue && formik.errors.contactValue
              ? { content: formik.errors.contactValue }
              : null
          }
        />

        <Form.Field>
          <Checkbox
            label="Is Primary Contact?"
            name="isPrimary"
            checked={formik.values.isPrimary}
            onChange={(e, { checked }) =>
              formik.setFieldValue("isPrimary", checked)
            }
          />
        </Form.Field>

        <Button type="submit" color="blue" content="Add Contact" fluid />
      </Form>
    </Container>
  );
}
