import { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import { User, Mail, Phone, Badge, MapPin, Edit, Shield } from "lucide-react";
import { getUser } from "../../http";
import HeaderSection from "../../components/HeaderSection";

const Employee = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    mobile: "",
    image: "",
    address: "",
    status: "",
    joinDate: "",
    createdAt: "",
    lastLogin: "",
    employeeId: "",
    type: "",
  });

  const { id } = useParams();

  useEffect(() => {
    (async () => {
      const res = await getUser(id);
      if (res.success) setUser(res.data);
    })();
  }, [id]);

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
        <HeaderSection title="Employee Detail" />

        <div className="card shadow-sm border-0">
          <div className="card-body p-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="text-primary mb-0">
                <User size={20} className="mr-2" />
                Employee Information
              </h5>
              <NavLink
                to={`/edituser/${id}`}
                className="btn btn-light btn-sm d-flex align-items-center gap-1"
              >
                <Edit size={16} />
                <span>Edit</span>
              </NavLink>
            </div>

            <div className="container-fluid">
              <div className="row">
                {/* Left Column */}
                <div className="col-md-6">
                  {/* First Box: Name */}
                  <div className="d-flex align-items-center bg-light rounded p-3 mb-3">
                    <User size={18} className="text-primary mr-4" />
                    <div>
                      <div className="text-muted small">Full Name</div>
                      <div className="fw-semibold">
                        {user?.name || "Employee Name"}
                      </div>
                    </div>
                  </div>

                  {/* Second Box: Role */}
                  <div className="d-flex align-items-center bg-light rounded p-3 mb-3">
                    <Shield size={18} className="text-primary mr-4" />
                    <div>
                      <div className="text-muted small">User Role</div>
                      <div className="fw-semibold">
                        {user?.type || "Employee"}
                      </div>
                    </div>
                  </div>

                  {/* Third Box: Status */}
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

                {/* Right Column */}
                <div className="col-md-6">
                  {/* First Box: Email */}
                  <div className="d-flex align-items-center bg-light rounded p-3 mb-3">
                    <Mail size={18} className="text-primary mr-4" />
                    <div>
                      <div className="text-muted small">Email</div>
                      <div className="fw-semibold">
                        {user?.email || "employee@example.com"}
                      </div>
                    </div>
                  </div>

                  {/* Second Box: Mobile */}
                  <div className="d-flex align-items-center bg-light rounded p-3 mb-3">
                    <Phone size={18} className="text-primary mr-4" />
                    <div>
                      <div className="text-muted small">Mobile</div>
                      <div className="fw-semibold">{user?.mobile || "N/A"}</div>
                    </div>
                  </div>

                  {/* Third Box: Address */}
                  <div className="d-flex align-items-center bg-light rounded p-3 mb-3">
                    <MapPin size={18} className="text-primary mr-4" />
                    <div>
                      <div className="text-muted small">Address</div>
                      <div className="fw-semibold">
                        {user?.address || "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons (Optional Placeholder) */}
              <div className="d-flex justify-content-end gap-3 mt-4"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Employee;
