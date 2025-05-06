import { NavLink } from "react-router-dom";

const RowLeader = ({ index, data }) => {
  return (
    <tr>
      <td>{index}</td>
      <td>{data.name}</td>
      <td>{data.email}</td>
      <td>{data.mobile}</td>
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
        {data.team && Object.keys(data.team).length !== 0 ? (
          <NavLink to={`/team/${data.team.id}`} className="badge badge-primary">
            {data.team.name}
          </NavLink>
        ) : (
          <div className="badge badge-light">No Team</div>
        )}
      </td>
      <td>
        <NavLink to={`/employee/${data.id}`} className="btn btn-primary">
          Detail
        </NavLink>
      </td>
    </tr>
  );
};

export default RowLeader;
