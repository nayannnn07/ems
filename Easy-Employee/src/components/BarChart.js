import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = () => {
  // Static data representing teams and the number of employees in each team
  const teams = {
    Development: 5,
    Marketing: 4,
    Sales: 2,
    Support: 1,
    HR: 3,
    
  };

  const labels = Object.keys(teams);
  const dataValues = Object.values(teams);

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Employees Per Team",
        data: dataValues,
        backgroundColor: ["#1c144c", "#ff4d6d", "#ffb74d", "#4db6ac", "#7e57c2"],
        borderColor: "#1c144c",
        borderWidth: 1,
        barPercentage: 0.9, // Adjusted for better width
        categoryPercentage: 0.8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 10,
        right: 10,
        bottom: 60,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1, // Ensure the step size is 1
          color: "#1c144c",
        },
        // Remove or adjust suggestedMax if necessary
        suggestedMax: Math.max(...dataValues) + 1,
      },
      x: {
        ticks: {
          color: "#1c144c",
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "#1c144c",
        },
      },
    },
  };

  return (
    <div className="card shadow-lg p-4 bg-white">
      <h5 className="text-center text-[#1c144c] font-semibold">Employees Per Team</h5>
      <div style={{ width: "100%", height: "500px" }}>
      <Bar data={data} options={options} height={1000} width={800} />
      </div>
    </div>
  );
};

export default BarChart;