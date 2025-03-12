import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { viewEmployeeSalary } from "../../http";
import { toast } from "react-toastify";
import Loading from "../Loading";
import jsPDF from "jspdf";

const Salary = () => {
  const { user } = useSelector((state) => state.authSlice);
  const [salary, setSalary] = useState();

  useEffect(() => {
    const obj = { employeeID: user.id };
    const fetchData = async () => {
      const res = await viewEmployeeSalary(obj);
      const { success, data } = res;
      if (data.length > 0) {
        setSalary(res.data[0]);
      } else {
        toast.error(`${user.name}'s Salary not found`);
      }
    };
    fetchData();
  }, [user.id]);

  const generatePDF = () => {
    if (!salary) return;

    const doc = new jsPDF();

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("WORKSPHERE", 85, 15);
    doc.setFontSize(14);
    doc.text("Salary Receipt", 90, 25);
    doc.setDrawColor(0);
    doc.setLineWidth(1);
    doc.line(10, 30, 200, 30);

    // Employee Details
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setFillColor(230, 230, 230);
    doc.rect(10, 35, 190, 10, "F"); // Background Color
    doc.text("Employee Details", 15, 42);

    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${user.name}`, 15, 50);
    doc.text(`Email: ${user.email}`, 15, 58);
    doc.text(`Mobile: ${user.mobile}`, 15, 66);
    doc.text(`Address: ${user.address}`, 15, 74);

    // Salary Breakdown
    doc.setFont("helvetica", "bold");
    doc.setFillColor(230, 230, 230);
    doc.rect(10, 80, 190, 10, "F");
    doc.text("Salary Breakdown", 15, 87);

    doc.setFont("helvetica", "normal");
    doc.text(`Basic Salary: Rs. ${salary.salary}`, 15, 95);
    doc.text(`Bonus: Rs. ${salary.bonus}`, 15, 103);
    doc.text(`Bonus Reason: ${salary.reasonForBonus}`, 15, 111);

    doc.setFont("helvetica", "normal");

    // Total Salary
    doc.line(10, 120, 200, 120);
    doc.setFont("helvetica", "bold");
    doc.text("Total Salary:", 15, 130);
    doc.setFont("helvetica", "bold");
    doc.text(
      `Rs. ${parseInt(salary.salary) + parseInt(salary.bonus)}`,
      50,
      130
    );

    // Signature Section
    doc.line(10, 140, 200, 140);
    doc.setFont("helvetica", "italic");
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 15, 150);
    doc.text("Authorized By: _______________", 15, 160);

    doc.save("salary_receipt.pdf");
  };

  return (
    <>
      {salary ? (
        <div className="main-content">
          <section className="section">
            <div className="card">
              <div className="card-header d-flex justify-content-between">
                <h4>Updated Salary from {salary?.assignedDate}</h4>
              </div>
            </div>
            <div className={`card ${salary ? "" : "d-none"}`}>
              <div className="card-body row">
                <div className="col-md-3">
                  <img
                    className="img-fluid img-thumbnail"
                    src={user.image}
                    alt="Employee"
                  />
                </div>
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
                        <th>Salary</th>
                        <td> Rs. {salary?.salary}</td>
                      </tr>
                      <tr>
                        <th>Bonus</th>
                        <td> Rs. {salary?.bonus}</td>
                      </tr>
                      <tr>
                        <th>Reason for Bonus</th>
                        <td>{salary?.reasonForBonus}</td>
                      </tr>
                    </tbody>
                  </table>
                  <button
                    className="btn btn-primary mt-3"
                    onClick={generatePDF}
                  >
                    Download Salary Receipt
                  </button>
                </div>
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

export default Salary;
