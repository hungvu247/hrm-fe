import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DepartmentChart = () => {
  const [chartData, setChartData] = useState(null);
  useEffect(() => {
    axios
      .get("https://localhost:7000/api/Statistics/employee-by-department")
      .then((response) => {
        const departments = response.data;

        const labels = departments.map((dep) => dep.departmentName);
        const data = departments.map((dep) => dep.employeeCount);

        setChartData({
          labels,
          datasets: [
            {
              label: "Số lượng nhân viên",
              data,
              backgroundColor: [
                "#4bc0c0",
                "#36a2eb",
                "#9966ff",
                "#ffcd56",
                "#ff6384",
              ],
              borderRadius: 10,
              borderSkipped: false, // bo viền trên
              hoverBackgroundColor: "#2c3e50",
            },
          ],
        });
      })
      .catch((err) => console.error("Lỗi khi gọi API:", err));
  }, []);
  console.log("Chart data:", chartData);
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "📊 Biểu đồ số lượng nhân viên theo phòng ban",
        font: {
          size: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => `👤 Số lượng nhân viên: ${context.raw}`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#333",
          font: {
            size: 14,
            weight: "bold",
          },
        },
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: "#444",
          font: {
            size: 14,
          },
        },
        grid: {
          borderDash: [5, 5],
          color: "#ddd",
        },
      },
    },
    animation: {
      duration: 1500,
      easing: "easeOutBounce",
    },
  };

  return (
    <div style={{ width: "90%", margin: "0 auto", paddingTop: "20px" }}>
      {chartData ? (
        <Bar data={chartData} options={options} />
      ) : (
        <p>⏳ Đang tải dữ liệu...</p>
      )}
    </div>
  );
};

export default DepartmentChart;
