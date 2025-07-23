import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Table, Button, Message, Icon } from "semantic-ui-react";
import ProjectService from "../../services/ProjectService";
import DocumentService from "../../services/documentService";
import ReviewService from "../../services/reviewService";
import EmployeeService from "../../services/employeeService";

export default function ProjectDetail() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [projectName, setProjectName] = useState("");
  const [documents, setDocuments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");
  const [employeeMap, setEmployeeMap] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectService = new ProjectService();
        const reviewService = new ReviewService();
        const employeeService = new EmployeeService();

        const projectRes = await projectService.getById(projectId);
        setProjectName(projectRes.data.projectName);

        const docRes = await projectService.getDocumentsByProjectId(projectId);
        setDocuments(docRes.data);

        const reviewRes = await reviewService.getByProjectId(projectId);
        setReviews(reviewRes.data);

        // Lấy tên nhân viên từ API
        const employeeIds = [
          ...new Set(reviewRes.data.map((r) => r.employeeId)),
        ];
        const map = {};

        await Promise.all(
          employeeIds.map(async (id) => {
            try {
              const res = await employeeService.getById(id);
              map[id] =
                res.data.fullName || res.data.name || `Nhân viên #${id}`;
            } catch {
              map[id] = `Nhân viên #${id}`;
            }
          })
        );

        setEmployeeMap(map);
      } catch (err) {
        setError("Không thể tải dữ liệu dự án, tài liệu hoặc đánh giá.");
        console.error(err);
      }
    };

    fetchData();
  }, [projectId]);

  const handleEdit = (documentId) => {
    navigate(`/dashboard/document/edit/${documentId}`);
  };

  const handleDelete = async (documentId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tài liệu này?")) {
      try {
        await new DocumentService().delete(documentId);
        setDocuments((prev) => prev.filter((d) => d.documentId !== documentId));
      } catch (error) {
        alert("Xóa tài liệu thất bại.");
        console.error(error);
      }
    }
  };

  const handleAdd = () => {
    navigate(`/dashboard/document/add?projectId=${projectId}`);
  };

  return (
    <div>
      <br />
      <h2>
        Chi tiết Dự án: <span style={{ color: "teal" }}>{projectName}</span>
      </h2>

      <div
        style={{
          marginBottom: "1rem",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button as={Link} to="/dashboard/projects" color="grey" size="small">
          ← Quay lại danh sách
        </Button>
        <Button color="green" onClick={handleAdd}>
          + Thêm Tài liệu
        </Button>
      </div>

      {error && <Message error content={error} />}

      {/* Danh sách Tài liệu */}
      {documents.length === 0 ? (
        <Message warning content="Không có tài liệu nào cho dự án này." />
      ) : (
        <Table celled striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Tên Tài liệu</Table.HeaderCell>
              <Table.HeaderCell>Đường dẫn File</Table.HeaderCell>
              <Table.HeaderCell>Ngày tải lên</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">Thao tác</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {documents.map((doc) => (
              <Table.Row key={doc.documentId}>
                <Table.Cell>{doc.documentName}</Table.Cell>
                <Table.Cell>
                  <a
                    href={doc.filePath}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {doc.filePath}
                  </a>
                </Table.Cell>
                <Table.Cell>
                  {new Date(doc.uploadDate).toLocaleDateString("vi-VN")}
                </Table.Cell>
                <Table.Cell textAlign="center">
                  <Button
                    icon
                    size="mini"
                    color="blue"
                    title="Sửa"
                    onClick={() => handleEdit(doc.documentId)}
                  >
                    <Icon name="edit" />
                  </Button>
                  <Button
                    icon
                    size="mini"
                    color="red"
                    title="Xóa"
                    onClick={() => handleDelete(doc.documentId)}
                  >
                    <Icon name="trash" />
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}

      {/* Danh sách Đánh giá */}
      <h3 style={{ marginTop: "2rem" }}>Đánh giá</h3>
      {reviews.length === 0 ? (
        <Message
          warning
          content="Chưa có đánh giá hiệu suất nào cho dự án này."
        />
      ) : (
        <Table celled striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Nhân viên</Table.HeaderCell>
              <Table.HeaderCell>Ngày đánh giá</Table.HeaderCell>
              <Table.HeaderCell>Nhận xét</Table.HeaderCell>
              <Table.HeaderCell>Điểm</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {reviews.map((r) => (
              <Table.Row key={r.reviewId}>
                <Table.Cell>
                  {employeeMap[r.employeeId] || `Nhân viên #${r.employeeId}`}
                </Table.Cell>
                <Table.Cell>
                  {new Date(r.reviewDate).toLocaleDateString("vi-VN")}
                </Table.Cell>
                <Table.Cell>{r.comments}</Table.Cell>
                <Table.Cell>
                  {[...Array(5)].map((_, i) => (
                    <Icon
                      key={i}
                      name={i < Math.round(r.score) ? "star" : "star outline"}
                      color={i < Math.round(r.score) ? "yellow" : "grey"}
                    />
                  ))}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </div>
  );
}
