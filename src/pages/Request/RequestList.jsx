import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RequestService from "../../services/RequestService";

const RequestList = () => {
  const [requests, setRequests] = useState([]);
  const [role, setRole] = useState({ roleName: "", roleId: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
    fetchRole();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await RequestService.getByEmployee();
      setRequests(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách request:", error);
    }
  };

  const fetchRole = async () => {
    try {
      const response = await RequestService.getRoleUser();
      setRole(response.data); // { roleId: ..., roleName: ... }
    } catch (error) {
      console.error("Lỗi khi lấy role:", error);
    }
  };

  const handleWriteRequest = () => {
    navigate("add");
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await RequestService.updateStatus(id, { status });
      await fetchRequests(); // Refresh danh sách
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
    }
  };

  const canReview = [2, 3, 6].includes(role.roleId); // ✅ Kiểm tra quyền duyệt

  return (
    <div className="container mt-4">
      <br />
      <div className="d-flex justify-content-between align-items-center">
        <h2>Danh sách Request Form</h2>
        <button className="btn btn-primary" onClick={handleWriteRequest}>
          Viết Đơn
        </button>
      </div>

      <p>
        <strong>Vai trò:</strong> {role.roleName}
      </p>

      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>Tiêu đề</th>
            <th>Nội dung</th>
            <th>Trạng thái</th>
            <th>Ngày tạo</th>
            <th>Nhân viên</th>
            <th>Loại đơn</th>
            <th>Người duyệt</th>
            <th>Ngày duyệt</th>
            <th>Nhận xét</th>
            {canReview && <th>Chức năng</th>}
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.requestId}>
              <td>{request.title}</td>
              <td>{request.content}</td>
              <td>{request.status}</td>
              <td>{new Date(request.createdAt).toLocaleDateString()}</td>
              <td>{request.employeeName}</td>
              <td>{request.requestTypeName}</td>
              <td>{request.reviewedByName}</td>
              <td>
                {request.reviewedAt
                  ? new Date(request.reviewedAt).toLocaleDateString()
                  : ""}
              </td>
              <td>{request.reviewComment}</td>
              {canReview && (
                <td>
                  {request.status === "Pending" ? (
                    <>
                      <button
                        className="btn btn-success btn-sm me-1"
                        onClick={() => handleUpdateStatus(request.requestId, "Approved")}
                      >
                        Duyệt
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleUpdateStatus(request.requestId, "Rejected")}
                      >
                        Từ chối
                      </button>
                    </>
                  ) : (
                    <span>Đã {request.status}</span>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RequestList;
