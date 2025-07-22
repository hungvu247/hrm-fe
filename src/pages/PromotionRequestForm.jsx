import React, { useState, useEffect } from "react";
import axios from "axios";

const PromotionRequestForm = () => {
  const [formData, setFormData] = useState({
    employeeId: "",
    currentPositionId: "",
    suggestedPositionId: "",
    reason: "",
    requestedBy: "",
    assignedTo: "",
  });
  const [loading, setLoading] = useState(true);
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    const employeeId = localStorage.getItem("employeeId");
    const currentPositionId = localStorage.getItem("positionId"); // Lấy currentPositionId từ localStorage
    const roleId = localStorage.getItem("roleId");
    const token = localStorage.getItem("accessToken");

    if (!token || !employeeId || !currentPositionId || !roleId) {
      alert("Bạn cần đăng nhập lại");
      return;
    }

    // Cập nhật formData
    setFormData((prev) => ({
      ...prev,
      requestedBy: employeeId,
      employeeId: employeeId,
      currentPositionId: currentPositionId, // Gán currentPositionId từ localStorage
    }));

    axios
      .get("https://localhost:7000/api/Position/get-all-position", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("Positions fetched:", res.data); // Log positions data
        setPositions(res.data); // Set positions vào state
        setLoading(false);
      })
      .catch((err) => console.error("Failed to fetch positions", err));
    setLoading(false);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("/api/promotion/request", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Request submitted!");
    } catch (error) {
      alert("Failed to submit");
    }
  };
  const currentPosition = positions.find(
    (p) => p.positionId === parseInt(formData.currentPositionId)
  );
  console.log("Current Position:", currentPosition); // Log current position for debugging
  const fieldStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    justifyContent: "space-between",
  };

  const labelStyle = {
    width: "40%",
    fontWeight: "bold",
  };

  const inputStyle = {
    width: "60%",
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        width: "500px",
        margin: "100px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        gap: "15px",
      }}
    >
      <div style={fieldStyle}>
        <label style={labelStyle}>Employee ID:</label>
        <input
          name="employeeId"
          value={formData.employeeId}
          readOnly
          style={{ ...inputStyle, backgroundColor: "#f0f0f0" }}
        />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Current Position:</label>
        <input
          name="employeeId"
          value={
            loading
              ? "Loading..."
              : currentPosition
              ? currentPosition.positionName
              : "-- Select --"
          }
          readOnly
          style={{ ...inputStyle, backgroundColor: "#f0f0f0" }}
        />
      </div>
      <div style={fieldStyle}>
        <label style={labelStyle}>Suggested Position:</label>
        <select
          name="suggestedPositionId"
          value={formData.suggestedPositionId}
          onChange={handleChange}
          required
          style={inputStyle}
        >
          <option value="">-- Select --</option>
          {positions.map((p) => (
            <option key={p.positionId} value={p.positionId}>
              {p.positionName}
            </option>
          ))}
        </select>
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Reason:</label>
        <textarea
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          placeholder="Reason"
          required
          style={{ ...inputStyle, resize: "vertical", height: "80px" }}
        />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Assign to (Approver ID):</label>
        <input
          name="assignedTo"
          value={formData.assignedTo}
          onChange={handleChange}
          placeholder="Approver ID"
          required
          style={inputStyle}
        />
      </div>

      <input type="hidden" name="requestedBy" value={formData.requestedBy} />

      <button
        type="submit"
        style={{
          padding: "12px",
          background: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontWeight: "bold",
          marginTop: "10px",
        }}
      >
        Submit Request
      </button>
    </form>
  );
};

export default PromotionRequestForm;
