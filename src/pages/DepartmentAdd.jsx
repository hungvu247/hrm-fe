import React, { useState } from "react";
import { useFormik } from "formik";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import DepartmentService from "../services/departmentService";
import { Container, Grid, Label, Form, Button } from "semantic-ui-react";
import Headline from "../layouts/Headline";
import MessageModal from "../layouts/MessageModal";

export default function DepartmentAdd() {
  const history = useHistory();
  const departmentService = new DepartmentService();

  const [open, setOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const initialValues = {
    departmentName: "",
    description: "",
  };

  const validationSchema = Yup.object({
    departmentName: Yup.string().required("Department Name is required"),
    description: Yup.string(),
  });

  const onSubmit = async (values) => {
    setSubmitLoading(true);
    const payload = {
      DepartmentName: values.departmentName,
      Description: values.description,
      Employees: [],
      DepartmentBudgets: [],
    };

    try {
      await departmentService.add(payload);
      setOpen(true); // mở modal sau khi thêm thành công
    } catch (error) {
      console.error("Add department failed:", error);
      alert("Failed to add department. Please try again.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  const handleModalClose = () => {
    setOpen(false);
    setTimeout(() => {
      history.push("/department");
    }, 500);
  };

  const handleCancel = () => {
    history.push("/department");
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
            <Form onSubmit={formik.handleSubmit} loading={submitLoading}>
              <Form.Input
                label="Department Name"
                name="departmentName"
                placeholder="Enter department name"
                onChange={(e, data) =>
                  handleChange("departmentName", data.value)
                }
                value={formik.values.departmentName}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.departmentName && formik.errors.departmentName
                }
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

              <Form.TextArea
                label="Description"
                name="description"
                placeholder="Optional..."
                onChange={(e, data) => handleChange("description", data.value)}
                value={formik.values.description}
                onBlur={formik.handleBlur}
                error={formik.touched.description && formik.errors.description}
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

              <div style={{ display: "flex", gap: "10px" }}>
                <Button
                  type="submit"
                  color="blue"
                  content="Add Department"
                  circular
                  fluid
                  loading={submitLoading}
                  disabled={!formik.dirty || submitLoading}
                />
                <Button
                  type="button"
                  color="grey"
                  content="Cancel"
                  circular
                  fluid
                  disabled={submitLoading}
                  onClick={handleCancel}
                />
              </div>
            </Form>
          </Grid.Column>
          <Grid.Column width="3" />
        </Grid.Row>
      </Grid>

      <MessageModal
        open={open}
        onOpen={() => setOpen(true)}
        onClose={handleModalClose}
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
