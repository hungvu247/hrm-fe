import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  ProgressBar,
  ListGroup,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import EmployeeService from "../services/employeeService";

export default function EmployeeInfo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const employeeService = new EmployeeService();

  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedValues, setUpdatedValues] = useState({});

  useEffect(() => {
    employeeService
      .getById(id)
      .then((res) => {
        const dat = res.data;
        if (dat) {
          setInitialValues({
            employeeId: dat.employeeId,
            firstName: dat.firstName || "",
            lastName: dat.lastName || "",
            email: dat.email || "",
            phone: dat.phoneNumber || "",
            dateOfBirth: dat.dateOfBirth || "",
            address: dat.address || "",
            departmentName: dat.departmentName || "",
            positionName: dat.positionName || "",
            hireDate: dat.hireDate || "",
            role: dat.roleName || "",
          });
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching employee:", error);
        setLoading(false);
      });
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const finalData = {
      ...initialValues,
      ...updatedValues,
    };

    try {
      console.log("Saving employee data:", finalData);
      await employeeService.update(id, finalData);
      setInitialValues(finalData);
      setIsEditing(false);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  if (loading || !initialValues) {
    return (
      <div className="text-center mt-5">
        <h5>Đang tải thông tin nhân viên...</h5>
      </div>
    );
  }

  return (
    <div className="bg-light py-5">
      <Container>
        <Row>
          {/* LEFT COLUMN */}
          <Col lg={4}>
            <Card className="mb-4 text-center shadow-sm">
              <Card.Body>
                <img
                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
                  alt="avatar"
                  className="rounded-circle mb-3"
                  style={{ width: "120px" }}
                />
                <h5>
                  {initialValues.firstName} {initialValues.lastName}
                </h5>
                <p className="text-muted mb-1">{initialValues.positionName}</p>
                <p className="text-muted">{initialValues.address}</p>

                <div className="d-flex justify-content-center">
                  <Button variant="primary" className="me-2">
                    Follow
                  </Button>
                  <Button variant="outline-primary">Message</Button>
                </div>
              </Card.Body>
            </Card>

            {/* Social Links */}
            <Card className="shadow-sm">
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <i className="bi bi-globe text-warning me-2"></i>{" "}
                  https://mdbootstrap.com
                </ListGroup.Item>
                <ListGroup.Item>
                  <i className="bi bi-github me-2"></i> mdbootstrap
                </ListGroup.Item>
                <ListGroup.Item>
                  <i className="bi bi-twitter text-info me-2"></i> @mdbootstrap
                </ListGroup.Item>
                <ListGroup.Item>
                  <i className="bi bi-instagram text-danger me-2"></i>{" "}
                  mdbootstrap
                </ListGroup.Item>
                <ListGroup.Item>
                  <i className="bi bi-facebook text-primary me-2"></i>{" "}
                  mdbootstrap
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>

          {/* RIGHT COLUMN */}
          <Col lg={8}>
            <Card className="mb-4 shadow-sm">
              <Card.Body>
                {/* Full Name Split */}
                <Row className="mb-3">
                  <Col sm={3}>
                    <strong>First Name</strong>
                  </Col>
                  <Col sm={9}>
                    {isEditing ? (
                      <input
                        type="text"
                        className="form-control"
                        name="firstName"
                        defaultValue={initialValues.firstName}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <span className="text-muted">
                        {initialValues.firstName}
                      </span>
                    )}
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col sm={3}>
                    <strong>Last Name</strong>
                  </Col>
                  <Col sm={9}>
                    {isEditing ? (
                      <input
                        type="text"
                        className="form-control"
                        name="lastName"
                        defaultValue={initialValues.lastName}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <span className="text-muted">
                        {initialValues.lastName}
                      </span>
                    )}
                  </Col>
                </Row>

                {/* Other fields */}
                {[
                  { label: "Email", name: "email", value: initialValues.email },
                  { label: "Phone", name: "phone", value: initialValues.phone },
                  {
                    label: "Date of Birth",
                    name: "dateOfBirth",
                    value: initialValues.dateOfBirth,
                  },
                  {
                    label: "Department",
                    name: "departmentName",
                    value: initialValues.departmentName,
                  },
                  { label: "Role", name: "role", value: initialValues.role },
                  {
                    label: "Address",
                    name: "address",
                    value: initialValues.address,
                  },
                ].map(({ label, name, value }) => (
                  <Row className="mb-3" key={name}>
                    <Col sm={3}>
                      <strong>{label}</strong>
                    </Col>
                    <Col sm={9}>
                      {isEditing ? (
                        name === "dateOfBirth" ? (
                          <input
                            type="date"
                            className="form-control"
                            name={name}
                            defaultValue={value?.substring(0, 10)}
                            onChange={handleInputChange}
                          />
                        ) : name === "role" || name === "departmentName" ? (
                          <span className="text-muted">{value}</span>
                        ) : (
                          <input
                            type="text"
                            className="form-control"
                            name={name}
                            defaultValue={value}
                            onChange={handleInputChange}
                          />
                        )
                      ) : (
                        <span className="text-muted">{value}</span>
                      )}
                    </Col>
                  </Row>
                ))}

                {/* Action buttons */}
                <div className="text-end">
                  {isEditing ? (
                    <>
                      <Button
                        variant="success"
                        className="me-2"
                        onClick={handleSave}
                      >
                        Save
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="primary"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit
                    </Button>
                  )}
                </div>
              </Card.Body>
            </Card>

            {/* Project Status */}
            <Row>
              <Col md={12}>
                <Card className="mb-4 shadow-sm">
                  <Card.Body>
                    <h6 className="text-primary mb-3">
                      Assignment Project Status
                    </h6>
                    {[
                      ["Web Design", 80],
                      ["Website Markup", 72],
                      ["One Page", 89],
                      ["Mobile Template", 55],
                      ["Backend API", 66],
                    ].map(([title, val]) => (
                      <div key={title} className="mb-3">
                        <small>{title}</small>
                        <ProgressBar now={val} label={`${val}%`} />
                      </div>
                    ))}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
