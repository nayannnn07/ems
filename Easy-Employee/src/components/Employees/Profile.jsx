import React from "react";
import { useSelector } from "react-redux";
import {
  User,
  Mail,
  Phone,
  Badge,
  MapPin,
  Edit,
  Download,
  AtSign,
  Calendar,
  Shield,
  CreditCard,
} from "lucide-react";
import HeaderSection from "../../components/HeaderSection";

const Employee = () => {
  const { user } = useSelector((state) => state.authSlice);

  const StatusBadge = ({ status }) => {
    const getStatusColor = () => {
      switch (status?.toLowerCase()) {
        case "active":
          return "bg-green-100 text-green-800";
        case "inactive":
          return "bg-red-100 text-red-800";
        case "pending":
          return "bg-yellow-100 text-yellow-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="main-content">
      <section className="section">
        <HeaderSection title="Employee Profile" />

        <div className="card shadow-sm border-0">
          <div className="card-body p-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="text-primary mb-0">
                <User size={20} className="mr-2" />
                Employee Details
              </h5>
              <button className="btn btn-light btn-sm">
                <Edit size={16} />
              </button>
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
                    <AtSign size={18} className="text-primary mr-4" />
                    <div>
                      <div className="text-muted small">Username</div>
                      <div className="fw-semibold">
                        {user?.username || "johndoe"}
                      </div>
                    </div>
                  </div>

                  {/* Role */}
                  <div className="d-flex align-items-center bg-light rounded p-3 mb-3">
                    <Shield size={18} className="text-primary mr-4" />
                    <div>
                      <div className="text-muted small">User Role</div>
                      <div className="fw-semibold">
                        {user?.type || "Employee"}
                      </div>
                    </div>
                  </div>

                  {/* Department */}
                  <div className="d-flex align-items-center bg-light rounded p-3 mb-3">
                    <Badge size={18} className="text-primary mr-4" />
                    <div>
                      <div className="text-muted small">Department</div>
                      <div className="fw-semibold">
                        {user?.department || "Engineering"}
                      </div>
                    </div>
                  </div>
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
                  <div className="d-flex align-items-center bg-light rounded p-3 mb-3">
                    <Shield size={18} className="text-primary mr-4" />
                    <div>
                      <div className="text-muted small">Status</div>
                      <div className="fw-semibold">
                        <StatusBadge status={user?.status || "Active"} />
                      </div>
                    </div>
                  </div>
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
                          <span>{user?.joinDate || "Jan 15, 2022"}</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between">
                          <span>Employee ID:</span>
                          <span>{user?.employeeId || "EMP-001"}</span>
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
                          <span>{user?.lastLogin || "Today, 10:30 AM"}</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between">
                          <span>Account Created:</span>
                          <span>{user?.createdAt || "Jan 15, 2022"}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex justify-content-end gap-3 mt-4">
                <button className="btn btn-primary">
                  <Mail size={16} className="mr-2" />
                  Contact
                </button>
                <button className="btn btn-primary">
                  <Edit size={16} className="mr-2" />
                  Edit Profile
                </button>
                <button className="btn btn-primary">
                  <Download size={16} className="mr-2" />
                  Export Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Employee;
