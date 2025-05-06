import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import Loading from "../Loading";
import {
  fetchLeaveApplications,
  setTotalApproved,
  setApprovedCount,
} from "../../store/leave-slice";
import { viewLeaveApplications } from "../../http";

const LeaveApplications = () => {
  const { user } = useSelector((state) => state.authSlice);
  const [type, setType] = useState();
  const [status, setStatus] = useState();
  const [appliedDate, setAppliedDate] = useState();
  const [applications, setApplications] = useState();
  const history = useHistory();

  const totalApproved = useSelector((state) => state.leaveSlice.totalApproved);
  const approvedCount = useSelector((state) => state.leaveSlice.approvedCount);

  const dispatch = useDispatch();

  useEffect(() => {
    const obj = { applicantID: user.id };

    const fetchData = async () => {
      try {
        await dispatch(fetchLeaveApplications(user.id));
        const res = await viewLeaveApplications(obj);
        setApplications(res.data);
      } catch (error) {
        console.error("Error fetching leave applications:", error);
      }
    };

    fetchData();
  }, [user.id, dispatch]);

  const searchLeaveApplications = async () => {
    const obj = { applicantID: user.id };

    if (type) obj["type"] = type;
    if (status) obj["adminResponse"] = status;
    if (appliedDate) obj["appliedDate"] = appliedDate;

    try {
      const res = await viewLeaveApplications(obj);
      const { data } = res;
      setApplications(data);

      const approvedApplications = data.filter(
        (application) => application.adminResponse === "Approved"
      );

      const approvedCount = approvedApplications.length;
      const approvedDays = approvedApplications.reduce(
        (total, application) => total + (application.period || 0),
        0
      );

      dispatch(setApprovedCount(approvedCount));
      dispatch(setTotalApproved(approvedDays));
    } catch (error) {
      console.error("Error fetching leave applications:", error);
    }

    setAppliedDate("");
    setType("");
    setStatus("");
  };

  const getLeaveBadge = (type) => {
    const baseStyle = {
      fontWeight: "500",
      fontSize: "0.85rem",
      padding: "4px 12px",
      borderRadius: "50px",
      display: "inline-block",
      whiteSpace: "nowrap",
    };

    switch (type) {
      case "Sick Leave":
        return (
          <span
            style={{
              ...baseStyle,
              color: "#155724",
              backgroundColor: "#d4edda", // light green
            }}
          >
            Sick Leave
          </span>
        );

      case "Casual Leave":
        return (
          <span
            style={{
              ...baseStyle,
              color: "#004085",
              backgroundColor: "#d6e9f9", // soft sky blue
            }}
          >
            Casual Leave
          </span>
        );

      case "Emergency Leave":
        return (
          <span
            style={{
              ...baseStyle,
              color: "#721c24",
              backgroundColor: "#f8d7da", // soft red
            }}
          >
            Emergency Leave
          </span>
        );
      default:
        return (
          <span
            style={{
              ...baseStyle,
              color: "#383d41",
              backgroundColor: "#e2e3e5",
            }}
          >
            Unknown
          </span>
        );
    }
  };

  const getStatusBadge = (status) => {
    const baseStyle = {
      fontWeight: "bold",
      fontSize: "1rem",
      padding: "4px 8px",
      borderRadius: "4px",
      display: "inline-block",
    };

    switch (status) {
      case "Approved":
        return (
          <span
            style={{
              ...baseStyle,
              color: "green",
              backgroundColor: "#e6ffe6",
            }}
          >
            Approved
          </span>
        );
      case "Rejected":
        return (
          <span
            style={{
              ...baseStyle,
              color: "red",
              backgroundColor: "#ffe6e6",
            }}
          >
            Rejected
          </span>
        );
      case "Pending":
        return (
          <span
            style={{
              ...baseStyle,
              color: "#0066cc",
              backgroundColor: "#e6f0ff",
            }}
          >
            Pending
          </span>
        );
      default:
        return (
          <span
            style={{
              ...baseStyle,
              color: "#555",
              backgroundColor: "#f0f0f0",
            }}
          >
            Unknown
          </span>
        );
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
                    <i className="fa fa-check-circle"></i> Approved
                    Applications:{" "}
                    <span className="fs-4 fw-bolder">{approvedCount}</span>
                  </span>
                  <span className="mx-2 text-secondary fw-medium">|</span>
                  <span className="text-primary fw-bold">
                    <i className="fa fa-calendar"></i> Total Approved Days:{" "}
                    <span className="fs-4 fw-bold">{totalApproved}</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-center align-items-center w-100">
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

              <div className="form-group col-md-4">
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
                    className="form-control"
                  />
                </div>
              </div>

              <button
                onClick={searchLeaveApplications}
                className="btn btn-lg btn-primary col mb-3"
              >
                Search
              </button>
            </div>
          </section>

          <div className="table-responsive">
            <table className="table table-striped table-md center-text">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Type</th>
                  <th>Title</th>
                  <th>Applied Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((application, idx) => (
                  <tr
                    key={application._id}
                    className="hover-effect"
                    onClick={() =>
                      history.push(`userLeaveApplications/${application._id}`)
                    }
                  >
                    <td>{idx + 1}</td>
                    <td>{getLeaveBadge(application.type)}</td>
                    <td>{application.title}</td>
                    <td>{application.appliedDate}</td>
                    <td>{getStatusBadge(application.adminResponse)}</td>
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

export default LeaveApplications;
