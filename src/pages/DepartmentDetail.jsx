import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import DepartmentService from "../services/departmentService";
import {
  Button,
  Form,
  Message,
  Container,
  Segment,
  Header,
  Modal,
  Icon,
} from "semantic-ui-react";

export default function DepartmentUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [initialValues, setInitialValues] = useState({
    departmentId: "",
    departmentName: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  useEffect(() => {
    const passedDept = location.state?.department;
    const departmentService = new DepartmentService();

    if (passedDept) {
      setInitialValues({
        departmentId: passedDept.departmentId,
        departmentName: passedDept.departmentName,
        description: passedDept.description,
      });
      setLoading(false);
    } else {
      departmentService
        .getById(id)
        .then((res) => {
          const data = res.data;
          setInitialValues({
            departmentId: data.departmentId,
            departmentName: data.departmentName,
            description: data.description,
          });
          setLoading(false);
        })
        .catch((err) => {
          console.error("Lỗi khi gọi getById:", err);
          setError("Không thể tải dữ liệu phòng ban.");
          setLoading(false);
        });
    }
  }, [id, location.state]);

  const handleChange = (e, { name, value }) => {
    setInitialValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = () => {
    const departmentService = new DepartmentService();

    departmentService
      .update(initialValues)
      .then(() => {
        setSuccessModalOpen(true);
      })
      .catch((err) => {
        console.error("Update failed:", err);
        setError("Không thể cập nhật phòng ban.");
      });
  };

  const handleCancel = () => {
    navigate("/dashboard/departments");
  };

  const handleSuccessModalClose = () => {
    setSuccessModalOpen(false);
    navigate("/dashboard/departments");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <Container style={{ paddingTop: "80px" }}>
      <Segment raised>
        <Header as="h2" color="blue" textAlign="center">
          Update Department
        </Header>

        {error && (
          <Message negative>
            <Message.Header>Lỗi</Message.Header>
            <p>{error}</p>
          </Message>
        )}

        <Form>
          <Form.Input
            label="Department Name"
            placeholder="Enter department name"
            name="departmentName"
            value={initialValues.departmentName}
            onChange={handleChange}
          />
          <Form.TextArea
            label="Description"
            placeholder="Optional description..."
            name="description"
            value={initialValues.description}
            onChange={handleChange}
          />

          <Button color="blue" onClick={handleUpdate}>
            Update Department
          </Button>
          <Button onClick={handleCancel}>Cancel</Button>
        </Form>
      </Segment>

      {/* Modal thông báo thành công */}
      <Modal
        open={successModalOpen}
        size="small"
        onClose={handleSuccessModalClose}
      >
        <Header icon="check circle outline" content="Cập nhật thành công!" />
        <Modal.Content>
          <p>Phòng ban đã được cập nhật thành công.</p>
        </Modal.Content>
        <Modal.Actions>
          <Button color="green" onClick={handleSuccessModalClose}>
            <Icon name="checkmark" /> OK
          </Button>
        </Modal.Actions>
      </Modal>
    </Container>
  );
}
