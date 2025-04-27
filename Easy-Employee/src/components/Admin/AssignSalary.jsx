import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import HeaderSection from "../../components/HeaderSection";
import {
  assignSalary,
  getEmployees,
  getLeaders,
  viewAllSalaries,
} from "../../http";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from "react-redux";

const AssignSalary = () => {
  const initialState = {
    grossSalary: "",
    bonus: "",
    reasonForBonus: "",
    basicSalary: "",
    dearnessAllowance: "",
    providentFund: "",
    socialSecurityFund: "",
    totalDeductions: "",
    netSalary: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [employees, setEmployees] = useState([]);
  const [salaryAssignedIds, setSalaryAssignedIds] = useState([]);

  const currentMonthName = new Date().toLocaleString("default", {
    month: "long",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [emps, leaders, salaries] = await Promise.all([
          getEmployees(),
          getLeaders(),
          viewAllSalaries(),
        ]);

        const allEmployees = [...emps.data, ...leaders.data];
        const currentMonth = new Date().getMonth();

        const assignedIDs = salaries.data
          .filter((sal) => {
            const assignedMonth = new Date(sal.assignedDate).getMonth();
            return assignedMonth === currentMonth;
          })
          .map((sal) => sal.employeeID);

        setEmployees(allEmployees);
        setSalaryAssignedIds(assignedIDs);
      } catch (error) {
        toast.error("Failed to fetch data");
      }
    };

    fetchData();
  }, []);

  const inputEvent = (e) => {
    const { name, value } = e.target;
    setFormData((old) => {
      const updatedFormData = {
        ...old,
        [name]: value,
      };

      if (name === "grossSalary" || name === "bonus") {
        const grossSalary = parseFloat(updatedFormData.grossSalary);
        const bonus = parseFloat(updatedFormData.bonus || 0);

        const basicSalary = +(grossSalary * 0.6).toFixed(2);
        const dearnessAllowance = +(grossSalary * 0.2).toFixed(2);
        const providentFund = +(basicSalary * 0.1).toFixed(2);
        const socialSecurityFund = +(basicSalary * 0.11).toFixed(2);
        const totalDeductions = +(providentFund + socialSecurityFund).toFixed(
          2
        );
        const netSalary = +(grossSalary + bonus - totalDeductions).toFixed(2);

        return {
          ...updatedFormData,
          basicSalary,
          dearnessAllowance,
          providentFund,
          socialSecurityFund,
          totalDeductions,
          netSalary,
        };
      }

      return updatedFormData;
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const { grossSalary, bonus, reasonForBonus } = formData;

    if (!grossSalary || !bonus || !reasonForBonus || !selectedEmployee) {
      return toast.error("All Fields are Required");
    }

    if (salaryAssignedIds.includes(selectedEmployee)) {
      return toast.warning(
        "This employee's salary has already been assigned for this month."
      );
    }

    const formPayload = {
      ...formData,
      employeeID: selectedEmployee,
    };

    try {
      const res = await assignSalary(formPayload);
      const { success, error } = res;

      if (success) {
        toast.success("Salary Assigned!");
        setFormData(initialState);
        setSelectedEmployee("");
        setSalaryAssignedIds((prev) => [...prev, selectedEmployee]);
      } else if (error?.message?.includes("Salary already assigned")) {
        toast.warning(
          "This employee's salary has already been assigned for this month."
        );
      } else {
        toast.error("Failed to assign salary. Please try again.");
      }
    } catch (err) {
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="main-content">
      <section className="section">
        <HeaderSection title={`Salary for ${currentMonthName}`} />
        <div className="card">
          <div className="card-body pr-5 pl-5 m-1">
            <form className="row" onSubmit={onSubmit} id="addUserForm">
              {/* Employee Selection */}
              <div className="form-group col-md-4">
                <label>Employees</label>
                <select
                  className="form-control select2"
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                >
                  <option value="">Employees</option>
                  {employees?.map((employee) => {
                    const isAssigned = salaryAssignedIds.includes(employee.id);
                    return (
                      <option
                        key={employee.id}
                        value={employee.id}
                        disabled={isAssigned}
                        title={
                          isAssigned
                            ? `Salary assigned for ${currentMonthName}`
                            : ""
                        }
                        style={{
                          color: isAssigned ? "gray" : "black",
                          backgroundColor: isAssigned ? "#f8f9fa" : "white",
                        }}
                      >
                        {employee.name} {isAssigned ? "(Already Assigned)" : ""}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Gross Salary Input */}
              <div className="form-group col-md-4">
                <label>Enter Gross Salary</label>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text bg-light">
                      <i className="fas fa-pen text-primary"></i>
                    </span>
                  </div>
                  <input
                    onChange={inputEvent}
                    value={formData.grossSalary}
                    type="number"
                    id="grossSalary"
                    name="grossSalary"
                    className="form-control"
                    placeholder="e.g. 50000"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Bonus Input */}
              <div className="form-group col-md-4">
                <label>Enter Bonus</label>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text bg-light">
                      <i className="fas fa-pen text-primary"></i>
                    </span>
                  </div>
                  <input
                    onChange={inputEvent}
                    value={formData.bonus}
                    type="number"
                    id="bonus"
                    name="bonus"
                    className="form-control"
                    placeholder="e.g. 3000"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Reason Input */}
              <div className="form-group col-md-12">
                <label>Enter Reason</label>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text bg-light">
                      <i className="fas fa-book text-primary"></i>
                    </span>
                  </div>
                  <input
                    onChange={inputEvent}
                    value={formData.reasonForBonus}
                    type="text"
                    id="reasonForBonus"
                    name="reasonForBonus"
                    className="form-control"
                    placeholder="e.g. Performance bonus"
                  />
                </div>
              </div>

              {/* Calculated Fields */}
              {[
                ["Basic Salary(60%)", "basicSalary"],
                ["Dearness Allowance(20%)", "dearnessAllowance"],
                ["Provident Fund(10%)", "providentFund"],
                ["Social Security Fund(11%)", "socialSecurityFund"],
                ["Total Deductions", "totalDeductions"],
                ["Net Salary", "netSalary"],
              ].map(([label, key], i) => (
                <div className="form-group col-md-4" key={i}>
                  <label>{label}</label>
                  <input
                    type="text"
                    value={formData[key]}
                    disabled
                    className="form-control"
                    style={{
                      backgroundColor: "#f1f3f5",
                      fontWeight: "bold",
                      color: "#495057",
                    }}
                  />
                </div>
              ))}

              {/* Submit Button */}
              <div className="form-group text-center col-md-12">
                <button
                  className="btn btn-primary btn-lg shadow-sm"
                  type="submit"
                  style={{
                    width: "30vh",
                    transition: "0.3s ease",
                    fontWeight: "500",
                  }}
                >
                  Assign Salary
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AssignSalary;
