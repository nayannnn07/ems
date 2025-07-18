import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom"; // Import useHistory for navigation
import HeaderSection from "../../components/HeaderSection";
import { applyforleave } from "../../http";
import CountsCard from "../../components/dashboard/CountsCard";
import { fetchLeaveApplications } from "../../store/leave-slice";

const ApplyForLeave = () => {
  const { user } = useSelector((state) => state.authSlice);
  const totalApproved = useSelector((state) => state.leaveSlice.totalApproved);
  const history = useHistory(); // Create history object for navigation

  const totalEntitled = 15;
  const remainingLeaves = totalEntitled - totalApproved;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchLeaveApplications(user.id));
  }, [totalApproved, dispatch, user.id]);

  const initialState = {
    title: "",
    type: "",
    period: "",
    startDate: "",
    endDate: "",
    reason: "",
  };

  const [formData, setFormData] = useState(initialState);

  const inputEvent = (e) => {
    const { name, value } = e.target;
    setFormData((old) => ({
      ...old,
      [name]: value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const { title, type, startDate, endDate, reason, period } = formData;
    if (!title || !type || !startDate || !endDate || !period || !reason)
      return toast.error("All Fields Required");

    const d = new Date();
    formData["applicantID"] = user.id;
    formData["appliedDate"] =
      d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();

    const res = await applyforleave(formData);
    const { success } = res;
    if (success) {
      toast.success("Leave Application Sent!");

      // Redirect after a successful leave application
      setTimeout(() => {
        history.push("/userLeaveApplications");
      }, 1000); // Add a delay before redirecting
    }

    setFormData(initialState);
  };

  return (
    <div className="main-content">
      <section className="section">
        <HeaderSection title="Apply for Leave" />

        {/* Dashboard Cards */}
        <div className="cards-container">
          <CountsCard
            title="Total Entitled Leave"
            icon="fa-calendar-check"
            count={totalEntitled}
          />
          <CountsCard
            title="Used Leave"
            icon="fa-calendar-times"
            count={totalApproved}
          />
          <CountsCard
            title="Remaining Leave"
            icon="fa-calendar"
            count={remainingLeaves}
          />
        </div>

        {/* Leave Form */}
        <div className="card">
          <div className="card-body pr-5 pl-5 m-1">
            <form className="row" onSubmit={onSubmit} id="addUserForm">
              <div className="form-group col-md-4">
                <label>Enter Title</label>
                <input
                  onChange={inputEvent}
                  value={formData.title}
                  type="text"
                  id="title"
                  name="title"
                  className="form-control"
                  disabled={remainingLeaves === 0} // Disable input if no remaining leaves
                />
              </div>

              <div className="form-group col-md-4">
                <label>Leave Type</label>
                <select
                  name="type"
                  onChange={inputEvent}
                  value={formData.type}
                  className="form-control select2"
                  disabled={remainingLeaves === 0} // Disable input if no remaining leaves
                >
                  <option>Select</option>
                  <option>Sick Leave</option>
                  <option>Casual Leave</option>
                  <option>Emergency Leave</option>
                </select>
              </div>

              <div className="form-group col-md-4">
                <label>Enter Period</label>
                <input
                  onChange={inputEvent}
                  value={formData.period}
                  type="number"
                  id="period"
                  name="period"
                  className="form-control"
                  disabled={remainingLeaves === 0} // Disable input if no remaining leaves
                />
              </div>

              <div className="form-group col-md-6">
                <label>Start Date</label>
                <input
                  onChange={inputEvent}
                  value={formData.startDate}
                  type="date"
                  id="startDate"
                  name="startDate"
                  className="form-control"
                  disabled={remainingLeaves === 0} // Disable input if no remaining leaves
                />
              </div>

              <div className="form-group col-md-6">
                <label>End Date</label>
                <input
                  onChange={inputEvent}
                  value={formData.endDate}
                  type="date"
                  id="endDate"
                  name="endDate"
                  className="form-control"
                  disabled={remainingLeaves === 0} // Disable input if no remaining leaves
                />
              </div>

              <div className="form-group col-md-12">
                <label>Enter Reason</label>
                <input
                  onChange={inputEvent}
                  value={formData.reason}
                  type="text"
                  id="reason"
                  name="reason"
                  className="form-control"
                  disabled={remainingLeaves === 0} // Disable input if no remaining leaves
                />
              </div>

              <div className="form-group text-center col-md-12">
                <button
                  className="btn btn-primary btn-lg"
                  type="submit"
                  style={{ width: "30vh" }}
                  disabled={remainingLeaves === 0} // Disable button if no remaining leaves
                >
                  Apply Leave
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ApplyForLeave;
