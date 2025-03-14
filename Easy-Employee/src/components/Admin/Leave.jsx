import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { updateLeave, viewLeaves } from "../../http";
import { toast } from "react-toastify";
import Loading from "../Loading";

const Leave = () => {
  const { id } = useParams();
  const [application, setApplication] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const obj = { _id: id };
      const res = await viewLeaves(obj);
      setApplication(res.data[0]);
    };
    fetchData();
  }, [application]);

  const approveApplication = async () => {
    if (application.adminResponse === "Approved") {
      toast.error("Application already approved");
      return;
    }
    application["adminResponse"] = "Approved";
    const res = await updateLeave(id, application);
    if (res.success) {
      toast.success("Leave Approved");
      setApplication(application);
    }
  };

  const rejectApplication = async () => {
    if (application.adminResponse === "Rejected") {
      toast.error("Application already rejected");
      return;
    }
    application["adminResponse"] = "Rejected";
    const res = await updateLeave(id, application);
    if (res.success) {
      toast.success("Leave Rejected");
      setApplication(application);
    }
  };

  return (
    <>
      {application ? (
        <div className="main-content">
          <section className="section">
            <div className="card">
              <div className="card-header text-center">
                <h4>Application on {application?.appliedDate}</h4>
              </div>
            </div>

            {/* Centered Table Section */}
            <div className="card">
              <div className="card-body text-center">
                <div className="card-header d-flex justify-content-center">
                  <h5>Leave Details</h5>
                </div>
                <table
                  className="table table-bordered w-75 mx-auto"
                  style={{
                    borderCollapse: "separate",
                    borderSpacing: "0 10px", // Adds space between rows
                  }}
                >
                  <tbody>
                    <tr>
                      <th
                        style={{
                          backgroundColor: "#f4f4f4",
                          fontWeight: "bold",
                          padding: "12px 15px",
                        }}
                      >
                        Title
                      </th>
                      <td
                        style={{
                          padding: "12px 15px",
                          textAlign: "center",
                          backgroundColor: "#fff",
                        }}
                      >
                        {application?.title}
                      </td>
                    </tr>
                    <tr>
                      <th
                        style={{
                          backgroundColor: "#f4f4f4",
                          fontWeight: "bold",
                          padding: "12px 15px",
                        }}
                      >
                        Type
                      </th>
                      <td
                        style={{
                          padding: "12px 15px",
                          textAlign: "center",
                          backgroundColor: "#fff",
                        }}
                      >
                        {application?.type}
                      </td>
                    </tr>
                    <tr>
                      <th
                        style={{
                          backgroundColor: "#f4f4f4",
                          fontWeight: "bold",
                          padding: "12px 15px",
                        }}
                      >
                        Reason
                      </th>
                      <td
                        style={{
                          padding: "12px 15px",
                          textAlign: "center",
                          backgroundColor: "#fff",
                        }}
                      >
                        {application?.reason}
                      </td>
                    </tr>
                    <tr>
                      <th
                        style={{
                          backgroundColor: "#f4f4f4",
                          fontWeight: "bold",
                          padding: "12px 15px",
                        }}
                      >
                        Start Date
                      </th>
                      <td
                        style={{
                          padding: "12px 15px",
                          textAlign: "center",
                          backgroundColor: "#fff",
                        }}
                      >
                        {application?.startDate}
                      </td>
                    </tr>
                    <tr>
                      <th
                        style={{
                          backgroundColor: "#f4f4f4",
                          fontWeight: "bold",
                          padding: "12px 15px",
                        }}
                      >
                        End Date
                      </th>
                      <td
                        style={{
                          padding: "12px 15px",
                          textAlign: "center",
                          backgroundColor: "#fff",
                        }}
                      >
                        {application?.endDate}
                      </td>
                    </tr>
                    <tr>
                      <th
                        style={{
                          backgroundColor: "#f4f4f4",
                          fontWeight: "bold",
                          padding: "12px 15px",
                        }}
                      >
                        Applied Date
                      </th>
                      <td
                        style={{
                          padding: "12px 15px",
                          textAlign: "center",
                          backgroundColor: "#fff",
                        }}
                      >
                        {application?.appliedDate}
                      </td>
                    </tr>
                    <tr>
                      <th
                        style={{
                          backgroundColor: "#f4f4f4",
                          fontWeight: "bold",
                          padding: "12px 15px",
                        }}
                      >
                        Period
                      </th>
                      <td
                        style={{
                          padding: "12px 15px",
                          textAlign: "center",
                          backgroundColor: "#fff",
                        }}
                      >
                        {application?.period}
                      </td>
                    </tr>
                    <tr>
                      <th
                        style={{
                          backgroundColor: "#f4f4f4",
                          fontWeight: "bold",
                          padding: "12px 15px",
                        }}
                      >
                        Status
                      </th>
                      <td
                        style={{
                          padding: "12px 15px",
                          textAlign: "center",
                          backgroundColor: "#fff",
                        }}
                      >
                        <span
                          className={`badge px-3 py-2 ${
                            application?.adminResponse === "Rejected"
                              ? "bg-danger"
                              : application?.adminResponse === "Pending"
                              ? "bg-warning"
                              : "bg-success"
                          }`}
                          style={{ color: "black" }}
                        >
                          {application?.adminResponse}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div className="d-flex justify-content-center mt-4">
                  <button
                    onClick={approveApplication}
                    className={`btn btn-success mx-2 ${
                      application?.adminResponse === "Approved"
                        ? "disabled"
                        : ""
                    }`}
                    disabled={application?.adminResponse === "Approved"}
                    style={{ color: "black" }} // Button text color
                  >
                    Approve
                  </button>
                  <button
                    onClick={rejectApplication}
                    className={`btn btn-danger mx-2 ${
                      application?.adminResponse === "Rejected"
                        ? "disabled"
                        : ""
                    }`}
                    disabled={application?.adminResponse === "Rejected"}
                    style={{ color: "black" }} // Button text color
                  >
                    Reject
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

export default Leave;
