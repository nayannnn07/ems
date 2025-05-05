import React, { useEffect, useState } from "react";
import { getEmployees, getLeaders, viewLeaves } from "../../http";
import { useHistory } from "react-router-dom";
import Loading from "../Loading";
import { CSVLink } from "react-csv";
import { Download } from "lucide-react";

const LeaveView = () => {
  const [type, setType] = useState();
  const [status, setStatus] = useState();
  const [appliedDate, setAppliedDate] = useState();
  const [applications, setApplications] = useState();
  const [approvedCount, setApprovedCount] = useState(0);
  const history = useHistory();
  const [employees, setEmployees] = useState();
  const [employeeMap, setEmployeeMap] = useState();
  const [selectedEmployee, setSelectedEmployee] = useState();

  useEffect(() => {
    let empObj = {};

    const fetchData = async () => {
      const res = await viewLeaves({});
      const { data } = res;
      setApplications(data);

      const approved = data.filter((app) => app.adminResponse === "Approved");
      setApprovedCount(approved.length);
    };

    const fetchEmployees = async () => {
      const emps = await getEmployees();
      const leaders = await getLeaders();
      emps.data.forEach(
        (employee) => (empObj[employee.id] = [employee.name, employee.email])
      );
      leaders.data.forEach(
        (leader) => (empObj[leader.id] = [leader.name, leader.email])
      );
      setEmployeeMap(empObj);
      setEmployees([...emps.data, ...leaders.data]);
    };

    fetchData();
    fetchEmployees();
  }, []);

  const searchLeaveApplications = async () => {
    const obj = {};

    if (selectedEmployee) obj["applicantID"] = selectedEmployee;
    if (type) obj["type"] = type;
    if (status) obj["adminResponse"] = status;
    if (appliedDate) obj["appliedDate"] = appliedDate;

    const res = await viewLeaves(obj);
    const { data } = res;
    setApplications(data);

    const approved = data.filter((app) => app.adminResponse === "Approved");
    setApprovedCount(approved.length);

    setAppliedDate("");
    setType("");
    setStatus("");
  };
  const [isHovered, setIsHovered] = useState(false);

  const baseColor = "#2e237a";
  const hoverColor = "#3a2d97";

  // Function to get the badge color based on the leave type
  const getLeaveTypeBadge = (type) => {
    switch (type) {
      case "Sick Leave":
        return "bg-danger text-white"; // Red for Sick leave
      case "Casual Leave":
        return "bg-primary text-white"; // Blue for Casual leave
      case "Emergency Leave":
        return "bg-warning text-dark"; // Yellow for Emergency leave
      default:
        return "bg-secondary text-white"; // Default color for undefined types
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return "bg-success text-white";
      case "Rejected":
        return "bg-danger text-white";
      case "Pending":
        return "bg-warning text-dark";
      default:
        return "bg-secondary text-white";
    }
  };

  return (
    <>
      {applications ? (
        <div className="main-content">
          <section className="section">
            <div className="card">
              <div className="card-header d-flex justify-content-between">
                <h4 style={{ fontSize: "24px", fontWeight: 700 }}>
                  Leave Applications
                </h4>
                <div className="text-end">
                  <span className="text-success fw-bolder">
                    <i className="fa fa-check-circle me-1"></i> Approved
                    Applications:{" "}
                    <span className="fs-4 fw-bolder">{approvedCount}</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="d-flex flex-wrap justify-content-center align-items-center w-100 gap-3 mt-3">
              <div className="form-group col-md-2">
                <label>Employee</label>
                <select
                  className="form-control select2"
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                >
                  <option value="">Employees</option>
                  {employees?.map((employee) => (
                    <option key={employee._id} value={employee.id}>
                      {employee.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group col-md-2">
                <label>Leave Type</label>
                <select
                  name="type"
                  onChange={(e) => setType(e.target.value)}
                  className="form-control select2"
                >
                  <option>Select</option>
                  <option>Sick Leave</option>
                  <option>Casual Leave</option>
                  <option>Emergency Leave</option>
                </select>
              </div>

              <div className="form-group col-md-2">
                <label>Status</label>
                <select
                  name="status"
                  onChange={(e) => setStatus(e.target.value)}
                  className="form-control select2"
                >
                  <option>Select</option>
                  <option>Pending</option>
                  <option>Approved</option>
                  <option>Rejected</option>
                </select>
              </div>

              <div className="form-group col-md-3 pt-3">
                <label>Applied Date</label>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <div className="input-group-text">
                      <i className="fa fa-calendar"></i>
                    </div>
                  </div>
                  <input
                    onChange={(e) => setAppliedDate(e.target.value)}
                    type="date"
                    id="startDate"
                    name="startDate"
                    className="form-control"
                  />
                </div>
              </div>

              {/* Buttons section aligned right */}
              <div className="d-flex justify-content-end align-items-end col-md-3 ">
                <div className="w-100">
                  <button
                    onClick={searchLeaveApplications}
                    className="btn btn-primary btn-lg w-100 "
                    style={{ height: "40px" }}
                  >
                    Search
                  </button>
                </div>
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                <div className="w-100">
                  <CSVLink
                    data={applications.map((app) => ({
                      Name: employeeMap?.[app.applicantID]?.[0],
                      Email: employeeMap?.[app.applicantID]?.[1],
                      Type: app.type,
                      Title: app.title,
                      "Applied Date": app.appliedDate,
                      Status: app.adminResponse,
                    }))}
                    filename={"leave_applications.csv"}
                    className="btn btn-lg w-100 d-flex align-items-center justify-content-center gap-2"
                    style={{
                      backgroundColor: isHovered ? hoverColor : baseColor,
                      color: "#fff",
                      height: "40px",
                      lineHeight: "30px",
                      border: "none",
                      transition:
                        "background-color 0.3s ease, transform 0.2s ease",
                      transform: isHovered ? "scale(1.02)" : "scale(1)",
                    }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    <Download size={20} /> &nbsp; Export CSV
                  </CSVLink>
                </div>
              </div>
            </div>
          </section>

          <div className="table-responsive">
            <table className="table table-striped table-md center-text">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Type</th>
                  <th>Title</th>
                  <th>Applied Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody className="sidebar-wrapper">
                {applications?.map((application, idx) => (
                  <tr
                    className="hover-effect"
                    key={application._id}
                    onClick={() => history.push(`leaves/${application._id}`)}
                  >
                    <td>{idx + 1}</td>
                    <td>{employeeMap?.[application.applicantID]?.[0]}</td>
                    <td>{employeeMap?.[application.applicantID]?.[1]}</td>
                    <td>
                      {/* Display the leave type with badge */}
                      <span
                        className={`badge px-3 py-1 rounded ${getLeaveTypeBadge(
                          application.type
                        )}`}
                        style={{ color: "black" }}
                      >
                        {application.type}
                      </span>
                    </td>
                    <td>{application.title}</td>
                    <td>{application.appliedDate}</td>
                    <td>
                      {/* Display the status with badge */}
                      <span
                        className={`badge px-3 py-1 rounded ${getStatusBadge(
                          application.adminResponse
                        )}`}
                      >
                        {application.adminResponse}
                      </span>
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

export default LeaveView;
