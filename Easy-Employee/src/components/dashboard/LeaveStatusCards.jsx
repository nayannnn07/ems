import React from "react";

const LeaveStatusCards = ({ applied, approved, rejected }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "20px",
        marginTop: "20px",
      }}
    >
      {/* Applied Leave Card */}
      <div style={cardStyle("orange")}>
        <h3>Applied Leave</h3>
        <p style={countStyle}>{applied}</p>
      </div>

      {/* Approved Leave Card */}
      <div style={cardStyle("green")}>
        <h3>Approved Leave</h3>
        <p style={countStyle}>{approved}</p>
      </div>

      {/* Rejected Leave Card */}
      <div style={cardStyle("red")}>
        <h3>Rejected Leave</h3>
        <p style={countStyle}>{rejected}</p>
      </div>
    </div>
  );
};

// Card Styling Function
const cardStyle = (color) => ({
  backgroundColor: color,
  color: "#fff",
  padding: "20px",
  borderRadius: "10px",
  width: "200px",
  textAlign: "center",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
});

// Number Styling
const countStyle = {
  fontSize: "30px",
  fontWeight: "bold",
  marginTop: "10px",
};

export default LeaveStatusCards;
