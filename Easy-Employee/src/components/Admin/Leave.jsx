import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { updateLeave, viewLeaves } from "../../http";
import { toast } from "react-toastify";
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
  ChevronLeft,
} from "lucide-react";

const Leave = () => {
  const { id } = useParams();
  const history = useHistory();
  const [application, setApplication] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const obj = { _id: id };
      const res = await viewLeaves(obj);
      setApplication(res.data[0]);
    };
    fetchData();
  }, [id]);

  const approveApplication = async () => {
    if (application.adminResponse === "Approved") {
      toast.error("Application already approved");
      return;
    }
    application["adminResponse"] = "Approved";
    const res = await updateLeave(id, application);
    if (res.success) {
      toast.success("Leave Approved");
      setApplication({ ...application });
    }
  };

  const rejectApplication = async () => {
    if (application.adminResponse === "Rejected") {
      toast.error("Application already rejected");
      return;
    }
    application["adminResponse"] = "Rejected";
    const res = await updateLeave(id, application);
    if (res.success) {
      toast.success("Leave Rejected");
      setApplication({ ...application });
    }
  };

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

  const handleClose = () => {
    history.push("/leaves");
  };

  return application ? (
    <div className="main-content">
      <section className="section">
        <HeaderSection
          title="Leave Application Details"
          rightContent={
            <button className="btn btn-light btn-sm" onClick={handleClose}>
              <ChevronLeft size={16} className="mr-1" />
              Back to Leaves
            </button>
          }
        />

        <div className="card shadow-sm border-0">
          <div className="card-header bg-white border-bottom">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <FileText size={20} className="text-primary mr-2" />
                Application from {application?.employeeName || "Employee"}
              </h5>
              <span className="badge bg-light text-dark">
                Applied on: {application?.appliedDate}
              </span>
            </div>
          </div>

          <div className="card-body">
            <div className="container-fluid">
              <div className="row">
                {/* Left Column */}
                <div className="col-md-6">
                  <div className="d-flex align-items-center bg-light rounded p-3 mb-3">
                    <FileText size={18} className="text-primary mr-4" />
                    <div>
                      <div className="text-muted small">Title</div>
                      <div className="fw-semibold">{application?.title}</div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center bg-light rounded p-3 mb-3">
                    <User size={18} className="text-primary mr-4" />
                    <div>
                      <div className="text-muted small">Employee</div>
                      <div className="fw-semibold">
                        {application?.employeeName}
                      </div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center bg-light rounded p-3 mb-3">
                    <Calendar size={18} className="text-primary mr-4" />
                    <div>
                      <div className="text-muted small">Leave Type</div>
                      <div className="fw-semibold">
                        <span
                          className={`badge ${getLeaveTypeBadge(
                            application?.type
                          )} px-3 py-1`}
                        >
                          {application?.type}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center bg-light rounded p-3 mb-3">
                    <Clock size={18} className="text-primary mr-4" />
                    <div>
                      <div className="text-muted small">Duration</div>
                      <div className="fw-semibold">
                        {application?.period} day(s)
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="col-md-6">
                  <div className="d-flex align-items-center bg-light rounded p-3 mb-3">
                    <Calendar size={18} className="text-primary mr-4" />
                    <div>
                      <div className="text-muted small">Start Date</div>
                      <div className="fw-semibold">
                        {application?.startDate}
                      </div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center bg-light rounded p-3 mb-3">
                    <Calendar size={18} className="text-primary mr-4" />
                    <div>
                      <div className="text-muted small">End Date</div>
                      <div className="fw-semibold">{application?.endDate}</div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center bg-light rounded p-3 mb-3">
                    <Calendar size={18} className="text-primary mr-4" />
                    <div>
                      <div className="text-muted small">Applied Date</div>
                      <div className="fw-semibold">
                        {application?.appliedDate}
                      </div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center bg-light rounded p-3 mb-3">
                    {getStatusIcon(application?.adminResponse)}
                    <div>
                      <div className="text-muted small">Status</div>
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

              {/* Reason Section */}
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

              {/* Action Buttons */}
              <div className="d-flex justify-content-end gap-3 mt-4">
                <button
                  onClick={approveApplication}
                  className={`btn btn-success ${
                    application?.adminResponse === "Approved" ? "disabled" : ""
                  }`}
                  disabled={application?.adminResponse === "Approved"}
                >
                  <CheckCircle size={16} className="mr-2" />
                  Approve
                </button>
                <button
                  onClick={rejectApplication}
                  className={`btn btn-danger ${
                    application?.adminResponse === "Rejected" ? "disabled" : ""
                  }`}
                  disabled={application?.adminResponse === "Rejected"}
                >
                  <XCircle size={16} className="mr-2" />
                  Reject
                </button>
                {application?.adminResponse === "Pending" && (
                  <button className="btn btn-secondary">
                    <AlertCircle size={16} className="mr-2" />
                    Keep Pending
                  </button>
                )}
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

export default Leave;
