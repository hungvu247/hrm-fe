import React, { useEffect, useState } from "react";
import { Button, Input, Table } from "semantic-ui-react";
import ProjectService from "../../services/ProjectService";
import { Link } from "react-router-dom";

export default function ProjectList() {
  const projectService = new ProjectService();

  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchProjects();
  }, [search, page]);

  const fetchProjects = async () => {
    try {
      const res = await projectService.getPaged({
        search,
        page,
        pageSize,
      });

      setProjects(res.data);
    } catch (err) {
      console.error("Failed to load projects:", err);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Bạn có chắc chắn muốn xóa dự án này?");
    if (!confirm) return;

    try {
      await projectService.deleteProject(id);
      fetchProjects();
    } catch (err) {
      console.error("Xóa thất bại:", err);
      alert("Xóa không thành công!");
    }
  };

  return (
    <div>
        <br></br>
      <h2>Danh sách Project</h2>

      {/* Nút Thêm mới */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
        <Input
          icon="search"
          placeholder="Tìm kiếm project..."
          value={search}
          onChange={handleSearchChange}
          style={{ width: "300px" }}
        />
        <Button color="green" as={Link} to="/dashboard/projects/add">
          + Thêm Project
        </Button>
      </div>

      <Table celled striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Tên Dự án</Table.HeaderCell>
            <Table.HeaderCell>Mô tả</Table.HeaderCell>
            <Table.HeaderCell>Thời gian</Table.HeaderCell>
            <Table.HeaderCell>Hành động</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {projects.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan="4" textAlign="center">
                Không có dữ liệu
              </Table.Cell>
            </Table.Row>
          ) : (
            projects.map((project) => (
              <Table.Row key={project.projectId}>
                <Table.Cell>{project.projectName}</Table.Cell>
                <Table.Cell>{project.description}</Table.Cell>
                <Table.Cell>
                  {new Date(project.startDate).toLocaleDateString()} -{" "}
                  {new Date(project.endDate).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>
                  <Button
                    size="small"
                    color="blue"
                    as={Link}
                    to={`/dashboard/projects/edit/${project.projectId}`}
                  >
                    Sửa
                  </Button>
                  <Button
                    size="small"
                    color="teal"
                    as={Link}
                    to={`/dashboard/projects/detail/${project.projectId}`}
                  >
                    Chi tiết
                  </Button>
                  <Button
                    size="small"
                    color="red"
                    onClick={() => handleDelete(project.projectId)}
                  >
                    Xóa
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table>

      {/* Phân trang */}
      <div style={{ marginTop: "1rem" }}>
        <Button disabled={page <= 1} onClick={() => setPage(page - 1)}>
          Trang trước
        </Button>
        <span style={{ padding: "0 1rem" }}>Trang {page}</span>
        <Button
          disabled={projects.length < pageSize}
          onClick={() => setPage(page + 1)}
        >
          Trang sau
        </Button>
      </div>
    </div>
  );
}
