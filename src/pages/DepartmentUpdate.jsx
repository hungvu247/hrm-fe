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
import DepartmentService from "../services/departmentService";
import Headline from "../layouts/Headline";
import DateLabel from "../layouts/DateLabel";
import MessageModal from "../layouts/MessageModal";

export default function DepartmentUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const departmentService = new DepartmentService();
  const [employees, setEmployees] = useState(null);
  const [initialValues, setInitialValues] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    departmentService
      .getById(id)
      .then((res) => {
        const data = res.data;
        console.log("Department data:", data);
        if (data) {
          console.log("Employee :", data.leadEmployee.employeeId);
          setInitialValues({
            departmentId: data.departmentId,
            departmentName: data.departmentName || "",
            description: data.description || "",
            leadEmployeeId: data.leadEmployee.employeeId || "", // Thêm trường LeadEmployeeId
            employees: data.employees,
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
    departmentName: Yup.string().required("Department name is required"),
    description: Yup.string(),
  });

  const onSubmit = async (values) => {
    try {
      setSubmitLoading(true);
      await departmentService.update(values);
      setOpen(true);
    } catch (error) {
      console.error("Error updating department:", error);
      alert("Error updating department. Please try again.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleModalClose = () => {
    setOpen(false);
    setTimeout(() => {
      navigate("/dashboard/departments");
    }, 500);
  };

  const handleCancel = () => {
    navigate("/dashboard/departments");
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
      <Headline content="Update Department" />
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
                    label="Department Name"
                    name="departmentName"
                    placeholder="Enter department name"
                    value={formik.values.departmentName}
                    onChange={(e, { value }) =>
                      formik.setFieldValue("departmentName", value)
                    }
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.departmentName &&
                      formik.errors.departmentName
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
                    placeholder="Optional description..."
                    value={formik.values.description}
                    onChange={(e, { value }) =>
                      formik.setFieldValue("description", value)
                    }
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.description && formik.errors.description
                    }
                  />
                  {formik.touched.description && formik.errors.description && (
                    <Label
                      basic
                      pointing
                      color="red"
                      content={formik.errors.description}
                    />
                  )}

                  {/* Display current lead employee */}
                  <div>
                    <strong>Current Lead Employee:</strong>{" "}
                    {formik.values.leadEmployeeId
                      ? formik.values.employees.find(
                          (emp) =>
                            emp.employeeId === formik.values.leadEmployeeId
                        )?.fullName
                      : "No lead assigned"}
                  </div>

                  {/* Dropdown to select new lead employee */}
                  <Form.Select
                    label="Select New Lead Employee"
                    name="leadEmployeeId"
                    options={formik.values.employees.map((emp) => ({
                      key: emp.employeeId,
                      text: emp.fullName,
                      value: emp.employeeId,
                    }))}
                    value={formik.values.leadEmployeeId}
                    onChange={(e, { value }) =>
                      formik.setFieldValue("leadEmployeeId", value)
                    }
                    error={
                      formik.touched.leadEmployeeId &&
                      formik.errors.leadEmployeeId
                    }
                  />
                  {formik.touched.leadEmployeeId &&
                    formik.errors.leadEmployeeId && (
                      <Label
                        basic
                        pointing
                        color="red"
                        content={formik.errors.leadEmployeeId}
                      />
                    )}

                  <br />

                  {/* Button Group */}
                  <div style={{ display: "flex", gap: "10px" }}>
                    <Button
                      type="submit"
                      color="blue"
                      content="Update Department"
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
        content="Department updated successfully! Redirecting..."
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
