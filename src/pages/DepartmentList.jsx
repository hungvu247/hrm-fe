import React, { useState, useEffect, useCallback } from "react";
import DepartmentService from "../services/departmentService";
import {
  Card,
  Button,
  Grid,
  Input,
  Pagination,
  Message,
  Table,
  Modal,
  Icon,
} from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Headline from "../layouts/Headline";
export default function DepartmentList() {
  const [departments, setDepartments] = useState([]);
  const [view, setView] = useState("grid");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState(null);

  const pageSize = 8;
  const navigate = useNavigate();
  const departmentService = new DepartmentService();

  // Tự động ẩn message sau 4s
  useEffect(() => {
    if (error || success) {
      const timeout = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 4000);
      return () => clearTimeout(timeout);
    }
  }, [error, success]);

  const loadDepartments = useCallback(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setError("Phiên đăng nhập đã hết. Vui lòng đăng nhập lại.");
      return;
    }

    const skip = (page - 1) * pageSize;

    departmentService
      .getPaged({ search, skip, top: pageSize, orderBy: "DepartmentName" })
      .then((res) => {
        const data = res.data;

        const mappedDepartments = (data.items || []).map((d) => ({
          departmentId: d.departmentId,
          departmentName: d.departmentName,
          description: d.description,
          employees: (d.employees || []).map((e) => ({
            employeeId: e.employeeId,
            fullName: e.fullName,
            position: e.position,
          })),
        }));

        setDepartments(mappedDepartments);
        setTotalCount(data.totalCount || 0);
        setError("");
      })
      .catch((err) => {
        if (err.response?.status === 403) {
          setError("🚫 Bạn không có quyền truy cập danh sách phòng ban.");
          navigate("/dashboard/forbidden");
        } else if (err.response?.status === 401) {
          setError("⚠️ Phiên đăng nhập đã hết. Vui lòng đăng nhập lại.");
          // navigate("/login");
        } else {
          setError("Không thể tải dữ liệu phòng ban. Vui lòng thử lại sau.");
          navigate("/dashboard/forbidden");
        }

        console.error("Lỗi API:", err);
      });
  }, [search, page]);

  useEffect(() => {
    loadDepartments();
  }, [loadDepartments]);

  const goToAdd = () => navigate("/dashboard/department/add");

  const goToEdit = (dept) =>
    navigate(`/dashboard/department/edit/${dept.departmentId}`, {
      state: { department: dept },
    });

  const goToDetail = (id) => navigate(`/dashboard/department/detail/${id}`);

  const handleDeactivate = () => {
    if (!selectedDept) return;

    const token = localStorage.getItem("accessToken");

    axios
      .patch(
        `https://localhost:7000/api/Department/${selectedDept.departmentId}`,
        { status: "Inactive" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then(() => {
        setSuccess("✅ Phòng ban đã được dừng hoạt động thành công.");
        setConfirmOpen(false);
        setSelectedDept(null);
        loadDepartments();
      })
      .catch((error) => {
        console.error("Lỗi dừng hoạt động phòng ban:", error.response);
        setError("Không thể dừng hoạt động phòng ban. Vui lòng thử lại.");
        setConfirmOpen(false);
      });
  };

  return (
    <div style={{ paddingTop: "80px", padding: "0 20px" }}>
      <Headline content="Danh sách các phòng ban" />
      <Grid columns={3}>
        <Grid.Column width={4}>
          <Button
            content="Thêm Vị Trí"
            color="green"
            icon="plus"
            floated="right"
            onClick={goToAdd}
          />
        </Grid.Column>
        <Grid.Column width={8}>
          <Input
            icon="search"
            placeholder="Search..."
            fluid
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </Grid.Column>
        <Grid.Column width={4} textAlign="right">
          <Button.Group>
            <Button
              toggle
              active={view === "list"}
              onClick={() => setView("list")}
            >
              List View
            </Button>
            <Button
              toggle
              active={view === "grid"}
              onClick={() => setView("grid")}
            >
              Grid View
            </Button>
          </Button.Group>
        </Grid.Column>
      </Grid>

      <br />

      {error && (
        <Message negative>
          <Message.Header>Lỗi</Message.Header>
          <p>{error}</p>
        </Message>
      )}
      {success && (
        <Message positive>
          <Message.Header>Thành công</Message.Header>
          <p>{success}</p>
        </Message>
      )}

      {view === "grid" ? (
        <Card.Group itemsPerRow={4}>
          {departments.map((dept) => {
            const lead = dept.employees?.find((e) =>
              e.position?.toLowerCase().includes("trưởng")
            );
            const totalEmployees = dept.employees?.length || 0;
            const earnings = totalEmployees * 620;

            return (
              <Card
                key={dept.departmentId}
                raised
                onClick={() => goToDetail(dept.departmentId)}
                style={{ cursor: "pointer" }}
              >
                <Card.Content textAlign="center">
                  <img
                    src="https://i.pravatar.cc/100"
                    alt="avatar"
                    className="ui circular image"
                    style={{ width: 80, marginBottom: 10 }}
                  />
                  <Card.Header>{dept.departmentName}</Card.Header>
                  <Card.Meta>{lead?.fullName || "No Lead"}</Card.Meta>
                </Card.Content>

                <Card.Content extra>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "8px",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button icon="edit" onClick={() => goToEdit(dept)} />
                    <Button
                      icon="trash"
                      color="red"
                      size="tiny"
                      onClick={() => {
                        setSelectedDept(dept);
                        setConfirmOpen(true);
                      }}
                    />
                  </div>
                </Card.Content>

                <Card.Content extra textAlign="center">
                  <div>
                    <strong>{totalEmployees}</strong> Employee
                  </div>
                  <div>
                    <strong>${earnings.toLocaleString()}</strong> Earnings
                  </div>
                </Card.Content>
              </Card>
            );
          })}
        </Card.Group>
      ) : (
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>#</Table.HeaderCell>
              <Table.HeaderCell>Department Name</Table.HeaderCell>
              <Table.HeaderCell>Lead</Table.HeaderCell>
              <Table.HeaderCell>Total Employees</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {departments.map((dept, index) => {
              return (
                <Table.Row
                  key={dept.departmentId}
                  onClick={() => goToDetail(dept.departmentId)}
                  style={{ cursor: "pointer" }}
                >
                  <Table.Cell>{(page - 1) * pageSize + index + 1}</Table.Cell>
                  <Table.Cell>
                    <strong style={{ color: "#007bff", fontSize: "1.1em" }}>
                      {" "}
                      {dept.leadEmployee.fullName || "No Lead"}
                    </strong>
                  </Table.Cell>
                  <Table.Cell>{dept.departmentName}</Table.Cell>
                  <Table.Cell>{dept.employees?.length || 0}</Table.Cell>
                  <Table.Cell onClick={(e) => e.stopPropagation()}>
                    <Button
                      icon="edit"
                      basic
                      size="tiny"
                      onClick={() => goToEdit(dept)}
                    />
                    <Button
                      icon="trash"
                      color="red"
                      size="tiny"
                      onClick={() => {
                        setSelectedDept(dept);
                        setConfirmOpen(true);
                      }}
                    />
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      )}

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Pagination
          activePage={page}
          onPageChange={(e, { activePage }) => setPage(activePage)}
          totalPages={Math.ceil(totalCount / pageSize)}
          siblingRange={1}
        />
      </div>

      <Modal
        size="tiny"
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
      >
        <Modal.Header>
          <Icon name="exclamation triangle" color="red" />
          Xác nhận dừng hoạt động
        </Modal.Header>
        <Modal.Content>
          <p style={{ fontSize: "16px" }}>
            Bạn có thực sự muốn dừng hoạt động phòng ban{" "}
            <strong>{selectedDept?.departmentName}</strong> không?
          </p>
        </Modal.Content>
        <Modal.Actions>
          <Button color="grey" onClick={() => setConfirmOpen(false)}>
            <Icon name="remove" /> Huỷ
          </Button>
          <Button color="red" onClick={handleDeactivate}>
            <Icon name="checkmark" /> Xác nhận
          </Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
}
