import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Dùng để lấy projectId từ URL
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

// Đăng ký các phần của Chart.js
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale
);

const PerformanceStatsByProject = () => {
  const { projectId } = useParams(); // Lấy projectId từ URL
  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) {
      console.error("Không có projectId");
      return;
    }

    // Gọi API để lấy dữ liệu điểm đánh giá theo dự án
    axios
      .get(`https://localhost:7000/api/Statistics/${projectId}`)
      .then((response) => {
        setPerformanceData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
        setLoading(false);
      });
  }, [projectId]);

  const chartData = {
    labels: performanceData.map((item) => item.employeeName), // Lấy tên nhân viên
    datasets: [
      {
        label: "Điểm đánh giá",
        data: performanceData.map((item) => item.score), // Lấy điểm đánh giá của nhân viên
        borderColor: "#4bc0c0", // Màu đường biểu đồ
        backgroundColor: "rgba(75, 192, 192, 0.2)", // Màu nền của đường
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: {
        display: true,
        text: "Điểm đánh giá của nhân viên trong dự án",
        font: { size: 20 },
      },
    },
    scales: {
      x: { beginAtZero: true, grid: { display: false } },
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
        grid: { borderDash: [5, 5], color: "#ddd" },
      },
    },
  };

  return (
    <div>
      <h2>Biểu đồ điểm đánh giá của nhân viên trong dự án</h2>
      {loading ? (
        <p>Đang tải dữ liệu...</p> // Hiển thị trạng thái loading
      ) : performanceData.length === 0 ? (
        <p>Không có dữ liệu thống kê cho dự án này.</p> // Hiển thị nếu không có dữ liệu
      ) : (
        <Line data={chartData} options={options} />
      )}
    </div>
  );
};

export default PerformanceStatsByProject;
