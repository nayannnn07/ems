import React, { useState } from "react";
import { useHistory } from "react-router-dom"; // import useHistory
import { toast } from "react-toastify"; // import toast

const AssignTask = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedPerson, setSelectedPerson] = useState("");
  const [task, setTask] = useState("");

  const history = useHistory(); // initialize useHistory

  const roles = ["Manager", "Developer", "Designer", "Tester"];
  const people = ["Nayana", "Anish", "Jane", "Prajwol"];

  const assignTask = (e) => {
    e.preventDefault(); // prevent default form submission

    if (!selectedRole || !selectedPerson || !task) {
      toast.error("Please fill all fields before assigning the task!");
      return;
    }

    toast.success(
      `Task "${task}" assigned to ${selectedPerson} (${selectedRole})`
    );

    setTimeout(() => {
      history.push("/home"); // redirect after success toast
    }, 1500); // slight delay to let toast show
  };

  return (
    <div className="main-content">
      <section className="section">
        <div className="card">
          <div className="card-header d-flex justify-content-between">
            <h4 style={{ fontSize: "24px", fontWeight: 700 }}>Assign Task</h4>
          </div>
        </div>

        <form
          className="d-flex flex-column align-items-center w-100"
          onSubmit={assignTask}
        >
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
              disabled={!selectedRole}
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
              Assign Task
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default AssignTask;
