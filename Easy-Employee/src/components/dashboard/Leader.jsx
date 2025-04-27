"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getCounts } from "../../http";
import { setCount } from "../../store/main-slice";
import { fetchLeaveApplications } from "../../store/leave-slice"; // ✅ Import action
import CountsCard from "./CountsCard";
import PieChart from "../PieChart";
import { viewEmployeeAttendance } from "../../http"; // Import the function to fetch attendance

const Leader = () => {
  const dispatch = useDispatch();
  const { user, counts } = useSelector((state) => ({
    user: state.authSlice.user,
    counts: state.mainSlice.counts || {},
  }));

  const { pendingCount, approvedCount, rejectedCount, totalCount } =
    useSelector((state) => state.leaveSlice);

  // ** Dynamic Present/Absent Calculation **
  const [attendanceData, setAttendanceData] = useState([]);
  const [presentCount, setPresentCount] = useState(0);
  const [absentCount, setAbsentCount] = useState(0);

  const team = [
    { name: "Prajwol", role: "Frontend Developer" },
    { name: "Sujal", role: "Backend Developer" },
    { name: "Nayana", role: "UI/UX Designer" },
    { name: "Rojal", role: "Product Manager" },
    { name: "Jane", role: "QA Tester" },
    { name: "Anish", role: "DevOps Engineer" },
    { name: "Aishworya", role: "Project Manager" },
  ];

  useEffect(() => {
    dispatch(fetchLeaveApplications(user.id)); // ✅ fetch leave data
    getCounts().then((res) => {
      if (res.success) dispatch(setCount(res.data));
    });
    
    // Fetch attendance data for the team members
    const fetchAttendance = async () => {
      try {
        const res = await viewEmployeeAttendance({
          employeeID: user.id,
        });

        const data = res?.data || [];
        setAttendanceData(data);

        // Calculate present and absent counts
        const present = data.filter((att) => att.present).length;
        const absent = data.length - present;

        setPresentCount(present);
        setAbsentCount(absent);
      } catch (error) {
        console.error("Failed to fetch attendance:", error);
      }
    };

    fetchAttendance();
  }, [dispatch, user.id]);

  return (
    <div className="admin-container">
      {/* Top Cards Section */}
      <div className="cards-container">
        <CountsCard
          icon="fa-calendar-alt"
          title="Total Leave Applications"
          count={totalCount}
        />
        <CountsCard
          icon="fa-clock"
          title="Total Pending Leaves"
          count={pendingCount}
        />
        <CountsCard
          icon="fa-check-circle"
          title="Total Approved Leaves"
          count={approvedCount}
        />
        <CountsCard
          icon="fa-times-circle"
          title="Total Rejected Leaves"
          count={rejectedCount}
        />
      </div>

      {/* Charts Section */}
      <div className="row mt-3">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body text-center">
              <PieChart present={presentCount} absent={absentCount} />
            </div>
          </div>
        </div>

        {/* Team Members Section */}
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
    </div>
  );
};

export default Leader;
