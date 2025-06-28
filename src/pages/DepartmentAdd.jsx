import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom"; // ✅ Thêm dòng này
import DepartmentService from "../services/departmentService";
import { Container, Grid, Label, Form, Button } from "semantic-ui-react";
import Headline from "../layouts/Headline";
import MessageModal from "../layouts/MessageModal";

export default function DepartmentAdd() {
  const [open, setOpen] = useState(false);
  const departmentService = new DepartmentService();
  const navigate = useNavigate(); // ✅ Hook điều hướng

  const initialValues = {
    departmentName: "",
    description: "",
  };

  const validationSchema = Yup.object({
    departmentName: Yup.string().required("Department Name is required"),
    description: Yup.string(),
  });

  const onSubmit = (values, { resetForm }) => {
    const payload = {
      DepartmentName: values.departmentName,
      Description: values.description,
      Employees: [],
      DepartmentBudgets: [],
    };

    departmentService.add(payload).then(() => {
      handleModal(true);
      resetForm();
    });
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  const handleModal = (value) => {
    setOpen(value);
  };

  const handleModalClose = () => {
    setOpen(false);
    setTimeout(() => {
      navigate("/department"); // ✅ Chuyển hướng sau khi đóng modal
    }, 500);
  };

  const handleChange = (fieldName, value) => {
    formik.setFieldValue(fieldName, value);
  };

  return (
    <Container className="content">
      <Headline content="Add New Department" />

      <Grid>
        <Grid.Row>
          <Grid.Column width="3" />
          <Grid.Column width="10">
            <Form onSubmit={formik.handleSubmit}>
              <Form.Input
                label="Department Name"
                name="departmentName"
                onChange={(e, data) =>
                  handleChange("departmentName", data.value)
                }
                value={formik.values.departmentName}
              />
              {formik.touched.departmentName &&
                formik.errors.departmentName && (
                  <Label
                    basic
                    pointing
                    color="red"
                    content={formik.errors.departmentName}
                  />
                )}
              <br />

              <Form.TextArea
                label="Description"
                name="description"
                placeholder="Optional..."
                onChange={(e, data) => handleChange("description", data.value)}
                value={formik.values.description}
              />
              {formik.touched.description && formik.errors.description && (
                <Label
                  basic
                  pointing
                  color="red"
                  content={formik.errors.description}
                />
              )}
              <br />

              <Button
                type="submit"
                fluid
                color="blue"
                circular
                content="Add Department"
              />
            </Form>
          </Grid.Column>
          <Grid.Column width="3" />
        </Grid.Row>
      </Grid>

      <MessageModal
        open={open}
        onOpen={() => handleModal(true)}
        onClose={handleModalClose} // ✅ Đóng và redirect
        content="Department added successfully! Redirecting..."
        header="Success"
        size="small"
        actions={[
          {
            key: "ok",
            content: "OK",
            positive: true,
            onClick: handleModalClose,
          },
        ]}
      />
    </Container>
  );
}
