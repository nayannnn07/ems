import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CountsCard from "../../../components/dashboard/CountsCard";
import RowMember from "../../../components/rows/row-member";
import {
  getFreeEmployees,
  getFreeLeaders,
  getEmployeeTeam,
  getEmployeeTeamMembers,
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

const EmployeeTeam = () => {
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
          {team && (
            <>
              <div className="section-header  d-flex justify-content-between">
                <h1>Team</h1>
              </div>
              <div className="row">
                <CountsCard
                  title="Total Employee"
                  icon="fa-user"
                  count={team.information.employee}
                />
                <CountsCard
                  title="Total Employee"
                  icon="fa-user"
                  count={team.information.employee}
                />
                <CountsCard
                  title="Total Employee"
                  icon="fa-user"
                  count={team.information.employee}
                />
                <CountsCard
                  title="Total Employee"
                  icon="fa-user"
                  count={team.information.employee}
                />
              </div>

              <div className="card">
                <div className="card-body">
                  <table className="table">
                    <tbody>
                      <tr>
                        <th>Name</th>
                        <td>{team.name}</td>
                      </tr>
                      <tr>
                        <th>Description</th>
                        <td>{team.description}</td>
                      </tr>
                      <tr>
                        <th>Leader</th>
                        <td>
                          {team.leader ? (
                            <button
                              className="badge btn badge-primary"
                              onClick={modalLeaderAction}
                            >
                              {team.leader.name}
                            </button>
                          ) : (
                            <button
                              onClick={modalLeadersAction}
                              className="badge badge-light btn"
                            >
                              No Leader
                            </button>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {!membersLoading && (
            <div className="card">
              <div className="card-header">
                <h4>All Employees</h4>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-striped table-md center-text">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Mobile</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {!loading &&
                        teamMembers &&
                        teamMembers.map((data, index) => (
                          <RowMember
                            key={index}
                            index={index + 1}
                            data={data}
                          />
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default EmployeeTeam;
