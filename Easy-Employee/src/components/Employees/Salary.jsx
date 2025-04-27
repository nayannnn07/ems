import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { viewEmployeeSalary } from "../../http";
import { toast } from "react-toastify";
import Loading from "../Loading";
import jsPDF from "jspdf";
import { generateSalarySlipPDF } from "../Admin/generateSalarySlipPDF"; 

const Salary = () => {
  const { user } = useSelector((state) => state.authSlice);
  const [salaryData, setSalaryData] = useState([]);
  const [filteredSalary, setFilteredSalary] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Default to current month

  useEffect(() => {
    const obj = { employeeID: user.id };
    const fetchData = async () => {
      try {
        const res = await viewEmployeeSalary(obj);
        const { data } = res;
        if (data.length > 0) {
          setSalaryData(data);
        } else {
          toast.error(`${user.name}'s Salary not found`);
        }
      } catch (error) {
        toast.error("Failed to fetch salary details");
      }
    };
    fetchData();
  }, [user.id]);

  useEffect(() => {
    filterSalaryByMonth(selectedMonth);
  }, [salaryData, selectedMonth]);

  const filterSalaryByMonth = (month) => {
    const filtered = salaryData.find((salary) => {
      const date = new Date(salary.assignedDate);
      return date.getMonth() + 1 === parseInt(month);
    });
    setFilteredSalary(filtered || null);
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(parseInt(e.target.value));
  };

  const downloadSalarySlip = () => {
    if (filteredSalary) {
      const doc = generateSalarySlipPDF(user, filteredSalary);
      doc.save("salary_slip.pdf");
    }
  };

  const monthOptions = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  return (
    <>
      {salaryData.length === 0 ? (
        <Loading />
      ) : (
        <div className="main-content">
          <section className="section">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
              <h4>
  Salary Details for {monthOptions.find((m) => m.value === selectedMonth)?.label} {new Date().getFullYear()}
</h4>

                <select
                  value={selectedMonth}
                  onChange={handleMonthChange}
                  className="form-select w-auto"
                >
                  {monthOptions.map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {filteredSalary ? (
              <div className="card mt-3">
                <div className="card-body row">
                  <div className="col-md-9">
                    <table className="table">
                      <tbody>
                        <tr>
                          <th>Name</th>
                          <td>{user.name}</td>
                        </tr>
                        <tr>
                          <th>Email</th>
                          <td>{user.email}</td>
                        </tr>
                        <tr>
                          <th>Mobile</th>
                          <td>{user.mobile}</td>
                        </tr>
                        <tr>
                          <th>Address</th>
                          <td>{user.address}</td>
                        </tr>
                        <tr>
                          <th>Gross Salary</th>
                          <td> Rs. {filteredSalary?.grossSalary}</td>
                        </tr>
                        <tr>
                          <th>Bonus</th>
                          <td> Rs. {filteredSalary?.bonus}</td>
                        </tr>
                        <tr>
                          <th>Reason for Bonus</th>
                          <td>{filteredSalary?.reasonForBonus}</td>
                        </tr>
                        <tr>
                          <th>Basic Salary</th>
                          <td> Rs. {filteredSalary?.basicSalary}</td>
                        </tr>
                        <tr>
                          <th>Dearness Allowance</th>
                          <td> Rs. {filteredSalary?.dearnessAllowance}</td>
                        </tr>
                        <tr>
                          <th>Provident Fund</th>
                          <td> Rs. {filteredSalary?.providentFund}</td>
                        </tr>
                        <tr>
                          <th>Social Security Fund</th>
                          <td> Rs. {filteredSalary?.socialSecurityFund}</td>
                        </tr>
                        <tr>
                          <th>Total Deduction</th>
                          <td> Rs. {filteredSalary?.totalDeductions}</td>
                        </tr>
                        <tr>
                          <th>Net Salary</th>
                          <td> Rs. {filteredSalary?.netSalary}</td>
                        </tr>
                      </tbody>
                    </table>

                    <button
                      onClick={downloadSalarySlip}
                      className="btn btn-success mt-4"
                      style={{
                        width: "220px",
                        fontWeight: "600",
                        padding: "10px 20px",
                        borderRadius: "8px",
                        fontSize: "14px",
                        gap: "8px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                        transition: "all 0.3s ease",
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = "#218838";
                        e.currentTarget.style.transform = "scale(1.05)";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = "#28a745";
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    >
                      <i className="fas fa-download"></i> &nbsp; Download Salary Slip
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card mt-3">
                <div className="card-body text-center">
                  <h5>No Records Found for Selected Month</h5>
                </div>
              </div>
            )}
          </section>
        </div>
      )}
    </>
  );
};

export default Salary;
