
import React, { useEffect, useState } from "react";
import { markEmployeeAttendance, viewEmployeeAttendance } from "../../http";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loading from "../Loading";

const Attendance = () => {
  const { user } = useSelector((state) => state.authSlice);
  const [isAttendanceMarked, setIsAttendanceMarked] = useState(false);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [attendance, setAttendance] = useState();
  const [isBeforeDeadline, setIsBeforeDeadline] = useState(true);

  const years = [2020, 2021, 2022, 2023, 2024, 2025];
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
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
  const numOfDays = monthDays[selectedMonth] || 31; // Default to 31 if not selected
  const days = Array.from({ length: numOfDays }, (_, index) => index + 1);

  useEffect(() => {
    const now = new Date();
    const isWeekend = now.getDay() === 0 || now.getDay() === 6;

    const startTime = new Date();
    startTime.setHours(8, 0, 0, 0); //8.30

    const endTime = new Date();
    endTime.setHours(9, 30, 0, 0); //9.30

    const isWithinTimeWindow = now >= startTime && now <= endTime;

    if (!isWithinTimeWindow || isWeekend) {
      setIsBeforeDeadline(false);
    }

    const storedData = localStorage.getItem(user.id);
    if (storedData) {
      const data = JSON.parse(storedData);
      const dt = `${data.date}/${data.month}/${data.year}`;
      if (dt === now.toLocaleDateString()) {
        setIsAttendanceMarked(true);
      } else {
        localStorage.clear();
      }
    }
  }, [user.id]);

  useEffect(() => {
    const dt = new Date();
    const obj = {
      employeeID: user.id,
      year: dt.getFullYear(),
      month: dt.getMonth() + 1,
    };
    const fetchData = async () => {
      const res = await viewEmployeeAttendance(obj);
      const { data } = res;
      setAttendance(data);
    };
    fetchData();
  }, [user.id]);

  // ✨ New Auto-Mark Absent Logic
  useEffect(() => {
    const now = new Date();
    const isWeekend = now.getDay() === 0 || now.getDay() === 6;

    if (!isWeekend) {
      const deadlineTime = new Date();
      deadlineTime.setHours(9, 30, 0, 0);

      if (now > deadlineTime && !isAttendanceMarked) {
        const autoMarkAbsent = async () => {
          try {
            const res = await markEmployeeAttendance({
              employeeID: user.id,
              present: false, // mark as absent
            });
            if (res.success) {
              toast.warn(`You were marked absent automatically for ${now.toLocaleDateString()}`);
              const { newAttendance } = res;
              const attendanceData = JSON.stringify(newAttendance);
              localStorage.setItem(user.id, attendanceData);
              setIsAttendanceMarked(true);
            }
          } catch (error) {
            console.error("Failed to auto-mark absent:", error);
          }
        };

        autoMarkAbsent();
      }
    }
  }, [isAttendanceMarked, user.id]);

  const markAttendance = async () => {
    const res = await markEmployeeAttendance({ employeeID: user.id });
    const { success } = res;
    if (success) {
      toast.success(res.message);
      const { newAttendance } = res;
      const attendanceData = JSON.stringify(newAttendance);
      localStorage.setItem(user.id, attendanceData);
      setIsAttendanceMarked(true);
    }
  };

  const searchAttendance = async () => {
    const obj = { employeeID: user.id };
    if (selectedYear) obj["year"] = selectedYear;
    if (selectedMonth) obj["month"] = months.findIndex((month) => month === selectedMonth) + 1;
    if (selectedDay) obj["date"] = selectedDay;

    const res = await viewEmployeeAttendance(obj);
    const { data } = res;
    setAttendance(data);
  };

  return (
    <>
      {attendance ? (
        <div className="main-content">
          <section className="section">
            <div className="card">
              <div className="card-header d-flex justify-content-between">
                <h4 style={{ fontSize: "24px", fontWeight: 700 }}>
                  Attendance
                </h4>
                <button
                  className={`btn btn-lg ${
                    isAttendanceMarked || !isBeforeDeadline
                      ? "btn-secondary"
                      : "btn-primary"
                  } btn-icon-split`}
                  onClick={markAttendance}
                  disabled={isAttendanceMarked || !isBeforeDeadline}
                >
                  {isAttendanceMarked
                    ? "Attendance Marked"
                    : !isBeforeDeadline
                    ? "Marking Closed"
                    : "Mark Attendance"}
                </button>
              </div>
            </div>

            <div className="d-flex justify-content-center w-100">
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
              <button
                onClick={searchAttendance}
                className="btn btn-lg btn-primary col"
              >
                Search
              </button>
            </div>
          </section>

          <div className="table-responsive mt-4">
            <table className="table table-striped table-md center-text">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Day</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {attendance?.map((attendance, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{attendance.date + "/" + attendance.month + "/" + attendance.year}</td>
                    <td>{attendance.day}</td>
                    <td>
                      {attendance.present === true ? (
                        <span style={{
                          color: "green",
                          fontWeight: "bold",
                          fontSize: "1rem",
                          backgroundColor: "#e6ffe6",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          display: "inline-block",
                        }}>
                          Present
                        </span>
                      ) : (
                        <span style={{
                          color: "red",
                          fontWeight: "bold",
                          fontSize: "1rem",
                          backgroundColor: "#ffe6e6",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          display: "inline-block",
                        }}>
                          Absent
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default Attendance;