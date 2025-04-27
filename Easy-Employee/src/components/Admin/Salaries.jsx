import React, { useEffect, useState } from "react";
import { getEmployees, getLeaders, viewAllSalaries } from "../../http";
import { useHistory } from "react-router-dom";
import Loading from "../Loading";
import HeaderSection from "../HeaderSection";

const Salaries = () => {
  const history = useHistory();
  const [salaries, setSalaries] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [employeeMap, setEmployeeMap] = useState({});
  const [selectedEmployee, setSelectedEmployee] = useState("");

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [salaryRes, empRes, leaderRes] = await Promise.all([
          viewAllSalaries(),
          getEmployees(),
          getLeaders(),
        ]);

        const allEmployees = [...empRes.data, ...leaderRes.data];
        const map = {};
        allEmployees.forEach((emp) => {
          map[emp.id] = { name: emp.name, email: emp.email };
        });

        setEmployeeMap(map);
        setEmployees(allEmployees);
        setSalaries(salaryRes.data);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchAllData();
  }, []);

  const searchSalary = async () => {
    try {
      const params = selectedEmployee ? { employeeID: selectedEmployee } : {};
      const res = await viewAllSalaries(params);
      setSalaries(res.data);
    } catch (error) {
      console.error("Failed to search salaries", error);
    }
  };

  return (
    <>
      {salaries ? (
        <div className="main-content">
          <section className="section">
            <HeaderSection title="Salaries" />

            <div className="d-flex justify-content-center align-items-center w-100">
              <div className="form-group col-md-6">
                <label>Employee</label>
                <select
                  className="form-control select2"
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                >
                  <option value="">Employees</option>
                  {employees?.map((employee) => (
                    <option key={employee._id} value={employee.id}>
                      {employee.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={searchSalary}
                className="btn btn-lg btn-primary col"
              >
                Search
              </button>
            </div>
          </section>
          <div className="table-responsive">
            <table className="table table-striped table-md text-center">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Salary</th>
                  <th>Bonus</th>
                  <th>Net Salary</th>
                  <th>Assigned Date</th>
                  <th>Action</th> {/* New column for Action */}
                </tr>
              </thead>
              <tbody>
                {salaries.map((salary, idx) => (
                  <tr key={salary._id} className="hover-effect">
                    <td>{idx + 1}</td>
                    <td>{employeeMap[salary.employeeID]?.name || "N/A"}</td>
                    <td>{employeeMap[salary.employeeID]?.email || "N/A"}</td>
                    <td>{salary.grossSalary}</td>
                    <td>{salary.bonus}</td>
                    <td>{salary.netSalary}</td>
                    <td>
                      {new Date(salary.assignedDate).toLocaleDateString()}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm"
                        style={{ backgroundColor: "#1c144c", color: "#fff" }}
                        onClick={() => history.push(`/salary/${salary._id}`)}
                      >
                        <i className="fa fa-info-circle"></i>&nbsp; Details
                      </button>
                    </td>{" "}
                    {/* Edit button */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default Salaries;
