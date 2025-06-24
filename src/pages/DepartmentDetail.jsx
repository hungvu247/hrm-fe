import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import {
  Container,
  Header,
  Segment,
  List,
  Icon,
  Divider,
} from "semantic-ui-react";

export default function DepartmentDetail() {
  const { id } = useParams();
  const [department, setDepartment] = useState(null);

  useEffect(() => {
    axios.get(`https://localhost:7000/api/Department/${id}`).then((res) => {
      setDepartment(res.data);
    });
  }, [id]);

  if (!department) return <p>Loading...</p>;

  return (
    <Container className="content">
      <Segment raised color="blue">
        <Header as="h2" icon>
          <Icon name="building" />
          {department.DepartmentName}
          <Header.Subheader>{department.Description}</Header.Subheader>
        </Header>
        <Divider />
        <Header as="h3">Danh sách nhân viên</Header>
        <List divided relaxed>
          {department.Employees.map((emp) => (
            <List.Item key={emp.EmployeeId}>
              <Icon name="user circle" size="large" verticalAlign="middle" />
              <List.Content>
                <List.Header>{emp.FullName}</List.Header>
                <List.Description>{emp.Position}</List.Description>
              </List.Content>
            </List.Item>
          ))}
        </List>
      </Segment>
    </Container>
  );
}
