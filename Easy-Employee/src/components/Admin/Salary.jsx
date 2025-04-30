import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import {
  getEmployee,
  getLeader,
  updateSalary,
  viewAllSalaries,
} from "../../http";
import { toast } from "react-toastify";
import Loading from "../Loading";
import HeaderSection from "../../components/HeaderSection";
import "jspdf-autotable";
import { generateSalarySlipPDF } from "./generateSalarySlipPDF"; // Adjust the import path if necessary

const SalaryView = () => {
  const { id } = useParams();
  const history = useHistory();
  const [salary, setSalary] = useState();
  const [employee, setEmployee] = useState();

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const obj = { _id: id };
        const res = await viewAllSalaries(obj);
        const empRes = await getEmployee(res.data[0].employeeID);
        const leaderRes = await getLeader(res.data[0].employeeID);

        if (empRes.success) setEmployee(empRes.data);
        if (leaderRes.success) setEmployee(leaderRes.data);

        setSalary(res.data[0]);

        setFormData({
          grossSalary: res.data[0].grossSalary || "",
          bonus: res.data[0].bonus || "",
          reasonForBonus: res.data[0].reasonForBonus || "",
          basicSalary: res.data[0].basicSalary || "",
          dearnessAllowance: res.data[0].dearnessAllowance || "",
          providentFund: res.data[0].providentFund || "",
          socialSecurityFund: res.data[0].socialSecurityFund || "",
          totalDeductions: res.data[0].totalDeductions || "",
          netSalary: res.data[0].netSalary || "",
        });
      } catch (err) {
        toast.error("Failed to fetch salary details");
      }
    };

    fetchData();
  }, [id]);

  const inputEvent = (e) => {
    const { name, value } = e.target;
    setFormData((old) => {
      const updatedFormData = { ...old, [name]: value };

      if (name === "grossSalary" || name === "bonus") {
        const grossSalary = parseFloat(updatedFormData.grossSalary) || 0;
        const bonus = parseFloat(updatedFormData.bonus) || 0;

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
    const {
      grossSalary,
      bonus,
      reasonForBonus,
      basicSalary,
      dearnessAllowance,
      providentFund,
      socialSecurityFund,
      totalDeductions,
      netSalary,
    } = formData;

    if (!grossSalary || !bonus || !reasonForBonus) {
      return toast.error("All fields are required");
    }

    const formPayload = {
      grossSalary,
      bonus,
      reasonForBonus,
      basicSalary,
      dearnessAllowance,
      providentFund,
      socialSecurityFund,
      totalDeductions,
      netSalary,
      employeeID: employee?.id,
      assignedDate: new Date().toISOString().split("T")[0],
    };

    try {
      const res = await updateSalary(formPayload);
      if (res.success) {
        toast.success("Salary Updated!");
      } else {
        toast.error("Failed to update salary");
      }
      setFormData(initialState);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  const downloadSalarySlip = () => {
    // Call the generateSalarySlipPDF function to get the jsPDF document
    const doc = generateSalarySlipPDF(employee, salary);

    // Save the generated PDF
    doc.save("salary_slip.pdf");
  };

  return (
    <>
      {employee ? (
        <div className="main-content">
          <section className="section">
            <HeaderSection title="Salary Details" />
            <div className="card"></div>
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="text-primary mb-0 ml-4">
                <i
                  className="fas fa-user-circle mr-2"
                  style={{ fontSize: "20px" }}
                ></i>
                Employee Details
              </h5>
              <button
                className="btn btn-light btn-sm mx-5"
                onClick={() => history.push("/salaries")}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="card-body pr-5 pl-5 m-1">
              <div className="mb-5">
                <div class="container-fluid">
                  <div className="row">
                    {/* Left Column */}
                    <div className="col-md-6">
                      {/* Name */}
                      <div className="d-flex align-items-center bg-light rounded p-3 mb-3">
                        <i
                          className="fas fa-user text-primary mr-4"
                          style={{ fontSize: "1.25rem" }}
                        ></i>
                        <div className="d-flex align-items-center">
                          <div className="fw-semibold">
                            Name: {employee?.name || "-"}
                          </div>
                        </div>
                      </div>

                      {/* Role */}
                      <div className="d-flex align-items-center bg-light rounded p-3 mb-3">
                        <i
                          className="fas fa-id-badge text-primary mr-4"
                          style={{ fontSize: "1.25rem" }}
                        ></i>
                        <div className="d-flex align-items-center">
                          <div className="fw-semibold">
                            Role: {employee?.type || "-"}
                          </div>
                        </div>
                      </div>

                      {/* Gross Salary */}
                      <div className="d-flex align-items-center bg-light rounded p-3 mb-3">
                        <i
                          className="fas fa-money-bill-alt text-primary mr-4"
                          style={{ fontSize: "1.25rem" }}
                        ></i>
                        <div className="d-flex align-items-center">
                          <div className="fw-semibold">
                            Gross Salary: Rs. {salary?.grossSalary || "-"}
                          </div>
                        </div>
                      </div>

                      {/* Bonus */}
                      <div className="d-flex align-items-center bg-light rounded p-3 mb-3">
                        <i
                          className="fas fa-gift text-primary mr-4"
                          style={{ fontSize: "1.25rem" }}
                        ></i>
                        <div className="d-flex align-items-center">
                          <div className="fw-semibold">
                            Bonus: Rs. {salary?.bonus || "-"}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="col-md-6">
                      {/* Email */}
                      <div className="d-flex align-items-center bg-light rounded p-3 mb-3">
                        <i
                          className="fas fa-envelope text-primary mr-4"
                          style={{ fontSize: "1.25rem" }}
                        ></i>
                        <div className="d-flex align-items-center">
                          <div className="fw-semibold">
                            Email: {employee?.email || "-"}
                          </div>
                        </div>
                      </div>

                      {/* Mobile Number */}
                      <div className="d-flex align-items-center bg-light rounded p-3 mb-3">
                        <i
                          className="fas fa-phone text-primary mr-4"
                          style={{ fontSize: "1.25rem" }}
                        ></i>
                        <div className="d-flex align-items-center">
                          <div className="fw-semibold">
                            Mobile: {employee?.mobile || "-"}
                          </div>
                        </div>
                      </div>

                      {/* Assigned Date */}
                      <div className="d-flex align-items-center bg-light rounded p-3 mb-3">
                        <i
                          className="fas fa-calendar-alt text-primary mr-4"
                          style={{ fontSize: "1.25rem" }}
                        ></i>
                        <div className="d-flex align-items-center">
                          <div className="fw-semibold">
                            Assigned Date: {salary?.assignedDate || "-"}
                          </div>
                        </div>
                      </div>

                      {/* Reason for Bonus */}
                      <div className="d-flex align-items-center bg-light rounded p-3 mb-3">
                        <i
                          className="fas fa-info-circle text-primary mr-4"
                          style={{ fontSize: "1.25rem" }}
                        ></i>
                        <div className="d-flex align-items-center">
                          <div className="fw-semibold">
                            Reason: {salary?.reasonForBonus || "-"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <hr />

                  {/* Salary Breakdown */}
                  <div className="row mt-4">
                    <div className="col-md-6 mb-4">
                      <div className="card shadow-sm border-0 h-100">
                        <div className="card-body">
                          <h5 className="card-title text-success mb-4">
                            <i className="fas fa-arrow-up mr-2"></i>Earnings
                          </h5>
                          <ul className="list-group list-group-flush">
                            <li className="list-group-item d-flex justify-content-between">
                              <span>
                                <strong>Basic Salary:</strong>
                              </span>
                              <span>Rs. {salary?.basicSalary || "-"}</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between">
                              <span>
                                <strong>Dearness Allowance:</strong>
                              </span>
                              <span>
                                Rs. {salary?.dearnessAllowance || "-"}
                              </span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between">
                              <span>
                                <strong>Bonus:</strong>
                              </span>
                              <span>Rs. {salary?.bonus || "-"}</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6 mb-4">
                      <div className="card shadow-sm border-0 h-100">
                        <div className="card-body">
                          <h5 className="card-title text-danger mb-4">
                            <i className="fas fa-arrow-down mr-2"></i>Deductions
                          </h5>
                          <ul className="list-group list-group-flush">
                            <li className="list-group-item d-flex justify-content-between">
                              <span>
                                <strong>Provident Fund:</strong>
                              </span>
                              <span>Rs. {salary?.providentFund || "-"}</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between">
                              <span>
                                <strong>Social Security Fund:</strong>
                              </span>
                              <span>
                                Rs. {salary?.socialSecurityFund || "-"}
                              </span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between bg-light">
                              <span>
                                <strong>Total Deductions:</strong>
                              </span>
                              <span>Rs. {salary?.totalDeductions || "-"}</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-12 mb-4">
                      <div className="card shadow-sm border-success border-2">
                        <div className="card-body text-center">
                          <h4 className="text-success mb-3">
                            <strong>Net Pay</strong>
                          </h4>
                          <h3 className="text-dark">
                            Rs. {salary?.netSalary || "-"}
                          </h3>

                          {/* Download Salary Slip Button */}
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
                              e.currentTarget.style.backgroundColor = "#218838"; // darken green on hover
                              e.currentTarget.style.transform = "scale(1.05)";
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.backgroundColor = "#28a745"; // normal green
                              e.currentTarget.style.transform = "scale(1)";
                            }}
                          >
                            <i className="fas fa-download"></i>
                            &nbsp; Download Salary Slip
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <hr />
                </div>

                <h5 className="text-primary my-4">
                  <i
                    className="fas fa-edit mr-2"
                    style={{ fontSize: "20px" }}
                  ></i>
                  Update Salary for {employee?.name}
                </h5>

                <form className="row" onSubmit={onSubmit} id="updateSalaryForm">
                  {/* Gross Salary */}
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

                  {/* Bonus */}
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

                  {/* Reason for Bonus */}
                  <div className="form-group col-md-12">
                    <label>Enter Reason for Bonus</label>
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
                        placeholder="e.g. Performance Bonus"
                      />
                    </div>
                  </div>

                  {/* Calculated Fields */}
                  {[
                    ["Basic Salary (60%)", "basicSalary"],
                    ["Dearness Allowance (20%)", "dearnessAllowance"],
                    ["Provident Fund (10%)", "providentFund"],
                    ["Social Security Fund (11%)", "socialSecurityFund"],
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
                      Update Salary
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </section>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default SalaryView;
