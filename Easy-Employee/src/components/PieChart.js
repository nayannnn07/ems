import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

Chart.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const PieChart = ({ present = 50, absent = 10 }) => {
  const [chartData, setChartData] = useState({
    labels: ["Present", "Absent"], // <-- No numbers here
    datasets: [
      {
        data: [0, 0],
        backgroundColor: ["#1c144c", "#ff4d6d"],
        hoverBackgroundColor: ["#342866", "#ff1e4d"],
      },
    ],
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      setChartData({
        labels: ["Present", "Absent"], // <-- Clean labels
        datasets: [
          {
            data: [present, absent],
            backgroundColor: ["#1c144c", "#ff4d6d"],
            hoverBackgroundColor: ["#342866", "#ff1e4d"],
          },
        ],
      });
    }, 300);

    return () => clearTimeout(timeout);
  }, [present, absent]);

  const options = {
    animation: {
      animateScale: true,
      animateRotate: true,
    },
    plugins: {
      legend: {
        labels: {
          color: "#1c144c",
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw;
            return `${label}: ${value}`; // Show label + value in tooltip
          }
        }
      },
      datalabels: {
        color: "#ffffff",
        formatter: (value, context) => {
          const total = context.chart.data.datasets[0].data.reduce((acc, curr) => acc + curr, 0);
          const percentage = ((value / total) * 100).toFixed(0);
          return `${percentage}%`;
        },
        font: {
          weight: "bold",
          size: 14,
          
        },
      },
    },
  };

  return (
    <div className="card shadow-lg p-4 bg-white">
      <h5 className="text-center text-[#1c144c] font-semibold">
        Employee Attendance
      </h5>
      <Pie data={chartData} options={options}/>
    </div>
  );
};

export default PieChart;
