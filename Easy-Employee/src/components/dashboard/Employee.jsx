"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getCounts } from "../../http";
import { setCount } from "../../store/main-slice";
import CountsCard from "./CountsCard";
import PieChart from "../PieChart";
import { fetchLeaveApplications } from "../../store/leave-slice";
import { viewEmployeeAttendance } from "../../http"; // Import attendance fetch function

const Employee = () => {
  const dispatch = useDispatch();

  const { user, counts } = useSelector((state) => ({
    user: state.authSlice.user,
    counts: state.mainSlice.counts || {},
  }));

  const { pendingCount, approvedCount, rejectedCount, totalCount } =
    useSelector((state) => state.leaveSlice);

  const [attendance, setAttendance] = useState([]);
  const [present, setPresent] = useState(0);
  const [absent, setAbsent] = useState(0);

  useEffect(() => {
    dispatch(fetchLeaveApplications(user.id));
    getCounts().then((res) => {
      if (res.success) dispatch(setCount(res.data));
    });

    // Fetch attendance data for the employee
    const fetchAttendance = async () => {
      const obj = {
        employeeID: user.id,
      };
      const res = await viewEmployeeAttendance(obj);
      if (res.success) {
        setAttendance(res.data); // Store attendance data

        // Calculate present and absent counts dynamically
        const presentCount = res.data.filter(
          (att) => att.present === true
        ).length;
        const absentCount = res.data.filter(
          (att) => att.present === false
        ).length;

        setPresent(presentCount); // Set present count
        setAbsent(absentCount); // Set absent count
      }
    };

    fetchAttendance();
  }, [dispatch, user.id]);

  // Static Team Data
  const team = [
    { name: "Prajwol", role: "Frontend Developer" },
    { name: "Sujal", role: "Backend Developer" },
    { name: "Nayana", role: "UI/UX Designer" },
    { name: "Rojal", role: "Product Manager" },
    { name: "Jane", role: "QA Tester" },
    { name: "Anish", role: "DevOps Engineer" },
    { name: "Aishworya", role: "Project Manager" },
  ];

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
              <PieChart present={present} absent={absent} />
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

export default Employee;
