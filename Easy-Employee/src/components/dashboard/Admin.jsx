"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getCounts } from "../../http";
import { setCount } from "../../store/main-slice";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import CountsCard from "./CountsCard";
import PieChart from "../PieChart";
import BarChart from "../BarChart";
import { viewLeaves, getUser, getAttendance } from "../../http";

const Admin = () => {
  const dispatch = useDispatch();
  const [leaveEvents, setLeaveEvents] = useState([]);
  const [leaveCounts, setLeaveCounts] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [attendanceList, setAttendanceList] = useState([]);
  const [presentAbsent, setPresentAbsent] = useState({ present: 0, absent: 0 });
  console.log("Updated Attendance List:", attendanceList);

  useEffect(() => {
    (async () => {
      const res = await getCounts();
      if (res.success) dispatch(setCount(res.data));
    })();

    (async () => {
      const approvedLeavesRes = await viewLeaves({ adminResponse: "Approved" });

      if (approvedLeavesRes.success && Array.isArray(approvedLeavesRes.data)) {
        const formattedLeaves = await Promise.all(
          approvedLeavesRes.data.map(async (leave) => {
            const userRes = await getUser(leave.applicantID);
            const name = userRes?.data?.name || "Unknown";
            const role = userRes?.data?.type || "Employee";

            return {
              title: `${name} (${role})`,
              start: leave.startDate,
              end: leave.endDate,
              backgroundColor: role === "Leader" ? "#f4a261" : "#e76f51",
              borderColor: role === "Leader" ? "#f4a261" : "#e76f51",
            };
          })
        );

        setLeaveEvents(formattedLeaves);
        console.log("Leave Events", formattedLeaves);
      }
    })();

    const fetchLeaveCounts = async () => {
      try {
        const statuses = ["Pending", "Approved", "Rejected"];
        const counts = {};

        for (const status of statuses) {
          const res = await viewLeaves({ adminResponse: status });
          counts[status.toLowerCase()] = Array.isArray(res.data)
            ? res.data.length
            : 0;
        }

        setLeaveCounts(counts);
      } catch (error) {
        console.error("Error fetching leave status counts:", error);
      }
    };

    fetchLeaveCounts();
  }, []);

  // Fetch Attendance Data
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const attendanceRes = await getAttendance(); // Make sure this endpoint works
        console.log("Attendance Response:", attendanceRes); // Log the entire response

        // Check if data exists and is in the expected format
        if (
          !attendanceRes ||
          !attendanceRes.data ||
          !Array.isArray(attendanceRes.data)
        ) {
          console.log("No valid attendance data available.");
          setAttendanceList([]); // Empty attendance list
          return;
        }

        const data = attendanceRes.data;

        // Calculate present and absent count
        const presentCount = data.filter((a) => a.present === true).length;
        const absentCount = data.filter((a) => a.present === false).length;

        console.log("Present Count:", presentCount);
        console.log("Absent Count:", absentCount);

        setPresentAbsent({ present: presentCount, absent: absentCount });

        const employeeAttendance = data.reduce((acc, attendance) => {
          if (!acc[attendance.employeeID]) {
            acc[attendance.employeeID] = {
              presentDays: 0,
              totalDays: 0,
              name: "",
            };
          }
          if (attendance.present) {
            acc[attendance.employeeID].presentDays += 1;
          }
          acc[attendance.employeeID].totalDays += 1;
          return acc;
        }, {});

        const attendanceWithPercentages = await Promise.all(
          Object.entries(employeeAttendance).map(async ([employeeID, data]) => {
            const userRes = await getUser(employeeID);
            const name = userRes?.data?.name || "Unknown";
            const attendancePercentage = (
              (data.presentDays / data.totalDays) *
              100
            ).toFixed(2);
            return {
              name: name,
              attendancePercentage: parseFloat(attendancePercentage),
            };
          })
        );

        // Sorting the attendance data by percentage and selecting top 5 employees
        const sortedAttendance = attendanceWithPercentages
          .sort((a, b) => b.attendancePercentage - a.attendancePercentage)
          .slice(0, 5);

        setAttendanceList(sortedAttendance);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
        setAttendanceList([]); // Handle error by clearing the list
      }
    };

    fetchAttendance();
  }, []); // Empty dependency array to run only once on mount

  const { counts } = useSelector((state) => state.mainSlice);
  const { admin, employee, leader, team, present, absent } = counts;

  return (
    <div className="admin-container">
      {/* Top Cards */}
      <div className="cards-container">
        <CountsCard title="Total Employee" icon="fa-user" count={employee} />
        <CountsCard title="Total Leader" icon="fa-user" count={leader} />
        <CountsCard title="Total Admin" icon="fa-user" count={admin} />
        <CountsCard title="Total Team" icon="fa-user" count={team} />
      </div>

      {/* Charts */}
      <div className="charts-container">
        <div className="chart-item">
          <div className="chart-wrapper">
            <PieChart
              present={presentAbsent.present}
              absent={presentAbsent.absent}
            />
          </div>
        </div>

        {/* Leave Status */}
        <div className="chart-item">
          <div className="chart-wrapper">
            <div className="leave-applications-card">
              <h5 className="leave-applications-title">Leave Applications</h5>
              <div className="leave-status-container">
                <div className="leave-status-card pending">
                  <i className="fa fa-clock leave-icon"></i>
                  <div className="leave-info">
                    <h6>Pending</h6>
                    <p>{leaveCounts.pending}</p>
                  </div>
                </div>
                <div className="leave-status-card approved">
                  <i className="fa fa-check-circle leave-icon"></i>
                  <div className="leave-info">
                    <h6>Approved</h6>
                    <p>{leaveCounts.approved}</p>
                  </div>
                </div>
                <div className="leave-status-card rejected">
                  <i className="fa fa-times-circle leave-icon"></i>
                  <div className="leave-info">
                    <h6>Rejected</h6>
                    <p>{leaveCounts.rejected}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="chart-item">
          <div className="chart-wrapper">
            <BarChart />
          </div>
        </div>
      </div>

      {/* Attendance List */}
      <div className="full-width-section">
        <div className="card shadow-lg p-4 bg-white">
          <h3 className="text-center text-[#1c144c] font-semibold">
            Top 5 Employees by Attendance Percentage
          </h3>
          <ul className="attendance-list">
            {attendanceList.length > 0 ? (
              attendanceList.map((attendance, index) => (
                <li key={index} className="attendance-item">
                  <span className="attendance-rank">
                    <i
                      className="fa fa-medal"
                      style={{ color: "#fcc200" }} // Gold color for all
                    ></i>
                  </span>
                  <span className="attendance-name">{attendance.name}</span>
                  <span className="attendance-percentage">
                    {attendance.attendancePercentage}% Attendance
                  </span>
                </li>
              ))
            ) : (
              <p>No attendance data available.</p>
            )}
          </ul>
        </div>
      </div>

      {/* FullCalendar Section */}
      <div className="full-width-section mt-6">
        <div className="card shadow-lg p-4 bg-white">
          <h3 className="text-center text-[#1c144c] font-semibold mb-4">
            Approved Leave Calendar
          </h3>

          {/* Legend */}
          <div className="d-flex justify-content-center gap-4 mb-3 calendar-legend">
            <div className="d-flex align-items-center ">
              <span className="legend-color-box bg-leader "></span>
              <span className="legend-label mx-2">Leader Leave</span>
            </div>
            <div className="d-flex align-items-center">
              <span className="legend-color-box bg-employee ml-3"></span>
              <span className="legend-label mx-2">Employee Leave</span>
            </div>
          </div>

          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={leaveEvents}
            height="auto"
          />
        </div>
      </div>
    </div>
  );
};

export default Admin;
