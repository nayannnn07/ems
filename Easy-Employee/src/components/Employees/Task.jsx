import React, { useState } from "react";

const TaskPage = () => {
  // Static Task Data with state to manage the tasks
  const [tasks, setTasks] = useState([
    { id: 1, name: "Design Homepage", status: "Pending" },
    { id: 2, name: "Develop Login API", status: "In Progress" },
    { id: 3, name: "Test User Dashboard", status: "Completed" },
  ]);

  // Function to handle the status change of a task
  const handleStatusChange = (taskId) => {
    // Copy the tasks to avoid direct mutation
    const updatedTasks = tasks.map((task) =>
      task.id === taskId
        ? {
            ...task,
            status:
              task.status === "Pending"
                ? "In Progress"
                : task.status === "In Progress"
                ? "Pending"
                : task.status,
          }
        : task
    );

    setTasks(updatedTasks); // Update the state with the new task statuses
  };

  return (
    <div className="main-content">
      <section className="section">
        <div className="card">
          <div className="card-header d-flex justify-content-between">
            <h4>Task Management</h4>
          </div>
        </div>

        {/* Centered Table Section */}
        <div className="card">
          <div className="card-body">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5>Task List</h5>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>Task ID</th>
                  <th>Task Name</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id}>
                    <td>{task.id}</td>
                    <td>{task.name}</td>
                    <td>
                      <span
                        className={`badge ${
                          task.status === "Completed"
                            ? "bg-success"
                            : task.status === "In Progress"
                            ? "bg-warning"
                            : "bg-secondary"
                        }`}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-lg btn-primary"
                        onClick={() => handleStatusChange(task.id)}
                      >
                        Edit Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TaskPage;
