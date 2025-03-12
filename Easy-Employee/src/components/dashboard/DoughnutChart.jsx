import React, { useEffect, useRef } from "react";
import "../../assets/css/style.css"; // Import CSS for styling

const DoughnutChart = ({ present, absent, late }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const total = present + absent + late;
    const data = [
      { value: present, color: "#4CAF50" }, // Green
      { value: absent, color: "#F44336" }, // Red
      { value: late, color: "#FF9800" }, // Orange
    ];

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let startAngle = -Math.PI / 2; // Start at top
    const radius = canvas.width / 2;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Draw segments
    data.forEach(({ value, color }) => {
      const sliceAngle = (value / total) * (Math.PI * 2);
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
      startAngle += sliceAngle;
    });

    // Draw white circle to create the "doughnut" effect
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.6, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
  }, [present, absent, late]);

  return (
    <div className="chart-container">
      <h3>Attendance Overview</h3>
      <canvas ref={canvasRef} width="200" height="200"></canvas>
      <div className="legend">
        <span style={{ backgroundColor: "#4CAF50" }}></span> Present
        <span style={{ backgroundColor: "#F44336" }}></span> Absent
        <span style={{ backgroundColor: "#FF9800" }}></span> Late
      </div>
    </div>
  );
};

export default DoughnutChart;
