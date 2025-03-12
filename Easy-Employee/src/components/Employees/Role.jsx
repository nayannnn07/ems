import React, { useState } from "react";

const AssignTask = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [task, setTask] = useState("");

  const roles = ["Manager", "Developer", "Designer", "Tester"];

  const assignTask = () => {
    alert(`Task "${task}" assigned to ${selectedRole}`);
  };

  return (
    <div className="main-content">
      <section className="section">
        <div className="card">
          <div className="card-header d-flex justify-content-between">
            <h4>Assign Task</h4>
          </div>
        </div>

        <div className="d-flex justify-content-center w-100">
          <div className="col">
            <select
              className="form-control select2"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="">Select Role</option>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Enter Task"
              value={task}
              onChange={(e) => setTask(e.target.value)}
            />
          </div>

          <button onClick={assignTask} className="btn btn-lg btn-primary col">
            Assign Task
          </button>
        </div>
      </section>
    </div>
  );
};

export default AssignTask;
