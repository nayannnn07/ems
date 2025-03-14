import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend);

const PieChart = ({ present = 50, absent = 10 }) => {
  const data = {
    labels: ["Present", "Absent"],
    datasets: [
      {
        data: [present, absent],
        backgroundColor: ["#1c144c", "#ff4d6d"],
        hoverBackgroundColor: ["#342866", "#ff1e4d"],
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        labels: {
          color: "#1c144c", // Match your theme color
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false, // Ensures the lowest value is not 0
        ticks: {
          stepSize: 1, // Show 1, 2, 3... instead of 0, 5, 10...
          color: "#1c144c",
        },
      },
    },
  };

  return (
    <div className="card shadow-lg p-4 bg-white">
      <h5 className="text-center text-[#1c144c] font-semibold">Employee Attendance</h5>
      <Pie data={data} options={options} />
    </div>
  );
};

export default PieChart;
