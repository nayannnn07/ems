import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

const RowEmployee = ({ index, data }) => {
  const { user } = useSelector((state) => state.authSlice); // Get user from Redux store
  console.log(user);

  return (
    <tr>
      <td>{index}</td>
      {/* Removed image column */}
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

      {/* Team column for Admin */}
      {user.type === "Admin" && (
        <td>
          {data.team ? (
            <NavLink
              to={`/team/${data.team.id}`}
              className="badge badge-primary"
            >
              {data.team.name}
            </NavLink>
          ) : (
            <div className="badge badge-light">No Team</div>
          )}
        </td>
      )}

      {/* Detail Button for Admin */}
      {user.type === "Admin" && (
        <td>
          <NavLink to={`/employee/${data.id}`} className="btn btn-primary">
            Detail
          </NavLink>
        </td>
      )}
    </tr>
  );
};

export default RowEmployee;
