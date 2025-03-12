import React from "react";
import { useSelector } from "react-redux";
import CountsCard from "./CountsCard";

const Employee = () => {
  const { user } = useSelector((state) => state.authSlice);

  // Static Team Data
  const team = [
    { name: "David", role: "Software Engineer" },
    { name: "Eve", role: "Project Manager" },
    { name: "Frank", role: "QA Analyst" },
  ];

  return (
    <div className="container mt-3">
      <section className="section">
        {/* Welcome Message */}
        <div className="card">
          <div className="card-header d-flex justify-content-between">
            <h4>Welcome {user?.name}</h4>
          </div>
        </div>

        {/* Leave Status Section */}
        <div className="card mt-3">
          <div className="card-body">
            <h2 className="text-center">Leave Status</h2>
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <CountsCard icon="fa-calendar" title="Total Leave" count="8" />
              <CountsCard icon="fa-check" title="Approved" count="5" />
              <CountsCard icon="fa-times" title="Rejected" count="2" />
            </div>
          </div>
        </div>

        {/* Side by Side Cards (Attendance & Team Members) */}
        <div className="row mt-3">
          {/* Attendance Card */}
          <div className="col-md-6">
            <div className="card">
              <div className="card-body text-center">
                <h4>Attendance</h4>
                <div className="d-flex justify-content-center gap-4 mt-3">
                  <div>
                    <div
                      style={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "50%",
                        backgroundColor: "#28a745",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "20px",
                        fontWeight: "bold",
                      }}
                    >
                      45
                    </div>
                    <p>Present</p>
                  </div>
                  <div>
                    <div
                      style={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "50%",
                        backgroundColor: "#dc3545",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "20px",
                        fontWeight: "bold",
                      }}
                    >
                      15
                    </div>
                    <p>Absent</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Team Members Card */}
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h4 className="text-center">Team Members</h4>
                <div className="card p-3">
                  {team.map((member, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "10px",
                        borderBottom:
                          index !== team.length - 1 ? "1px solid #ddd" : "none",
                      }}
                    >
                      <span>{member.name}</span>
                      <span style={{ fontWeight: "bold" }}>{member.role}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Employee;
