import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import CountsCard from "../../../components/dashboard/CountsCard";
import RowMember from "../../../components/rows/row-member";
import {
  getFreeEmployees,
  getTeam,
  getTeamMembers,
  getFreeLeaders,
} from "../../../http";
import { useDispatch, useSelector } from "react-redux";
import { setTeam, setTeamInformation } from "../../../store/team-slice";
import {
  setFreeEmployees,
  setTeamMembers,
  setFreeLeaders,
} from "../../../store/user-slice";
import LeaderModal from "./modal/LeaderModal";
import LeadersModal from "./modal/LeadersModal";
import MembersModal from "./modal/MembersModal";
import { Users, User, Mail, Phone, Shield, Edit, Plus } from "lucide-react";
import HeaderSection from "../../../components/HeaderSection";

const Team = () => {
  const dispatch = useDispatch();
  const { team } = useSelector((state) => state.teamSlice);
  const { teamMembers } = useSelector((state) => state.userSlice);

  const [loading, setLoading] = useState(true);
  const [freeApiCalled, setFreeApiCalled] = useState(false);
  const [freeLeaderCalled, setFreeLeaderApiCalled] = useState(false);
  const [membersLoading, setMembersLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showLeaderModal, setShowLeaderModal] = useState(false);
  const [showLeadersModal, setShowLeadersModal] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    (async () => {
      const res = await getTeam(id);
      if (res.success) {
        dispatch(setTeam(res.data));
        dispatch(setTeamInformation(res.data.information));
        setLoading(false);
      }
      const res1 = await getTeamMembers(id);
      if (res1.success) {
        dispatch(setTeamMembers(res1.data));
        setMembersLoading(false);
      }
    })();
  }, [id]);

  const modalAction = async () => {
    setShowModal(!showModal);
    if (!freeApiCalled) {
      const res = await getFreeEmployees();
      if (res.success) {
        dispatch(setFreeEmployees(res.data));
      }
      setFreeApiCalled(true);
    }
  };

  const modalLeadersAction = async () => {
    setShowLeadersModal(!showLeadersModal);
    if (!freeLeaderCalled) {
      const res = await getFreeLeaders();
      if (res.success) {
        dispatch(setFreeLeaders(res.data));
      }
      setFreeLeaderApiCalled(true);
    }
  };

  const modalLeaderAction = () => {
    setShowLeaderModal(!showLeaderModal);
  };

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
    <>
      {showModal && <MembersModal close={modalAction} />}
      {showLeaderModal && <LeaderModal close={modalLeaderAction} />}
      {showLeadersModal && <LeadersModal close={modalLeadersAction} />}

      <div className="main-content">
        <section className="section">
          {team && (
            <>
              <HeaderSection title="Team Details" />

              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="text-primary mb-0">
                  <Users size={20} className="mr-2" />
                  {team.name}
                </h5>
                <div className="d-flex gap-2">
                  <NavLink
                    to={`/editteam/${id}`}
                    className="btn btn-light btn-sm"
                  >
                    <Edit size={16} className="mr-1" />
                    Edit Team
                  </NavLink>
                  <button
                    onClick={modalAction}
                    className="btn btn-primary btn-sm"
                  >
                    <Plus size={16} className="mr-1" />
                    Add Member
                  </button>
                </div>
              </div>

              <div className="row">
                <div className="col-md-3 mb-4">
                  <div className="card shadow-sm border-0 h-100">
                    <div className="card-body text-center">
                      <div className="d-flex justify-content-center mb-3">
                        <div className="bg-primary bg-opacity-10 p-3 rounded-circle">
                          <User size={24} className="text-primary" />
                        </div>
                      </div>
                      <h5 className="mb-1">Total Employees</h5>
                      <h3 className="mb-0">{team.information.employee}</h3>
                    </div>
                  </div>
                </div>

                <div className="col-md-9 mb-4">
                  <div className="card shadow-sm border-0 h-100">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <h6 className="text-muted small">Team Name</h6>
                            <p className="fw-semibold mb-0">{team.name}</p>
                          </div>
                          <div className="mb-3">
                            <h6 className="text-muted small">Description</h6>
                            <p className="fw-semibold mb-0">
                              {team.description || "No description available"}
                            </p>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <h6 className="text-muted small">Team Leader</h6>
                            <div className="fw-semibold">
                              {team.leader ? (
                                <button
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={modalLeaderAction}
                                >
                                  {team.leader.name}
                                </button>
                              ) : (
                                <button
                                  onClick={modalLeadersAction}
                                  className="btn btn-sm btn-outline-secondary"
                                >
                                  Assign Leader
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card shadow-sm border-0 mt-4">
                <div className="card-header bg-white border-bottom">
                  <h5 className="mb-0">
                    <Users size={20} className="mr-2 text-primary" />
                    Team Members
                  </h5>
                </div>
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="bg-light">
                        <tr>
                          <th className="text-center">#</th>
                          <th>
                            <div className="d-flex align-items-center">
                              <User size={16} className="mr-1" />
                              Name
                            </div>
                          </th>
                          <th>
                            <div className="d-flex align-items-center">
                              <Mail size={16} className="mr-1" />
                              Email
                            </div>
                          </th>
                          <th>
                            <div className="d-flex align-items-center">
                              <Phone size={16} className="mr-1" />
                              Mobile
                            </div>
                          </th>
                          <th>
                            <div className="d-flex align-items-center">
                              <Shield size={16} className="mr-1" />
                              Status
                            </div>
                          </th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {membersLoading ? (
                          <tr>
                            <td colSpan="6" className="text-center py-4">
                              <div
                                className="spinner-border text-primary"
                                role="status"
                              >
                                <span className="sr-only">Loading...</span>
                              </div>
                            </td>
                          </tr>
                        ) : teamMembers.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="text-center py-4">
                              No members found in this team
                            </td>
                          </tr>
                        ) : (
                          teamMembers.map((data, index) => (
                            <RowMember
                              key={index}
                              index={index + 1}
                              data={data}
                            />
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </>
  );
};

export default Team;
