import React, { useEffect, useState } from "react";
import {
  getAttendance,
  getEmployees,
  getLeaders,
  updateAttendanceStatus,
} from "../../http";
import Loading from "../Loading";
import HeaderSection from "../HeaderSection";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const AttendanceView = () => {
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [attendance, setAttendance] = useState();
  const [employeeMap, setEmployeeMap] = useState({});
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const years = [2020, 2021, 2022, 2023, 2024, 2025];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthDays = {
    January: 31,
    February: 28,
    March: 31,
    April: 30,
    May: 31,
    June: 30,
    July: 31,
    August: 31,
    September: 30,
    October: 31,
    November: 30,
    December: 31,
  };
  const numOfDays = monthDays[selectedMonth] || 31;
  const days = Array.from({ length: numOfDays }, (_, index) => index + 1);

  useEffect(() => {
    const dt = new Date();
    const obj = {
      year: dt.getFullYear(),
      month: dt.getMonth() + 1,
      date: dt.getDate(),
    };
    let empObj = {};

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await getAttendance(obj);
        const { data } = res;
        setAttendance(data);
      } catch (error) {
        console.error("Error fetching attendance:", error);
        toast.error("Failed to load attendance data");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchEmployees = async () => {
      try {
        const emps = await getEmployees();
        const leaders = await getLeaders();

        const empData = {};
        emps.data.forEach(
          (employee) => (empData[employee.id] = [employee.name, employee.email])
        );
        leaders.data.forEach(
          (leader) => (empData[leader.id] = [leader.name, leader.email])
        );

        setEmployeeMap(empData);
        setEmployees([...emps.data, ...leaders.data]);
      } catch (error) {
        console.error("Error fetching employees:", error);
        toast.error("Failed to load employee data");
      }
    };

    fetchEmployees();
    fetchData();
  }, []);

  const searchAttendance = async () => {
    setIsLoading(true);
    try {
      const obj = {};
      if (selectedEmployee) obj["employeeID"] = selectedEmployee;
      if (selectedYear) obj["year"] = parseInt(selectedYear);
      if (selectedMonth)
        obj["month"] = months.findIndex((month) => month === selectedMonth) + 1;
      if (selectedDay) obj["date"] = parseInt(selectedDay);

      const res = await getAttendance(obj);
      let { data } = res;

      // Apply status filter to the data client-side
      if (selectedStatus) {
        data = data.filter((attendance) => {
          if (selectedStatus === "present") {
            return attendance.present === true;
          } else if (selectedStatus === "absent") {
            return attendance.present === false;
          }
          return true;
        });
      }

      setAttendance(data);
      // toast.success("Attendance data loaded successfully");
    } catch (error) {
      console.error("Error searching attendance:", error);
      toast.error("Failed to search attendance data");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStatus = async (attendanceId, currentStatus) => {
    console.log(
      "Toggle status called for:",
      attendanceId,
      "Current status:",
      currentStatus
    );
    try {
      // Optimistically update the UI first
      setAttendance((prevAttendance) =>
        prevAttendance.map((item) => {
          if (item._id === attendanceId) {
            return { ...item, present: !currentStatus };
          }
          return item;
        })
      );

      // Send PATCH request to update the attendance status
      console.log("Sending PATCH request...");
      const response = await updateAttendanceStatus(attendanceId, {
        present: !currentStatus,
      });

      console.log("Response received:", response);

      // Handle response based on its actual structure
      if (response && response.message === "Attendance updated successfully") {
        toast.success(
          `Attendance marked as ${!currentStatus ? "Present" : "Absent"}`
        );
      } else {
        console.log("Unexpected response structure:", response);
        toast.error("Failed to update attendance status. Please try again.");
      }
    } catch (error) {
      console.error("Error updating attendance status:", error);

      // Revert the optimistic update if the API call fails
      setAttendance((prevAttendance) =>
        prevAttendance.map((item) => {
          if (item._id === attendanceId) {
            return { ...item, present: currentStatus };
          }
          return item;
        })
      );

      toast.error("Failed to update attendance status. Please try again.");
    }
  };

  return (
    <div className="main-content">
      <section className="section">
        <HeaderSection title="Attendance" />
        <div className="d-flex justify-content-center w-100">
          <div className="col">
            <select
              className="form-control select2"
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
            >
              <option value="">Employees</option>
              {employees?.map((employee) => (
                <option key={employee._id || employee.id} value={employee.id}>
                  {employee.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col">
            <select
              className="form-control select2"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="">Year</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div className="col">
            <select
              className="form-control select2"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <option value="">Month</option>
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>
          <div className="col">
            <select
              className="form-control select2"
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
            >
              <option value="">Day</option>
              {days.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>
          <div className="col">
            <select
              className="form-control select2"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">Status</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
            </select>
          </div>
          <button
            onClick={searchAttendance}
            className="btn btn-lg btn-primary col"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Search"}
          </button>
        </div>
      </section>

      <div className="table-responsive mt-4">
        <table className="table table-striped table-md center-text">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Date</th>
              <th>Day</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {attendance && attendance.length > 0 ? (
              attendance.map((attend, index) => (
                <tr key={attend._id}>
                  <td>{index + 1}</td>
                  <td>{employeeMap[attend.employeeID]?.[0] || "Unknown"}</td>
                  <td>{employeeMap[attend.employeeID]?.[1] || "Unknown"}</td>
                  <td>
                    {attend.date + "/" + attend.month + "/" + attend.year}
                  </td>
                  <td>{attend.day}</td>
                  <td>
                    {attend.present ? (
                      <span
                        style={{
                          color: "green",
                          fontWeight: "bold",
                          fontSize: "1rem",
                          backgroundColor: "#e6ffe6",
                          padding: "4px 8px",
                          borderRadius: "4px",
                        }}
                      >
                        Present
                      </span>
                    ) : (
                      <span
                        style={{
                          color: "red",
                          fontWeight: "bold",
                          fontSize: "1rem",
                          backgroundColor: "#ffe6e6",
                          padding: "4px 8px",
                          borderRadius: "4px",
                        }}
                      >
                        Absent
                      </span>
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() => toggleStatus(attend._id, attend.present)}
                      className="btn btn-primary btn-sm d-flex align-items-center"
                      style={{
                        borderRadius: "5px",
                        padding: "6px 12px",
                        fontWeight: "bold",
                      }}
                    >
                      <i className="fa fa-arrow-circle-right mr-2"></i>{" "}
                      {/* Font Awesome Refresh Icon */}
                      Change Status
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No attendance records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceView;
