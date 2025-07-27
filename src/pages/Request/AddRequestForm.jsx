import React, { useState, useEffect } from "react";
import RequestService from "../../services/RequestService";

const CreateRequestForm = () => {
  const [form, setForm] = useState({
    title: "",
    content: "",
    requestTypeId: "",
  });

  const [requestTypes, setRequestTypes] = useState([]);

  useEffect(() => {
    fetchRequestTypes();
  }, []);

  const fetchRequestTypes = async () => {
    try {
      const response = await RequestService.getAllRequestTypes();
      setRequestTypes(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy loại đơn:", error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await RequestService.createRequestForm(form);
      alert("Gửi đơn thành công!");
      setForm({ title: "", content: "", requestTypeId: "" });
    } catch (error) {
      console.error("Lỗi khi gửi đơn:", error.response?.data || error.message);
      alert("Gửi đơn thất bại!");
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="card p-4 shadow">
        <h2 className="mb-4 text-center">Gửi đơn yêu cầu</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Tiêu đề:</label>
            <input
              type="text"
              name="title"
              className="form-control"
              value={form.title}
              onChange={handleChange}
              placeholder="Nhập tiêu đề"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Nội dung:</label>
            <textarea
              name="content"
              className="form-control"
              rows="5"
              value={form.content}
              onChange={handleChange}
              placeholder="Nhập nội dung đơn"
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Loại đơn:</label>
            <select
              name="requestTypeId"
              className="form-select"
              value={form.requestTypeId}
              onChange={handleChange}
              required
            >
              <option value="">-- Chọn loại đơn --</option>
              {requestTypes.map((type) => (
                <option key={type.requestTypeId} value={type.requestTypeId}>
                  {type.requestTypeName}
                </option>
              ))}
            </select>
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Gửi đơn
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRequestForm;
