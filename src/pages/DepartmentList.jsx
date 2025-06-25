import React, { useState, useEffect } from "react";
import DepartmentService from "../services/departmentService";
import { Card, Icon, Button, Grid, Dropdown, Input } from "semantic-ui-react";
import { useHistory } from "react-router-dom";

export default function DepartmentList() {
  const [departments, setDepartments] = useState([]);
  const [view, setView] = useState("grid"); // "list" or "grid"
  const [search, setSearch] = useState("");
  const history = useHistory();

  useEffect(() => {
    const departmentService = new DepartmentService();
    departmentService.getAll().then((res) => {
      setDepartments(res.data);
    });
  }, []);

  const goToAdd = () => {
    history.push("/department/add");
  };

  const goToEdit = (dept) => {
    history.push({
      pathname: `/department/edit/${dept.DepartmentId}`,
      state: { department: dept },
    });
  };

  const filteredDepartments = departments.filter((dept) =>
    dept.DepartmentName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      style={{ paddingTop: "80px", paddingLeft: "20px", paddingRight: "20px" }}
    >
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
            onChange={(e) => setSearch(e.target.value)}
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

      {view === "grid" ? (
        <Card.Group itemsPerRow={4}>
          {filteredDepartments.map((dept) => {
            const lead = dept.Employees.find((e) =>
              e.Position?.toLowerCase().includes("trưởng")
            );

            const totalEmployees = dept.Employees?.length || 0;
            const earnings = totalEmployees * 620; // ví dụ earnings mỗi nhân viên

            return (
              <Card key={dept.DepartmentId} raised>
                <Card.Content textAlign="center">
                  <img
                    src="https://i.pravatar.cc/100"
                    alt="avatar"
                    className="ui circular image"
                    style={{ width: 80, marginBottom: 10 }}
                  />
                  <Card.Header>{lead?.FullName || "No Lead"}</Card.Header>
                  <Card.Meta>{dept.DepartmentName}</Card.Meta>
                </Card.Content>

                <Card.Content extra>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "8px",
                    }}
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
        <table className="ui celled table">
          <thead>
            <tr>
              <th>#</th>
              <th>Department Name</th>
              <th>Lead</th>
              <th>Total Employees</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredDepartments.map((dept, index) => {
              const lead = dept.Employees.find((e) =>
                e.Position?.toLowerCase().includes("trưởng")
              );
              return (
                <tr key={dept.DepartmentId}>
                  <td>{index + 1}</td>
                  <td>{dept.DepartmentName}</td>
                  <td>{lead?.FullName || "No Lead"}</td>
                  <td>{dept.Employees.length}</td>
                  <td>
                    <Button
                      icon="edit"
                      basic
                      size="tiny"
                      onClick={() => goToEdit(dept.DepartmentId)}
                    />
                    <Button icon="trash" color="red" size="tiny" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
