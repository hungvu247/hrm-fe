import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

// Đăng ký các phần của Chart.js
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const DepartmentBudgetChart = () => {
  const [departmentData, setDepartmentData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://localhost:7000/api/DepartmentBudget")
      .then((response) => {
        setDepartmentData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const chartData = {
    labels: departmentData.map((item) => item.departmentName),
    datasets: [
      {
        label: "Ngân sách đã cấp",
        data: departmentData.map((item) => item.allocatedBudget),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Ngân sách đã sử dụng",
        data: departmentData.map((item) => item.usedBudget),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  return (
    <div>
      <h2>Biểu đồ ngân sách phòng ban - Năm 2025</h2>
      <Bar data={chartData} options={{ responsive: true }} />
    </div>
  );
};

export default DepartmentBudgetChart;
