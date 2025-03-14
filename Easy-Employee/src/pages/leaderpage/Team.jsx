import { useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import { getTeam } from "../../../http";
import { useDispatch, useSelector } from "react-redux";
import { setTeam } from "../../../store/team-slice";

const Team = () => {
  const dispatch = useDispatch();
  const { team } = useSelector((state) => state.teamSlice);
  const { id } = useParams();

  useEffect(() => {
    (async () => {
      const res = await getTeam(id);
      if (res.success) {
        dispatch(setTeam(res.data));
      }
    })();
  }, [dispatch, id]);

  return (
    <>
      <div className="main-content">
        <section className="section">
          {team && (
            <>
              <div className="section-header d-flex justify-content-between">
                <h1>Team</h1>
                <div>
                  <NavLink
                    to={`/editteam/${id}`}
                    className="btn btn-primary mr-4"
                  >
                    Edit Team
                  </NavLink>
                  <button onClick={modalAction} className="btn btn-primary">
                    Add Member
                  </button>
                </div>
              </div>

              <div className="card">
                <div className="card-body row">
                  <div className="col-md-9">
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
                                style={{ padding: "10px" }}
                              >
                                {team.leader.name}
                              </button>
                            ) : (
                              <button
                                onClick={modalLeadersAction}
                                className="badge badge-light btn"
                                style={{ padding: "10px" }}
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
              </div>
            </>
          )}
        </section>
      </div>
    </>
  );
};

export default Team;
