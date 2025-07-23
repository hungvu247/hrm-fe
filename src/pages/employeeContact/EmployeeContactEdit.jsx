import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Container, Form, Checkbox } from "semantic-ui-react";
import Headline from "../../layouts/Headline";
import EmployeeService from "../../services/employeeService";
import EmployeeContactService from "../../services/employeeContactService";

// ✅ Khai báo kiểu dữ liệu cho form
const defaultValues = {
  employeeId: "",
  contactType: "",
  contactValue: "",
  isPrimary: false,
};
const contactTypeMap = {
  Phone: 0,
  Email: 1,
  Zalo: 2,
  Facebook: 3,
  LinkedIn: 4,
  Other: 5,
};

const contactTypeReverseMap = {
  0: "Phone",
  1: "Email",
  2: "Zalo",
  3: "Facebook",
  4: "LinkedIn",
  5: "Other",
};

export default function EmployeeContactEdit() {
  const [employees, setEmployees] = useState([]);
  const [initialValues, setInitialValues] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const contactService = new EmployeeContactService();

  // ✅ Load dữ liệu
  useEffect(() => {
    const employeeService = new EmployeeService();

    employeeService.getAll().then((res) => {
      if (Array.isArray(res.data.data)) {
        setEmployees(res.data.data);
      }
    });

    contactService
      .getById(id)
      .then((res) => {
        const data = res?.data;
        if (data && data.EmployeeId !== undefined) {
          setInitialValues({
            employeeId: data.EmployeeId,
            contactType: contactTypeMap[data.ContactType],
            contactValue: data.ContactValue,
            isPrimary: data.IsPrimary,
          });
        } else {
          console.warn("Không tìm thấy dữ liệu contact với id =", id);
          navigate("/dashboard/employee-contacts");
        }
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu contact:", error);
        navigate("/dashboard/employee-contacts");
      });
  }, [id]);

  // ✅ Schema kiểm tra
  const validationSchema = Yup.object({
    employeeId: Yup.number().required("Employee is required"),
    contactType: Yup.number().required("Contact type is required"),
    contactValue: Yup.string().required("Contact value is required"),
    isPrimary: Yup.boolean(),
  });

  // ✅ Xử lý submit
  const handleSubmit = (values) => {
    const payload = {
      contactType: values.contactType,
      contactValue: values.contactValue,
      isPrimary: values.isPrimary,
    };

    contactService.updateContact(id, payload).then(() => {
      navigate("/dashboard/employee-contacts");
    });
  };

  // ✅ Hook useFormik: luôn được gọi, kể cả khi chưa có data
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues || defaultValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  // ✅ Nếu chưa load xong, hiển thị loading
  if (!initialValues) return <div>Loading...</div>;

  return (
    <Container className="content">
      <Headline content="Edit Employee Contact" />
      <Form onSubmit={formik.handleSubmit}>
        <Form.Select
          label="Employee"
          name="employeeId"
          options={employees.map((e) => ({
            key: e.EmployeeId,
            value: e.EmployeeId,
            text: `${e.FirstName} ${e.LastName}`,
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

        <Button type="submit" color="green" content="Update Contact" fluid />
      </Form>
    </Container>
  );
}
