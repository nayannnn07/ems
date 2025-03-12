import React from "react";

const TaskPage = () => {
  // Static Task Data
  const tasks = [
    { id: 1, name: "Design Homepage", status: "Pending" },
    { id: 2, name: "Develop Login API", status: "In Progress" },
    { id: 3, name: "Test User Dashboard", status: "Completed" },
  ];

  return (
    <div className="main-content">
      <section className="section">
        <div className="card">
          <div className="card-header d-flex justify-content-between">
            <h4>Task Management</h4>
          </div>
        </div>

        {/* Centered Table Section */}
        <div className="d-flex justify-content-center w-100 mt-3">
          <div className="col-md-8">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5>Task List</h5>
              </div>
              <div className="card-body">
                <table className="table table-striped text-center">
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
                          <button className="btn btn-sm btn-info me-2">
                            Edit
                          </button>
                          <button className="btn btn-sm btn-danger">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TaskPage;
