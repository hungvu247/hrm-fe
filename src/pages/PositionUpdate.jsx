import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  Container,
  Grid,
  Label,
  Form,
  Button,
  Loader,
} from "semantic-ui-react";
import PositionService from "../services/positionsService";
import Headline from "../layouts/Headline";
import DateLabel from "../layouts/DateLabel";
import MessageModal from "../layouts/MessageModal";

export default function PositionUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const positionService = new PositionService();

  const [initialValues, setInitialValues] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    positionService
      .getById(id)
      .then((res) => {
        const dat = res.data;
        console.log("Position data:", dat);
        if (dat) {
          setInitialValues({
            positionId: dat.positionId,
            positionName: dat.positionName || "",
            description: dat.description || "",
          });
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching department:", error);
        setLoading(false);
      });
  }, [id]);

  const validationSchema = Yup.object({
    positionName: Yup.string().required("Tên vị trí là bắt buộc"), // ✅ đúng field
    description: Yup.string(),
  });

  const onSubmit = async (values, formikHelpers) => {
    try {
      setSubmitLoading(true);
      await positionService.update(values);
      setOpen(true);
    } catch (error) {
      console.error("Error updating position:", error);

      if (error.response?.status === 409) {
        formikHelpers.setErrors({ positionName: error.response.data.message });
      } else {
        alert("Đã xảy ra lỗi khi cập nhật. Vui lòng thử lại.");
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleModalClose = () => {
    setOpen(false);
    setTimeout(() => {
      navigate("/dashboard/positions");
    }, 500);
  };

  const handleCancel = () => {
    navigate("/dashboard/positions");
  };

  if (loading || !initialValues) {
    return (
      <div style={{ padding: 100, textAlign: "center" }}>
        <Loader active inline="centered" size="large" />
      </div>
    );
  }

  return (
    <Container className="content">
      <Headline content="Thay đổi vị trí" />
      <Grid>
        <Grid.Row>
          <Grid.Column width="3" />
          <Grid.Column width="10">
            <DateLabel value={new Date().toDateString()} />

            <Formik
              initialValues={initialValues}
              enableReinitialize={true}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              {(formik) => (
                <Form onSubmit={formik.handleSubmit} loading={submitLoading}>
                  <Form.Input
                    label="Vị Trí"
                    name="positionName"
                    placeholder="Điền tên vị trí"
                    value={formik.values.positionName}
                    onChange={(e, { value }) =>
                      formik.setFieldValue("positionName", value)
                    }
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.positionName && formik.errors.positionName
                    }
                  />
                  {formik.touched.positionName &&
                    formik.errors.positionName && (
                      <Label
                        basic
                        pointing
                        color="red"
                        content={formik.errors.positionName}
                      />
                    )}
                  <br />

                  {/* Button Group */}
                  <div style={{ display: "flex", gap: "10px" }}>
                    <Button
                      type="submit"
                      color="blue"
                      content="Thay đổi tên vị trí"
                      disabled={!formik.dirty || submitLoading}
                      loading={submitLoading}
                      style={{ flex: 1 }}
                    />
                    <Button
                      type="button"
                      color="grey"
                      content="Cancel"
                      onClick={handleCancel}
                      disabled={submitLoading}
                      style={{ flex: 1 }}
                    />
                  </div>
                </Form>
              )}
            </Formik>
          </Grid.Column>
          <Grid.Column width="3" />
        </Grid.Row>
      </Grid>

      <MessageModal
        open={open}
        onOpen={() => setOpen(true)}
        onClose={handleModalClose}
        content="Thay đổi thông tin thành công! Redirecting..."
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
