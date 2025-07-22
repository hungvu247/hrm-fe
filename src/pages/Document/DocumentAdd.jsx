import React, { useState } from "react";
import { Form, Button, Message } from "semantic-ui-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DocumentService from "../../services/documentService";

export default function DocumentAdd() {
  const [searchParams] = useSearchParams();
  const projectId = parseInt(searchParams.get("projectId") || "0"); // Lấy projectId từ URL

  const [documentName, setDocumentName] = useState("");
  const [filePath, setFilePath] = useState("");
  const [uploadDate, setUploadDate] = useState(new Date().toISOString().split("T")[0]);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError("");
    setSuccess(false);

    if (!documentName || !filePath || !uploadDate || !projectId) {
      setError("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    const data = {
      projectId,
      documentName,
      filePath,
      uploadDate
    };

    try {
      await new DocumentService().create(data);
      setSuccess(true);
      setTimeout(() => navigate(`/dashboard/projects/detail/${projectId}`), 1500);
    } catch (err) {
      console.error(err);
      setError("Thêm tài liệu thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div>
      <br></br>
      <h2>Thêm Tài liệu cho Dự án </h2>

      <Form onSubmit={handleSubmit}>
        <Form.Input
          label="Tên tài liệu"
          placeholder="VD: Báo cáo tiến độ"
          value={documentName}
          onChange={(e) => setDocumentName(e.target.value)}
        />

        <Form.Input
          label="Đường dẫn file"
          placeholder="VD: /uploads/baocao.pdf"
          value={filePath}
          onChange={(e) => setFilePath(e.target.value)}
        />

        <Form.Input
          label="Ngày tải lên"
          type="date"
          value={uploadDate}
          onChange={(e) => setUploadDate(e.target.value)}
        />

        {error && <Message negative content={error} />}
        {success && <Message positive content="Thêm tài liệu thành công!" />}

        <Button primary type="submit">Thêm</Button>
        <Button type="button" color="grey" onClick={() => navigate(-1)}>Hủy</Button>
      </Form>
    </div>
  );
}
