import React, { useState } from "react";

const AssignTask = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedPerson, setSelectedPerson] = useState("");
  const [task, setTask] = useState("");

  const roles = ["Manager", "Developer", "Designer", "Tester"];
  const people = ["Alice", "Bob", "Charlie", "prajwol"]; // Example people

  const assignTask = () => {
    alert(`Task "${task}" assigned to ${selectedPerson} (${selectedRole})`);
  };

  return (
    <div className="main-content">
      <section className="section">
        <div className="card">
          <div className="card-header d-flex justify-content-between">
            <h4>Assign Task</h4>
          </div>
        </div>

        <div className="d-flex flex-column align-items-center w-100">
          {/* Assign To Role */}
          <div className="col mb-3">
            <label className="form-label">Assign To (Role)</label>
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

          {/* Assign To Person */}
          <div className="col mb-3">
            <label className="form-label">Assign To (Person)</label>
            <select
              className="form-control select2"
              value={selectedPerson}
              onChange={(e) => setSelectedPerson(e.target.value)}
              disabled={!selectedRole} // Disable until a role is selected
            >
              <option value="">Select Person</option>
              {people.map((person) => (
                <option key={person} value={person}>
                  {person}
                </option>
              ))}
            </select>
          </div>

          {/* Task Input */}
          <div className="col mb-3">
            <label className="form-label">Task</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Task"
              value={task}
              onChange={(e) => setTask(e.target.value)}
            />
          </div>

          {/* Assign Button */}
          <div className="form-group text-center col-md-12">
            <button
              className="btn btn-primary btn-lg"
              type="submit"
              style={{ width: "30vh" }}
            >
              Assign task
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AssignTask;
