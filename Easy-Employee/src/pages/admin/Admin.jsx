import { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import { getUser } from "../../http";
import { User, Mail, Phone, MapPin, Shield, Edit, CircleDot, UserCheck } from "lucide-react";
import HeaderSection from "../../components/HeaderSection";

const Admin = () => {
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
        <HeaderSection title="Admin" />

        <div className="card shadow-sm border-0">
          <div className="card-body p-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="text-primary mb-0">
                <User size={20} className="mr-2" />
                Admin Details
              </h5>
              <NavLink
                to={`/edituser/${id}`}
                className="btn btn-sm d-flex align-items-center gap-2 mr-3 shadow-sm"
                style={{
                  transition: "all 0.3s ease",
                  fontWeight: "500",
                  borderRadius: "6px",
                  backgroundColor: "#e3eaef",
                  color: "#000",
                  padding: "6px 12px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#d4dee5";
                  e.currentTarget.style.transform = "scale(1.03)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 10px rgba(0,0,0,0.1)";
                  e.currentTarget.querySelector("svg").style.color = "#ff9800"; // brighter orange
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#e3eaef";
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow =
                    "0 2px 4px rgba(0,0,0,0.05)";
                  e.currentTarget.querySelector("svg").style.color = "orange";
                }}
              >
                <span>Edit Admin&nbsp;</span>
                <Edit
                  size={16}
                  style={{
                    color: "orange",
                    transition: "color 0.3s ease, transform 0.3s ease",
                  }}
                />
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
                        {user?.name || "Admin Name"}
                      </div>
                    </div>
                  </div>

                  {/* Second Box: Role */}
                  <div className="d-flex align-items-center bg-light rounded p-3 mb-3">
                    <Shield size={18} className="text-primary mr-4" />
                    <div>
                      
                      <div className="text-muted small">Status</div>
                      <div className="fw-semibold">
                        <StatusBadge status={user?.status || "Active"} />
                      </div>
                    </div>
                  </div>

                  {/* Third Box: Status */}
                  <div className="d-flex align-items-center bg-light rounded p-3 mb-3">
                    <UserCheck size={18} className="text-primary mr-4" />
                    <div>
                    <div className="text-muted small">User Role</div>
                    <div className="fw-semibold">{user?.type || "Admin"}</div>
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
                        {user?.email || "admin@example.com"}
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

export default Admin;
