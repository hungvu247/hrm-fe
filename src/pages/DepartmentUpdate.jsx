import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useFormik } from "formik";
import * as Yup from "yup";
import Headline from "../layouts/Headline";
import DepartmentService from "../services/departmentService";
import DateLabel from "../layouts/DateLabel";
import MessageModal from "../layouts/MessageModal";
import { Container, Grid, Label, Form, Button } from "semantic-ui-react";

export default function DepartmentUpdate() {
  const { id } = useParams();
  const [department, setDepartment] = useState({});
  const [open, setOpen] = useState(false);

  const departmentService = new DepartmentService();

  useEffect(() => {
    departmentService.getById(id).then((result) => {
      setDepartment(result.data);
      // Cập nhật giá trị form khi load xong
      formik.setValues({
        departmentId: result.data.departmentId,
        departmentName: result.data.departmentName,
        description: result.data.description || "",
      });
    });
  }, [id]);

  const validationSchema = Yup.object({
    departmentName: Yup.string().required("Department name is required"),
    description: Yup.string(),
  });

  const onSubmit = (values) => {
    departmentService.update(values).then(() => {
      handleModal(true);
    });
  };

  const formik = useFormik({
    initialValues: {
      departmentId: id,
      departmentName: "",
      description: "",
    },
    validationSchema,
    onSubmit,
    enableReinitialize: true,
  });

  const handleModal = (value) => {
    setOpen(value);
  };

  const handleChange = (fieldName, value) => {
    formik.setFieldValue(fieldName, value);
  };

  return (
    <Container className="content">
      <Headline content="Update Department" />
      <Grid>
        <Grid.Row>
          <Grid.Column width="3" />
          <Grid.Column width="10">
            <DateLabel value={new Date().toDateString()} />

            <Form onSubmit={formik.handleSubmit}>
              <Form.Input
                name="departmentName"
                label="Department Name"
                placeholder="Enter department name"
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

              <Form.TextArea
                name="description"
                label="Description"
                placeholder="Optional description..."
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
                circular
                fluid
                type="submit"
                color="blue"
                content="Update Department"
                disabled={!formik.dirty}
              />
            </Form>
          </Grid.Column>
          <Grid.Column width="3" />
        </Grid.Row>
      </Grid>

      <MessageModal
        onClose={() => handleModal(false)}
        onOpen={() => handleModal(true)}
        open={open}
        content="Department updated successfully!"
      />
    </Container>
  );
}
