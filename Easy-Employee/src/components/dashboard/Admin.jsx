import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getCounts } from "../../http";
import { setCount } from "../../store/main-slice";
import CountsCard from "./CountsCard";
import PieChart from "../PieChart";
import BarChart from "../BarChart";

const Admin = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const res = await getCounts();
      if (res.success) dispatch(setCount(res.data));
    })();
  }, [dispatch]);

  const { counts } = useSelector((state) => state.mainSlice);
  const { admin, employee, leader, team, present, absent } = counts;

  // Static Attendance Data
  const attendanceStats = [
    { name: "Alice Johnson", attendancePercentage: 98 },
    { name: "Bob Smith", attendancePercentage: 95 },
    { name: "Charlie Brown", attendancePercentage: 92 },
    { name: "David Williams", attendancePercentage: 88 },
    { name: "Emily Davis", attendancePercentage: 85 },
  ];

  return (
    <div className="admin-container">
      {/* Top Cards Section */}
      <div className="cards-container">
        <CountsCard title="Total Employee" icon="fa-user" count={employee} />
        <CountsCard title="Total Leader" icon="fa-user" count={leader} />
        <CountsCard title="Total Admin" icon="fa-user" count={admin} />
        <CountsCard title="Total Team" icon="fa-user" count={team} />
      </div>

      {/* Charts Section */}
      <div className="charts-container">
        {/* Pie Chart */}
        <div className="chart-item">
          <div className="chart-wrapper">
            <PieChart present={present} absent={absent} />
          </div>
        </div>

        {/* Leave Applications Overview */}
        <div className="chart-item">
          <div className="chart-wrapper flex items-center justify-center">
            <div className="card shadow-lg p-6 w-full h-full flex flex-col gap-5 items-center justify-center">
              <h5 className="text-2xl font-bold text-[#1c144c]">
                Leave Applications
              </h5>

              {/* Pending Leaves */}
              <div className="leave-status-card pending">
                <i className="fa fa-clock leave-icon"></i>
                <div className="leave-info">
                  <h6>Pending</h6>
                  <p>5</p>
                </div>
              </div>

              {/* Approved Leaves */}
              <div className="leave-status-card approved">
                <i className="fa fa-check-circle leave-icon"></i>
                <div className="leave-info">
                  <h6>Approved</h6>
                  <p>4</p>
                </div>
              </div>

              {/* Rejected Leaves */}
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

        {/* Bar Chart */}
        <div className="chart-item">
          <div className="chart-wrapper">
            <BarChart />
          </div>
        </div>
      </div>

      {/* Employees Attendance Overview */}
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
    </div>
  );
};

export default Admin;
