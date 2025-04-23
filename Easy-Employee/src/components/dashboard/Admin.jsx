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

const Admin = () => {
  const dispatch = useDispatch();
  const [leaveEvents, setLeaveEvents] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await getCounts();
      if (res.success) dispatch(setCount(res.data));
    })();

    // 👇 Replace this with your actual fetch call for leave data
    const approvedLeaves = [
      {
        title: "Nayana (Employee)",
        start: "2025-04-25",
        end: "2025-04-26",
        backgroundColor: "#38b000",
        borderColor: "#38b000",
      },
      {
        title: "Prajwol (Leader)",
        start: "2025-04-27",
        end: "2025-04-28",
        backgroundColor: "#0081a7",
        borderColor: "#0081a7",
      },
      {
        title: "Aishworya (Employee)",
        start: "2025-04-23",
        end: "2025-04-24",
        backgroundColor: "#38b000",
        borderColor: "#38b000",
      },
    ];
    setLeaveEvents(approvedLeaves);
  }, [dispatch]);

  const { counts } = useSelector((state) => state.mainSlice);
  const { admin, employee, leader, team, present, absent } = counts;

  const attendanceStats = [
    { name: "Nayana", attendancePercentage: 98 },
    { name: "Prajwol", attendancePercentage: 95 },
    { name: "Aishworya", attendancePercentage: 92 },
    { name: "Rojal", attendancePercentage: 88 },
    { name: "Sujal", attendancePercentage: 85 },
  ];

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
            <PieChart present={present} absent={absent} />
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
                    <p>5</p>
                  </div>
                </div>
                <div className="leave-status-card approved">
                  <i className="fa fa-check-circle leave-icon"></i>
                  <div className="leave-info">
                    <h6>Approved</h6>
                    <p>4</p>
                  </div>
                </div>
                <div className="leave-status-card rejected">
                  <i className="fa fa-times-circle leave-icon"></i>
                  <div className="leave-info">
                    <h6>Rejected</h6>
                    <p>3</p>
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
            Employees Attendance Overview
          </h3>
          <ul className="attendance-list">
            {attendanceStats.map((employee, index) => (
              <li key={index} className="attendance-item">
                <span className="attendance-rank">
                  {index === 0
                    ? "🥇"
                    : index === 1
                    ? "🥈"
                    : index === 2
                    ? "🥉"
                    : "🏅"}
                </span>
                <span className="attendance-name">{employee.name}</span>
                <span className="attendance-percentage">
                  {employee.attendancePercentage}% Attendance
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* FullCalendar Section */}
      <div className="full-width-section mt-6">
        <div className="card shadow-lg p-4 bg-white">
          <h3 className="text-center text-[#1c144c] font-semibold mb-4">
            Approved Leave Calendar
          </h3>
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
