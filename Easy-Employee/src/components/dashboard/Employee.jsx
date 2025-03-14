"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getCounts } from "../../http";
import { setCount } from "../../store/main-slice";
import CountsCard from "./CountsCard";
import PieChart from "../PieChart";

const Leader = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    getCounts().then((res) => {
      if (res.success) dispatch(setCount(res.data));
    });
  }, [dispatch]);

  const { user, counts } = useSelector((state) => ({
    user: state.authSlice.user,
    counts: state.mainSlice.counts || {},
  }));

  const { present = 50, absent = 10 } = counts;

  // Static Team Data
  const team = [
    { name: "Alice", role: "Frontend Developer" },
    { name: "Bob", role: "Backend Developer" },
    { name: "Charlie", role: "UI/UX Designer" },
    { name: "David", role: "Product Manager" },
    { name: "Eva", role: "QA Tester" },
    { name: "Frank", role: "DevOps Engineer" },
    { name: "Grace", role: "Project Manager" },
  ];

  return (
    <div className="admin-container">
      {/* Top Cards Section */}
      <div className="cards-container">
        <CountsCard icon="fa-calendar-alt" title="Total Leave" count="8" />
        <CountsCard icon="fa-check-circle" title="Approved" count="5" />
        <CountsCard icon="fa-times-circle" title="Rejected" count="2" />
      </div>

      {/* Charts Section */}
      <div className="row mt-3">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body text-center">
              <PieChart present={present} absent={absent} />
            </div>
          </div>
        </div>

        {/* Team Members Section */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h4 className="text-center">Team Members</h4>
              <div className="card p-3">
                {team.map((member, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "10px",
                      borderBottom:
                        index !== team.length - 1 ? "1px solid #ddd" : "none",
                    }}
                  >
                    <span>{member.name}</span>
                    <span style={{ fontWeight: "bold" }}>{member.role}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leader;
