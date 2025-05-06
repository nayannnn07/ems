import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { viewEmployeeSalary } from "../../http";
import { toast } from "react-toastify";
import Loading from "../Loading";
import { generateSalarySlipPDF } from "../Admin/generateSalarySlipPDF";

const Salary = () => {
  const { user } = useSelector((state) => state.authSlice);
  const [salaryData, setSalaryData] = useState([]);
  const [filteredSalary, setFilteredSalary] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const obj = { employeeID: user.id };
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await viewEmployeeSalary(obj);
        const { data } = res;
        if (data.length > 0) {
          setSalaryData(data);
        } else {
          toast.error(`${user.name}'s salary records not found`, {
            position: "top-right",
            autoClose: 3000,
          });
        }
      } catch (error) {
        toast.error("Failed to fetch salary details", {
          position: "top-right",
          autoClose: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user.id, user.name]);

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
      toast.info("Generating salary slip...", {
        position: "top-right",
        autoClose: 2000,
      });
      const doc = generateSalarySlipPDF(user, filteredSalary);
      doc.save(
        `salary_slip_${
          monthOptions.find((m) => m.value === selectedMonth)?.label
        }_${new Date().getFullYear()}.pdf`
      );
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

  if (isLoading) return <Loading />;

  return (
    <div className="main-content">
      <section className="section">
        <div className="card shadow-sm border-0">
          <div className="card-header bg-gradient-primary text-white py-4 d-flex justify-content-between align-items-center">
            <h4 style={{ fontSize: "24px", fontWeight: 700 }}>
              Salary Details
            </h4>

            <div className="d-flex align-items-center">
              <label htmlFor="monthSelector" className="text-white me-2 mb-0">
                Select Month:
              </label>
              <select
                id="monthSelector"
                value={selectedMonth}
                onChange={handleMonthChange}
                className="form-select shadow-sm border-0"
                style={{ borderRadius: "8px", minWidth: "150px" }}
              >
                {monthOptions.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label} {new Date().getFullYear()}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {filteredSalary ? (
          <div className="row mt-4">
            <div className="col-md-4 mb-4">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-header bg-light py-3">
                  <h5 className="mb-0">Employee Information</h5>
                </div>
                <div className="card-body">
                  <div className="text-center mb-3">
                    <div
                      className="d-flex justify-content-center align-items-center"
                      style={{ height: "100px" }}
                    >
                      <div
                        className="rounded-circle d-flex justify-content-center align-items-center"
                        style={{
                          width: "70px", // Slightly increased width for better visibility
                          height: "70px", // Increased height for better visibility
                          backgroundColor: "#1c144c", // A more vibrant primary color background
                          color: "#fff", // White text color for contrast
                          fontSize: "2rem", // Larger font size for better visibility
                          fontWeight: "600", // Semi-bold text for emphasis
                          boxShadow: "0 6px 15px rgba(0, 0, 0, 0.1)", // Soft shadow for depth
                          border: "2px solid #fff", // White border for a clean look
                        }}
                      >
                        <span style={{ lineHeight: "1" }}>
                          {user.name.charAt(0)}
                        </span>
                      </div>
                    </div>

                    <h5 className="mb-1">{user.name}</h5>
                  </div>

                  <div className="employee-details">
  <div className="detail-item d-flex py-3 border-bottom my-3" style={{ padding: "12px 20px", borderBottom: "1px solid #e0e0e0", borderRadius: "8px", transition: "all 0.3s ease", boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)", alignItems: "center" }}>
    <div className="icon me-4 mr-4" style={{ width: "40px", height: "40px", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#f2f2f2", borderRadius: "50%" }}>
      <i className="fas fa-envelope text-primary" style={{ fontSize: "20px" }}></i>
    </div>
    <div className="d-flex flex-column w-100">
      <div className="small text-muted" style={{ fontSize: "14px", color: "#888" }}>Email</div>
      <div className="fw-bold" style={{ fontSize: "16px", color: "#333" }}>{user.email}</div>
    </div>
  </div>

  <div className="detail-item d-flex py-3 border-bottom my-3" style={{ padding: "12px 20px", borderBottom: "1px solid #e0e0e0", borderRadius: "8px", transition: "all 0.3s ease", boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)", alignItems: "center" }}>
    <div className="icon me-4 mr-4" style={{ width: "40px", height: "40px", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#f2f2f2", borderRadius: "50%" }}>
      <i className="fas fa-phone text-primary" style={{ fontSize: "20px" }}></i>
    </div>
    <div className="d-flex flex-column w-100">
      <div className="small text-muted" style={{ fontSize: "14px", color: "#888" }}>Mobile</div>
      <div className="fw-bold" style={{ fontSize: "16px", color: "#333" }}>{user.mobile}</div>
    </div>
  </div>

  <div className="detail-item d-flex py-3 my-3" style={{ padding: "12px 20px", borderRadius: "8px", transition: "all 0.3s ease", boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)", alignItems: "center" }}>
    <div className="icon me-4 mr-4" style={{ width: "40px", height: "40px", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#f2f2f2", borderRadius: "50%" }}>
      <i className="fas fa-map-marker-alt text-primary" style={{ fontSize: "20px" }}></i>
    </div>
    <div className="d-flex flex-column w-100">
      <div className="small text-muted" style={{ fontSize: "14px", color: "#888" }}>Address</div>
      <div className="fw-bold" style={{ fontSize: "16px", color: "#333" }}>{user.address}</div>
    </div>
  </div>
</div>

                </div>
              </div>
            </div>

            <div className="col-md-8">
              <div className="card shadow-sm border-0">
                <div className="card-header bg-light py-3">
                  <h5 className="mb-0">
                    Salary Breakdown -{" "}
                    {monthOptions.find((m) => m.value === selectedMonth)?.label}{" "}
                    {new Date().getFullYear()}
                  </h5>
                </div>
                <div className="card-body">
                  <div className="row mb-4">
                    <div className="col-md-4">
                      <div className="card bg-success text-white">
                        <div className="card-body text-center p-3">
                          <h6 className="small text-white-50 mb-2">
                            Net Salary
                          </h6>
                          <h4 className="mb-0">
                            Rs. {filteredSalary?.netSalary.toLocaleString()}
                          </h4>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="card bg-primary text-white">
                        <div className="card-body text-center p-3">
                          <h6 className="small text-white-50 mb-2">
                            Gross Salary
                          </h6>
                          <h4 className="mb-0">
                            Rs. {filteredSalary?.grossSalary.toLocaleString()}
                          </h4>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="card bg-danger text-white">
                        <div className="card-body text-center p-3">
                          <h6 className="small text-white-50 mb-2">
                            Deductions
                          </h6>
                          <h4 className="mb-0">
                            Rs.{" "}
                            {filteredSalary?.totalDeductions.toLocaleString()}
                          </h4>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="card border shadow-sm mb-3">
                        <div className="card-header bg-light py-2">
                          <h6 className="mb-0">Earnings</h6>
                        </div>
                        <div className="card-body p-0">
                          <table className="table table-hover mb-0">
                            <tbody>
                              <tr>
                                <td className="ps-3">Basic Salary</td>
                                <td className="text-end pe-3">
                                  Rs.{" "}
                                  {filteredSalary?.basicSalary.toLocaleString()}
                                </td>
                              </tr>
                              <tr>
                                <td className="ps-3">Dearness Allowance</td>
                                <td className="text-end pe-3">
                                  Rs.{" "}
                                  {filteredSalary?.dearnessAllowance.toLocaleString()}
                                </td>
                              </tr>
                              <tr>
                                <td className="ps-3">Bonus</td>
                                <td className="text-end pe-3">
                                  Rs. {filteredSalary?.bonus.toLocaleString()}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="card border shadow-sm mb-3">
                        <div className="card-header bg-light py-2">
                          <h6 className="mb-0">Deductions</h6>
                        </div>
                        <div className="card-body p-0">
                          <table className="table table-hover mb-0">
                            <tbody>
                              <tr>
                                <td className="ps-3">Provident Fund</td>
                                <td className="text-end pe-3">
                                  Rs.{" "}
                                  {filteredSalary?.providentFund.toLocaleString()}
                                </td>
                              </tr>
                              <tr>
                                <td className="ps-3">Social Security Fund</td>
                                <td className="text-end pe-3">
                                  Rs.{" "}
                                  {filteredSalary?.socialSecurityFund.toLocaleString()}
                                </td>
                              </tr>
                              <tr className="table-light">
                                <td className="ps-3 fw-bold">
                                  Total Deductions
                                </td>
                                <td className="text-end pe-3 fw-bold">
                                  Rs.{" "}
                                  {filteredSalary?.totalDeductions.toLocaleString()}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-center mt-3">
                    <button
                      onClick={downloadSalarySlip}
                      className="btn btn-success px-4 py-2"
                      style={{
                        borderRadius: "8px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        transition: "all 0.3s ease",
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow =
                          "0 6px 12px rgba(0, 0, 0, 0.15)";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow =
                          "0 4px 8px rgba(0, 0, 0, 0.1)";
                      }}
                    >
                      <i className="fas fa-download me-2"></i>
                      &nbsp;Download Salary Slip
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="card mt-4 shadow-sm border-0">
            <div className="card-body text-center py-5">
              <div className="mb-3">
                <i className="fas fa-search text-muted fa-3x"></i>
              </div>
              <h5>No Salary Record Found</h5>
              <p className="text-muted">
                There is no salary information available for{" "}
                {monthOptions.find((m) => m.value === selectedMonth)?.label}{" "}
                {new Date().getFullYear()}
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Salary;
