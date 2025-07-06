import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom"; // ✅ Thêm dòng này
import PositionService from "../services/positionsService";
import { Container, Grid, Label, Form, Button } from "semantic-ui-react";
import Headline from "../layouts/Headline";
import MessageModal from "../layouts/MessageModal";

export default function PositionAdd() {
  const [open, setOpen] = useState(false);
  const positionService = new PositionService();
  const navigate = useNavigate(); // ✅ Hook điều hướng

  const initialValues = {
    positionName: "",
  };

  const validationSchema = Yup.object({
    positionName: Yup.string().required("Tên vị trí là bắt buộc"),
    description: Yup.string(),
  });

  const onSubmit = (values, { resetForm }) => {
    const payload = {
      PositionName: values.positionName,
      Employees: [],
    };

    positionService
      .add(payload)
      .then(() => {
        handleModal(true);
        resetForm();
      })
      .catch((err) => {
        if (err.response?.status === 409) {
          formik.setErrors({ positionName: err.response.data.message });
        } else {
          alert("Có lỗi xảy ra. Vui lòng thử lại.");
          console.error(err);
        }
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
      navigate("/dashboard/positions");
    }, 500);
  };

  const handleChange = (fieldName, value) => {
    formik.setFieldValue(fieldName, value);
  };

  return (
    <Container className="content">
      <Headline content="Thêm vị trí" />

      <Grid>
        <Grid.Row>
          <Grid.Column width="3" />
          <Grid.Column width="10">
            <Form onSubmit={formik.handleSubmit}>
              <Form.Input
                label="Tên Vị Trí"
                name="positionName" // ✅ Đúng tên
                onChange={formik.handleChange} // ✅ Dùng chuẩn của formik
                value={formik.values.positionName}
              />

              {formik.touched.positionName && formik.errors.positionName && (
                <Label
                  basic
                  pointing
                  color="red"
                  content={formik.errors.positionName}
                />
              )}
              <br />

              <Button
                type="submit"
                fluid
                color="blue"
                circular
                content="Thêm Vị Trí"
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
        content="Thêm Vị Trí Thành Công! Redirecting..."
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
