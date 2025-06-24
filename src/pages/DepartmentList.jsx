import React, { useState, useEffect } from "react";
import DepartmentService from "../services/departmentService";
import { Card, Icon, Button } from "semantic-ui-react";
import { useHistory } from "react-router-dom";

export default function DepartmentList() {
  const [departments, setDepartments] = useState([]);
  const history = useHistory(); // dùng để điều hướng

  useEffect(() => {
    const departmentService = new DepartmentService();
    departmentService.getAll().then((res) => {
      setDepartments(res.data);
    });
  }, []);

  const goToDetail = (id) => {
    history.push(`/departments/${id}`);
  };

  const goToAdd = () => {
    history.push("/department/add");
  };

  return (
    <div>
      <Button
        content="Thêm Department"
        color="green"
        icon="plus"
        floated="right"
        onClick={goToAdd}
      />
      <br />
      <br />

      <Card.Group itemsPerRow={3}>
        {departments.map((dept) => (
          <Card
            key={dept.DepartmentId}
            raised
            onClick={() => goToDetail(dept.DepartmentId)}
            style={{ cursor: "pointer" }}
          >
            <Card.Content>
              <Card.Header>{dept.DepartmentName}</Card.Header>
              <Card.Description>
                {dept.Description || "Không có mô tả"}
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              <Icon name="building" />
              ID: {dept.DepartmentId}
            </Card.Content>
          </Card>
        ))}
      </Card.Group>
    </div>
  );
}
