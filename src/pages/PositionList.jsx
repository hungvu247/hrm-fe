import React, { useState, useEffect, useCallback } from "react";
import PositionService from "../services/positionsService";
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

export default function DepartmentList() {
  const [positions, setPositions] = useState([]);
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
  const positionService = new PositionService();

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

  const loadPositions = useCallback(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setError("Phiên đăng nhập đã hết. Vui lòng đăng nhập lại.");
      return;
    }

    const skip = (page - 1) * pageSize;

    positionService
      .getPaged({ search, skip, top: pageSize, orderBy: "DepartmentName" })
      .then((res) => {
        const data = res.data;

        const mappedPositions = (data.items || []).map((d) => ({
          positionId: d.positionId,
          positionName: d.positionName,
          employees: (d.employees || []).map((e) => ({
            employeeId: e.employeeId,
            fullName: e.fullName,
            position: e.position,
          })),
        }));

        setPositions(mappedPositions);
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
    loadPositions();
  }, [loadPositions]);

  const goToAdd = () => navigate("/dashboard/position/add");

  const goToEdit = (dept) =>
    navigate(`/dashboard/position/edit/${dept.positionId}`, {
      state: { department: dept },
    });

  const goToDetail = (id) => navigate(`/dashboard/position/detail/${id}`);

  const handleDeactivate = () => {
    if (!selectedDept) return;

    const token = localStorage.getItem("accessToken");

    axios
      .patch(
        `https://localhost:7000/api/Department/${selectedDept.positionId}`,
        { status: "Inactive" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then(() => {
        setSuccess("✅ Xóa vị trí thành công.");
        setConfirmOpen(false);
        setSelectedDept(null);
        loadPositions();
      })
      .catch((error) => {
        console.error("Lỗi dừng hoạt động phòng ban:", error.response);
        setError("Không thể dừng hoạt động phòng ban. Vui lòng thử lại.");
        setConfirmOpen(false);
      });
  };

  return (
    <div style={{ paddingTop: "80px", padding: "0 20px" }}>
      <Grid columns={3}>
        <Grid.Column width={4}>
          {" "}
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
          {positions.map((dept) => {
            const lead = dept.employees?.find((e) =>
              e.position?.toLowerCase().includes("trưởng")
            );
            const totalEmployees = dept.employees?.length || 0;

            return (
              <Card
                key={dept.positionId}
                raised
                onClick={() => goToDetail(dept.positionId)}
                style={{ cursor: "pointer" }}
              >
                <Card.Content textAlign="center">
                  <img
                    src="https://i.pravatar.cc/100"
                    alt="avatar"
                    className="ui circular image"
                    style={{ width: 80, marginBottom: 10 }}
                  />
                  <Card.Meta>{dept.positionName}</Card.Meta>
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
              <Table.HeaderCell>Total Employees</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {positions.map((dept, index) => {
              const lead = dept.employees?.find((e) =>
                e.position?.toLowerCase().includes("trưởng")
              );
              return (
                <Table.Row
                  key={dept.positionId}
                  onClick={() => goToDetail(dept.positionId)}
                  style={{ cursor: "pointer" }}
                >
                  <Table.Cell>{(page - 1) * pageSize + index + 1}</Table.Cell>
                  <Table.Cell>{dept.positionName}</Table.Cell>
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
            Bạn có thực sự muốn xóa vị trí{" "}
            <strong>{selectedDept?.positionName}</strong> không?
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
