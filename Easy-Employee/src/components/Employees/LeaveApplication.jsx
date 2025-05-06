import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { viewLeaveApplications } from "../../http";
import Loading from "../Loading";
import HeaderSection from "../../components/HeaderSection";
import {
  Calendar,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
} from "lucide-react";

const LeaveApplication = () => {
  const { id } = useParams();
  const history = useHistory();
  const [application, setApplication] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const obj = { _id: id };
      const res = await viewLeaveApplications(obj);
      setApplication(res.data[0]);
    };
    fetchData();
  }, [id]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "Approved":
        return <CheckCircle size={18} className="text-success mr-2" />;
      case "Rejected":
        return <XCircle size={18} className="text-danger mr-2" />;
      default:
        return <AlertCircle size={18} className="text-warning mr-2" />;
    }
  };

  const getLeaveBadge = (type) => {
    const baseStyle = {
      fontWeight: "500",
      fontSize: "0.7rem",
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

  const handleClose = () => {
    history.push("/userLeaveApplications");
  };

  return application ? (
    <div className="main-content">
      <section className="section">
        <HeaderSection
          title="Leave Application Details"
          rightContent={
            <div className="d-flex justify-content-end align-items-center w-100">
              <button
                className="btn btn-light btn-sm ml-auto"
                onClick={handleClose}
                title="Close"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          }
        />
        <div className="card shadow-sm border-0">
  <div className="card-header bg-white border-bottom">
    <div className="d-flex align-items-center w-100">
      <h5 className="mb-0">
        <FileText size={20} className="text-primary mr-2" />
        Application Applied on: {application?.appliedDate || "N/A"}
      </h5>
      <button
        className="btn btn-light btn-sm ml-auto"
        onClick={handleClose}
        title="Close"
      >
        <i className="fas fa-times"></i>
      </button>
    </div>
  </div>


          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <div className="bg-light rounded p-3 mb-3 d-flex align-items-center">
                  <FileText size={18} className="text-primary mr-4" />
                  <div>
                    <div className="text-dark small">Title</div>
                    <div className="fw-semibold">{application?.title}</div>
                  </div>
                </div>

                {/* <div className="bg-light rounded p-3 mb-3 d-flex align-items-center">
                  <User size={18} className="text-primary mr-4" />
                  <div>
                    <div className="text-muted small">User</div>
                    <div className="fw-semibold">Employee</div>
                  </div>
                </div> */}

                <div className="bg-light rounded p-3 mb-3 d-flex align-items-center">
                  <Calendar size={18} className="text-primary mr-4 " />
                  <div>
                    <div className="text-dark small">Leave Type</div>
                    <div className="fw-semibold">
                      {getLeaveBadge(application?.type)}
                    </div>
                  </div>
                </div>

                <div className="bg-light rounded p-3 mb-3 d-flex align-items-center">
                  <Clock size={18} className="text-primary mr-4" />
                  <div>
                    <div className="text-dark small">Duration</div>
                    <div className="fw-semibold">
                      {application?.period} day(s)
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="bg-light rounded p-3 mb-3 d-flex align-items-center">
                  <Calendar size={18} className="text-primary mr-4" />
                  <div>
                    <div className="text-dark small">Start Date</div>
                    <div className="fw-semibold">{application?.startDate}</div>
                  </div>
                </div>

                <div className="bg-light rounded p-3 mb-3 d-flex align-items-center">
                  <Calendar size={18} className="text-primary mr-4" />
                  <div>
                    <div className="text-dark small">End Date</div>
                    <div className="fw-semibold">{application?.endDate}</div>
                  </div>
                </div>

                {/* <div className="bg-light rounded p-3 mb-3 d-flex align-items-center">
                  <Calendar size={18} className="text-primary mr-4" />
                  <div>
                    <div className="text-muted small">Applied Date</div>
                    <div className="fw-semibold">
                      {application?.appliedDate}
                    </div>
                  </div>
                </div> */}

                <div className="bg-light rounded p-3 mb-3 d-flex align-items-center">
                  {getStatusIcon(application?.adminResponse)}
                  <div>
                    <div className="text-dark small">Status</div>
                    <div
                      className={`fw-semibold ${
                        application?.adminResponse === "Approved"
                          ? "text-success"
                          : application?.adminResponse === "Rejected"
                          ? "text-danger"
                          : "text-warning"
                      }`}
                    >
                      {application?.adminResponse}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reason */}
            <div className="row mt-3">
              <div className="col-md-12">
                <div className="card shadow-sm border-0">
                  <div className="card-header bg-light">
                    <h6 className="mb-0">
                      <FileText size={16} className="text-primary mr-2" />
                      Reason for Leave
                    </h6>
                  </div>
                  <div className="card-body">
                    <p className="mb-0">{application?.reason}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  ) : (
    <Loading />
  );
};

export default LeaveApplication;
