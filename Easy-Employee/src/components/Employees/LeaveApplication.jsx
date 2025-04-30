import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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

  const getTypeBadge = (type) => {
    switch (type) {
      case "Sick Leave":
        return <span className="badge bg-danger text-white">Sick Leave</span>;
      case "Casual Leave":
        return (
          <span className="badge bg-primary text-white">Casual Leave</span>
        );
      case "Emergency Leave":
        return (
          <span className="badge bg-warning text-dark">Emergency Leave</span>
        );
      default:
        return <span className="badge bg-secondary text-white">Unknown</span>;
    }
  };

  return application ? (
    <div className="main-content">
      <section className="section">
        <HeaderSection title="Leave Application Details" />
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
            <div className="row">
              <div className="col-md-6">
                <div className="bg-light rounded p-3 mb-3 d-flex align-items-center">
                  <FileText size={18} className="text-primary mr-4" />
                  <div>
                    <div className="text-muted small">Title</div>
                    <div className="fw-semibold">{application?.title}</div>
                  </div>
                </div>

                <div className="bg-light rounded p-3 mb-3 d-flex align-items-center">
                  <User size={18} className="text-primary mr-4" />
                  <div>
                    <div className="text-muted small">Employee</div>
                    <div className="fw-semibold">
                      {application?.employeeName}
                    </div>
                  </div>
                </div>

                <div className="bg-light rounded p-3 mb-3 d-flex align-items-center">
                  <Calendar size={18} className="text-primary mr-4" />
                  <div>
                    <div className="text-muted small">Leave Type</div>
                    <div className="fw-semibold">
                      {getTypeBadge(application?.type)}
                    </div>
                  </div>
                </div>

                <div className="bg-light rounded p-3 mb-3 d-flex align-items-center">
                  <Clock size={18} className="text-primary mr-4" />
                  <div>
                    <div className="text-muted small">Duration</div>
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
                    <div className="text-muted small">Start Date</div>
                    <div className="fw-semibold">{application?.startDate}</div>
                  </div>
                </div>

                <div className="bg-light rounded p-3 mb-3 d-flex align-items-center">
                  <Calendar size={18} className="text-primary mr-4" />
                  <div>
                    <div className="text-muted small">End Date</div>
                    <div className="fw-semibold">{application?.endDate}</div>
                  </div>
                </div>

                <div className="bg-light rounded p-3 mb-3 d-flex align-items-center">
                  <Calendar size={18} className="text-primary mr-4" />
                  <div>
                    <div className="text-muted small">Applied Date</div>
                    <div className="fw-semibold">
                      {application?.appliedDate}
                    </div>
                  </div>
                </div>

                <div className="bg-light rounded p-3 mb-3 d-flex align-items-center">
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
