// src/utils/generateSalarySlipPDF.js

import { jsPDF } from "jspdf";
import "jspdf-autotable"; // Import the autotable plugin
import logo from "../../assets/img/logo2.png"; // adjust path if needed

export const generateSalarySlipPDF = (employee, salary) => {
  const doc = new jsPDF();

  // Add Company Logo
  doc.addImage(logo, "PNG", 60, 10, 80, 30); // (logo, type, x, y, width, height)

  // Company Name
  // doc.setFontSize(16);
  // doc.setFont("helvetica", "bold");
  // doc.text("WORKSPHERE COMPANY", 105, 35, { align: "center" });

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Kathmandu, Nepal", 105, 38, { align: "center" });

  // Salary Slip Title
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Salary Slip", 105, 46, { align: "center" });

  // Employee and Salary Details
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Employee Name: ${employee?.name || "-"}`, 14, 65);
  doc.text(`Role: ${employee?.type || "-"}`, 14, 73);
  doc.text(`Email: ${employee?.email || "-"}`, 14, 81);
  doc.text(`Mobile No: ${employee?.mobile || "-"}`, 14, 89);

  doc.text(`Date: ${salary?.assignedDate || "-"}`, 150, 65);

  // Salary Table
  if (typeof doc.autoTable === "function") {
    doc.autoTable({
      startY: 98  ,
      head: [
        [
          { content: "Earnings", styles: { halign: "center" } },
          { content: "Amount (Rs.)", styles: { halign: "center" } },
          { content: "Deductions", styles: { halign: "center" } },
          { content: "Amount (Rs.)", styles: { halign: "center" } },
        ],
      ],
      body: [
        [
          "Basic Salary (60%)",
          salary?.basicSalary || "-",
          "Provident Fund (10%)",
          salary?.providentFund || "-",
        ],
        [
          "Dearness Allowance (20%)",
          salary?.dearnessAllowance || "-",
          "Social Security Fund (11%)",
          salary?.socialSecurityFund || "-",
        ],
        [
          "Bonus",
          salary?.bonus || "-",
          "Total Deductions",
          salary?.totalDeductions || "-",
        ],

        ["", "", "", ""],
        ["Gross Salary", salary?.grossSalary || "-", "", ""],
        ["Net Salary", salary?.netSalary || "-", "", ""],
      ],
      theme: "grid",
      headStyles: { fillColor: [22, 160, 133] }, // Teal Green color
      styles: {
        halign: "center",
        valign: "middle",
        fontSize: 11,
        cellPadding: 3,
      },
    });
  } else {
    console.error("autoTable function is not available");
  }

  // Amount in Words (Optional)
  doc.setFontSize(11);
  const netSalaryWords = salary?.netSalary
    ? numberToWords(Number(salary?.netSalary))
    : "-";

  doc.text(
    `IN WORDS: ${netSalaryWords} Only`,
    14,
    doc.lastAutoTable.finalY + 10
  );

  // Signature placeholders
  doc.text(
    "........................................",
    20,
    doc.lastAutoTable.finalY + 40
  );
  doc.text(
    "........................................",
    140,
    doc.lastAutoTable.finalY + 40
  );
  doc.text("Approved By", 30, doc.lastAutoTable.finalY + 48);
  doc.text("Designation", 150, doc.lastAutoTable.finalY + 48);

  return doc; // Return the document instance
};

function numberToWords(num) {
  const a = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const b = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  if (num === 0) return "Zero";

  if (num < 20) return a[num];

  if (num < 100) {
    return b[Math.floor(num / 10)] + (num % 10 !== 0 ? " " + a[num % 10] : "");
  }

  if (num < 1000) {
    return (
      a[Math.floor(num / 100)] +
      " Hundred" +
      (num % 100 !== 0 ? " and " + numberToWords(num % 100) : "")
    );
  }

  if (num < 100000) {
    return (
      numberToWords(Math.floor(num / 1000)) +
      " Thousand" +
      (num % 1000 !== 0 ? " " + numberToWords(num % 1000) : "")
    );
  }

  if (num < 10000000) {
    return (
      numberToWords(Math.floor(num / 100000)) +
      " Lakh" +
      (num % 100000 !== 0 ? " " + numberToWords(num % 100000) : "")
    );
  }

  return (
    numberToWords(Math.floor(num / 10000000)) +
    " Crore" +
    (num % 10000000 !== 0 ? " " + numberToWords(num % 10000000) : "")
  );
}
