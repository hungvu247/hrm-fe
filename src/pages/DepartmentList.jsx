import React, { useState, useEffect, useCallback } from "react";
import DepartmentService from "../services/departmentService";
import {
  Card,
  Button,
  Grid,
  Dropdown,
  Input,
  Pagination,
  Message,
  Table,
} from "semantic-ui-react";
import { useNavigate } from "react-router-dom";

export default function DepartmentList() {
  const [departments, setDepartments] = useState([]);
  const [view, setView] = useState("grid");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState("");

  const pageSize = 8;
  const navigate = useNavigate();

  const loadDepartments = useCallback(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setError("Phiên đăng nhập đã hết. Vui lòng đăng nhập lại.");
      return;
    }

    const departmentService = new DepartmentService();
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
        setError("Không thể tải dữ liệu phòng ban.");
        console.error("Lỗi API:", err);
      });
  }, [search, page]);

  useEffect(() => {
    loadDepartments();
  }, [loadDepartments]);

  const goToAdd = () => {
    navigate("/dashboard/department/add");
  };

  const goToEdit = (dept) => {
    navigate(`/dashboard/department/edit/${dept.departmentId}`, {
      state: { department: dept },
    });
  };

  const goToDetail = (id) => {
    navigate(`/dashboard/department/detail/${id}`);
  };

  return (
    <div style={{ paddingTop: "80px", padding: "0 20px" }}>
      <Grid columns={3}>
        <Grid.Column width={4}>
          <Dropdown
            placeholder="Year"
            selection
            options={[
              { key: 2023, value: 2023, text: "2023" },
              { key: 2024, value: 2024, text: "2024" },
              { key: 2025, value: 2025, text: "2025" },
            ]}
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
          <Button
            content="Thêm Department"
            color="green"
            icon="plus"
            floated="right"
            onClick={goToAdd}
            style={{ marginTop: "10px" }}
          />
        </Grid.Column>
      </Grid>

      <br />

      {error && (
        <Message negative>
          <Message.Header>Lỗi</Message.Header>
          <p>{error}</p>
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
                  <Card.Header>{lead?.fullName || "No Lead"}</Card.Header>
                  <Card.Meta>{dept.departmentName}</Card.Meta>
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
                    <Button icon="trash" color="red" size="tiny" />
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
              const lead = dept.employees?.find((e) =>
                e.position?.toLowerCase().includes("trưởng")
              );
              return (
                <Table.Row
                  key={dept.departmentId}
                  onClick={() => goToDetail(dept.departmentId)}
                  style={{ cursor: "pointer" }}
                >
                  <Table.Cell>{(page - 1) * pageSize + index + 1}</Table.Cell>
                  <Table.Cell>{dept.departmentName}</Table.Cell>
                  <Table.Cell>{lead?.fullName || "No Lead"}</Table.Cell>
                  <Table.Cell>{dept.employees?.length || 0}</Table.Cell>
                  <Table.Cell onClick={(e) => e.stopPropagation()}>
                    <Button
                      icon="edit"
                      basic
                      size="tiny"
                      onClick={() => goToEdit(dept)}
                    />
                    <Button icon="trash" color="red" size="tiny" />
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
    </div>
  );
}
