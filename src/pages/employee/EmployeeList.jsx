import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Grid, Input, Table, Dropdown } from "semantic-ui-react";

import PaginationControl from "../../layouts/Util/PaginationControl";
import EmployeeService from "../../services/EmployeeService";
import PositionService from "../../services/positionService";
import DepartmentService from "../../services/departmentService";

export default function EmployeeList() {
  const [search, setSearch] = useState("");
  const [departmentId, setDepartmentId] = useState();
  const [positionId, setPositionId] = useState();

  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);

  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fetch departments and positions
  useEffect(() => {
    const departmentService = new DepartmentService();
    const positionService = new PositionService();

    departmentService.getAll2().then((res) => {
      const options = res.data.map((dept) => ({
        key: dept.departmentId,
        text: dept.departmentName,
        value: dept.departmentId,
      }));
      setDepartments(options);
    });

    positionService.getAll().then((res) => {
      const options = res.data.map((pos) => ({
        key: pos.positionId,
        text: pos.positionName,
        value: pos.positionId,
      }));
      setPositions(options);
    });
  }, []);

  // Fetch employees based on filter
  useEffect(() => {
    const employeeService = new EmployeeService();
    const dto = {
      keyword: search,
      departmentId: departmentId,
      positionId: positionId,
    };

    employeeService
      .getAll(currentPage, pageSize, dto)
      .then((res) => {
        setEmployees(res.data.data);
        setTotalPages(res.data.totalPages);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy danh sách nhân viên:", err);
      });
  }, [search, departmentId, positionId, currentPage, pageSize]);

  function goToEdit(employeeId) {
    navigate(`/dashboard/employees/edit/${employeeId}`);
  }

  function goToAdd() {
    navigate("add");
  }

  function goToEmployeeContactList() {
    navigate("/dashboard/employee-contacts");
  }

  return (
    <div style={{ padding: "80px 20px" }}>
      <Grid>
        <Grid.Row columns={4}>
          <Grid.Column>
            <Input
              icon="search"
              placeholder="Tìm theo tên..."
              fluid
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Grid.Column>
          <Grid.Column>
            <Dropdown
              placeholder="Phòng ban"
              fluid
              selection
              clearable
              options={departments}
              value={departmentId}
              onChange={(e, { value }) => setDepartmentId(value)}
            />
          </Grid.Column>
          <Grid.Column>
            <Dropdown
              placeholder="Vị trí"
              fluid
              selection
              clearable
              options={positions}
              value={positionId}
              onChange={(e, { value }) => setPositionId(value)}
            />
          </Grid.Column>
          <Grid.Column textAlign="right">
            <Button
              content="Thêm Nhân Viên"
              color="green"
              icon="plus"
              onClick={goToAdd}
            />
            <Button
              content="Danh sách thông tin liên lạc nhân viên"
              color="blue"
              icon="plus"
              onClick={goToEmployeeContactList}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>

      <br />

      <Table celled striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>#</Table.HeaderCell>
            <Table.HeaderCell>Họ và tên</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>Phòng ban</Table.HeaderCell>
            <Table.HeaderCell>Vị trí</Table.HeaderCell>
            <Table.HeaderCell>Hành động</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {employees.map((e, index) => (
            <Table.Row key={e.EmployeeId}>
              <Table.Cell>
                {(currentPage - 1) * pageSize + index + 1}
              </Table.Cell>
              <Table.Cell>{`${e.firstName} ${e.lastName}`}</Table.Cell>
              <Table.Cell>{e.email}</Table.Cell>
              <Table.Cell>{e.departmentName || "N/A"}</Table.Cell>
              <Table.Cell>{e.positionName || "N/A"}</Table.Cell>
              <Table.Cell>
                <Button
                  icon="edit"
                  basic
                  size="tiny"
                  onClick={() => goToEdit(e.employeeId)}
                />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <PaginationControl
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      </div>
    </div>
  );
}
