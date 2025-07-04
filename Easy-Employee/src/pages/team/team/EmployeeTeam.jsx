import { useEffect, useState } from "react";
import { NavLink, useParams, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getFreeEmployees,
  getFreeLeaders,
  getEmployeeTeam,
  getEmployeeTeamMembers,
} from "../../../http";
import { setTeam, setTeamInformation } from "../../../store/team-slice";
import {
  setFreeEmployees,
  setTeamMembers,
  setFreeLeaders,
} from "../../../store/user-slice";
import { Users, User, Mail, Phone, Shield, Edit, Plus } from "lucide-react";

import HeaderSection from "../../../components/HeaderSection";
import RowMember from "../../../components/rows/row-member";
import LeaderModal from "./modal/LeaderModal";
import LeadersModal from "./modal/LeadersModal";
import MembersModal from "./modal/MembersModal";

const EmployeeTeam = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const { team } = useSelector((state) => state.teamSlice);
  const { teamMembers } = useSelector((state) => state.userSlice);

  const [loading, setLoading] = useState(true);
  const [freeApiCalled, setFreeApiCalled] = useState(false);
  const [freeLeaderCalled, setFreeLeaderApiCalled] = useState(false);
  const [membersLoading, setMembersLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showLeaderModal, setShowLeaderModal] = useState(false);
  const [showLeadersModal, setShowLeadersModal] = useState(false);
  const history = useHistory();
  const handleClose = () => {
    history.push("/userTeams");
  };

  useEffect(() => {
    (async () => {
      const res = await getEmployeeTeam(id);
      if (res.success) {
        dispatch(setTeam(res.data));
        dispatch(setTeamInformation(res.data.information));
        setLoading(false);
      }
      const res1 = await getEmployeeTeamMembers(id);
      if (res1.success) {
        dispatch(setTeamMembers(res1.data));
        setMembersLoading(false);
      }
    })();
  }, [dispatch, id]);

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

  return (
    <>
      {showModal && <MembersModal close={modalAction} />}
      {showLeaderModal && <LeaderModal close={modalLeaderAction} />}
      {showLeadersModal && <LeadersModal close={modalLeadersAction} />}

      <div className="main-content">
        <section className="section">
          {!loading && team && (
            <>
              <HeaderSection title="Team Details" />

              <div className="d-flex justify-content-between align-items-center mb-4">
                <button
                  className="btn btn-light btn-sm ml-auto"
                  onClick={handleClose}
                  title="Close"
                >
                  <i className="fas fa-times"></i>
                </button>
                {/* <div className="d-flex" style={{ gap: "12px" }}>
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
                </div> */}
              </div>

              <div className="row">
                <div className="col-md-3 mb-4">
                  <div className="card shadow-sm border-0 h-100">
                    <div className="card-body text-center">
                      <div className="d-flex justify-content-center mb-3">
                        <div
                          className="bg-primary bg-opacity-10 p-3 rounded-circle d-flex justify-content-center align-items-center"
                          style={{ width: "70px", height: "70px" }}
                        >
                          <Users
                            size={25}
                            className="mr-2 text-white text-center ml-1"
                          />
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
                            <div className="mb-3">
                              <strong className="text-primary">
                                Team Name:
                              </strong>
                              <span className="ms-2 fs-6"> {team.name}</span>
                            </div>
                          </div>
                          <div className="mb-3">
                            <div className="mb-2">
                              <strong className="text-primary">
                                Description:
                              </strong>
                              <span className="ms-2 fs-6">
                                {team.description || "No description available"}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <h6 className="text-muted small">Team Leader:</h6>
                            <div className="fw-semibold">
                              {team.leader ? (
                                <button
                                  className="btn btn-primary btn-sm"
                                  onClick={modalLeaderAction}
                                >
                                  {team.leader.name}
                                </button>
                              ) : (
                                <button
                                  onClick={modalLeadersAction}
                                  className="btn btn-sm btn-primary"
                                >
                                  <Plus size={14} className="mr-1" />
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
                              key={data.id || index}
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

export default EmployeeTeam;
