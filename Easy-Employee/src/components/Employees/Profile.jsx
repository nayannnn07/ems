import React from "react";
import { useSelector } from "react-redux";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  CreditCard,
  UserCheck,
  CircleDot,
} from "lucide-react";
import HeaderSection from "../../components/HeaderSection";

const Employee = () => {
  const { user } = useSelector((state) => state.authSlice);
  console.log(user);

  const StatusBadge = ({ status }) => {
    const normalizedStatus = status?.toLowerCase();

    const getStatusClass = () => {
      switch (normalizedStatus) {
        case "active":
          return "bg-success text-white";
        case "inactive":
          return "bg-danger text-white";
        case "pending":
          return "bg-warning text-dark";
        default:
          return "bg-secondary text-white";
      }
    };

    const getIconColor = () => {
      switch (normalizedStatus) {
        case "active":
          return "text-white";
        case "inactive":
          return "text-white";
        case "pending":
          return "text-dark";
        default:
          return "text-white";
      }
    };

    return (
      <span
        className={`d-inline-flex align-items-center px-3 py-1 rounded-pill fw-semibold text-uppercase ${getStatusClass()}`}
        style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}
      >
        <CircleDot size={12} className={`mr-1 ${getIconColor()}`} />
        {status}
      </span>
    );
  };

  return (
    <div className="main-content">
      <section className="section">
        <HeaderSection title="Profile" />

        <div className="card shadow-sm border-0">
          <div className="card-body p-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="text-primary mb-0">
                <User size={20} className="mr-2" />
                Employee Details
              </h5>
            </div>

            <div className="container-fluid">
              <div className="row">
                {/* Left Column */}
                <div className="col-md-6">
                  {/* Name */}
                  <div className="d-flex align-items-center bg-light rounded p-3 mb-3">
                    <User size={18} className="text-primary mr-4" />
                    <div>
                      <div className="text-muted small">Full Name</div>
                      <div className="fw-semibold">
                        {user?.name || "John Doe"}
                      </div>
                    </div>
                  </div>

                  {/* Username */}
                  <div className="d-flex align-items-center bg-light rounded p-3 mb-3">
                    <Shield size={18} className="text-primary mr-4" />
                    <div>
                      <div className="text-muted small">Status</div>
                      <div className="fw-semibold">
                        <StatusBadge status={user?.status || "Active"} />
                      </div>
                    </div>
                  </div>

                  {/* Role */}
                  <div className="d-flex align-items-center bg-light rounded p-3 mb-3">
                    <UserCheck size={18} className="text-primary mr-4" />
                    <div>
                      <div className="text-muted small">User Role</div>
                      <div className="fw-semibold">
                        {user?.type || "Employee"}
                      </div>
                    </div>
                  </div>

                  {/* Department */}
                </div>

                {/* Right Column */}
                <div className="col-md-6">
                  {/* Email */}
                  <div className="d-flex align-items-center bg-light rounded p-3 mb-3">
                    <Mail size={18} className="text-primary mr-4" />
                    <div>
                      <div className="text-muted small">Email</div>
                      <div className="fw-semibold">
                        {user?.email || "john.doe@example.com"}
                      </div>
                    </div>
                  </div>

                  {/* Mobile */}
                  <div className="d-flex align-items-center bg-light rounded p-3 mb-3">
                    <Phone size={18} className="text-primary mr-4" />
                    <div>
                      <div className="text-muted small">Mobile</div>
                      <div className="fw-semibold">
                        {user?.mobile || "+1 (555) 123-4567"}
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="d-flex align-items-center bg-light rounded p-3 mb-3">
                    <MapPin size={18} className="text-primary mr-4" />
                    <div>
                      <div className="text-muted small">Address</div>
                      <div className="fw-semibold">
                        {user?.address ||
                          "123 Business Ave, Suite 101, New York, NY 10001"}
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                </div>
              </div>

              <hr className="my-4" />

              {/* Additional Information */}
              <div className="row mt-4">
                <div className="col-md-6 mb-4">
                  <div className="card shadow-sm border-0 h-100">
                    <div className="card-header bg-light">
                      <h5 className="card-title mb-0">
                        <Calendar size={18} className="mr-2 text-primary" />
                        Employment Details
                      </h5>
                    </div>
                    <div className="card-body">
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item d-flex justify-content-between">
                          <span>Join Date:</span>
                          <span>{user?.createdAt || "2025-03-30"}</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between">
                          <span>Employee ID:</span>
                          <span>{user?.employeeId || "EMP-002"}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="col-md-6 mb-4">
                  <div className="card shadow-sm border-0 h-100">
                    <div className="card-header bg-light">
                      <h5 className="card-title mb-0">
                        <CreditCard size={18} className="mr-2 text-primary" />
                        System Access
                      </h5>
                    </div>
                    <div className="card-body">
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item d-flex justify-content-between">
                          <span>Last Login:</span>
                          <span>{user?.lastLogin || "12:12:40 PM"}</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between">
                          <span>Account Created:</span>
                          <span>{user?.createdAt || "2025-04-12"}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex justify-content-end gap-3 mt-4"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Employee;
