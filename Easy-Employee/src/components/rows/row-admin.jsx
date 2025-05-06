import { NavLink } from "react-router-dom";

const RowAdmin = ({ index, data }) => {
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
        <NavLink to={`/admin/${data.id}`} className="btn btn-primary">
          Detail
        </NavLink>
      </td>
    </tr>
  );
};

export default RowAdmin;
