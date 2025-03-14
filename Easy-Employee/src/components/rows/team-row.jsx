import { NavLink } from "react-router-dom";

const RowTeam = ({ index, data }) => {
  return (
    <tr>
      <td>{index}</td>
      <td>{data.name}</td>
      <td>
        {data.leader ? (
          <NavLink to="/" className="badge badge-primary">
            {data.leader.name}
          </NavLink>
        ) : (
          <div className="badge badge-light">No Leader</div>
        )}
      </td>
      <td>
        <div
          className={`badge ${
            data.status === "Active" ? "badge-primary" : "badge-danger"
          }`}
        >
          {data.status}
        </div>
      </td>
      <td>
        <NavLink to={`/team/${data.id}`} className="btn btn-secondary">
          Detail
        </NavLink>
      </td>
    </tr>
  );
};

export default RowTeam;
