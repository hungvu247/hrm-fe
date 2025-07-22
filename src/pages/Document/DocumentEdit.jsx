import React, { useEffect, useState } from "react";
import { Button, Form, Message } from "semantic-ui-react";
import { useParams, useNavigate } from "react-router-dom";
import DocumentService from "../../services/documentService";

export default function DocumentEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const documentService = new DocumentService();

  const [document, setDocument] = useState({
    id: "",
    documentName: "",
    filePath: "",
    uploadDate: ""
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDocument();
  }, []);

  const loadDocument = async () => {
    try {
      const res = await documentService.getById(id);
      const data = res.data;

      setDocument({
        id: data.id,
        documentName: data.documentName,
        filePath: data.filePath,
        uploadDate: data.uploadDate.slice(0, 10), // format yyyy-MM-dd
      });
      setLoading(false);
    } catch (err) {
      setError("Không thể tải dữ liệu tài liệu.");
      setLoading(false);
    }
  };

  const handleChange = (e, { name, value }) => {
    setDocument({ ...document, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      await documentService.update(document.id, {
        documentName: document.documentName,
        filePath: document.filePath
        // Không gửi uploadDate => server giữ nguyên
      });

      navigate(-1); // quay lại trang trước
    } catch (err) {
      setError("Cập nhật tài liệu thất bại!");
    }
  };

  if (loading) return <p>Đang tải...</p>;

  return (
    <div>
      <br />
      <h2>Cập nhật Tài liệu</h2>

      {error && <Message negative>{error}</Message>}

      <Form onSubmit={handleSubmit}>
        <Form.Input
          label="Tên tài liệu"
          name="documentName"
          value={document.documentName}
          onChange={handleChange}
          required
        />

        <Form.Input
          label="Đường dẫn file"
          name="filePath"
          value={document.filePath}
          onChange={handleChange}
          required
        />

        <Form.Input
          label="Ngày tải lên"
          name="uploadDate"
          value={document.uploadDate}
          readOnly
        />

        <Button type="submit" color="green">Lưu thay đổi</Button>
        <Button type="button" onClick={() => navigate(-1)}>Hủy</Button>
      </Form>
    </div>
  );
}
