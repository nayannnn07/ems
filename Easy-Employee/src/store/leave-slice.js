// store/leave-slice.jsx
import { createSlice } from "@reduxjs/toolkit";
import { viewLeaveApplications } from "../http";

const initialState = {
  totalApproved: 0,
  approvedCount: 0,
  pendingCount: 0,
  rejectedCount: 0,
  totalCount: 0,
};

const leaveSlice = createSlice({
  name: "leave",
  initialState,
  reducers: {
    setTotalApproved: (state, action) => {
      state.totalApproved = action.payload;
    },
    setApprovedCount: (state, action) => {
      state.approvedCount = action.payload;
    },
    setPendingCount: (state, action) => {
      state.pendingCount = action.payload;
    },
    setRejectedCount: (state, action) => {
      state.rejectedCount = action.payload;
    },
    setTotalCount: (state, action) => {
      state.totalCount = action.payload;
    },
  },
});

export const { setTotalApproved, setApprovedCount, setPendingCount, setRejectedCount, setTotalCount} = leaveSlice.actions;

// ✅ Async function to fetch leave applications and update approved count + total days
export const fetchLeaveApplications = (userId) => async (dispatch) => {
  try {
    const res = await viewLeaveApplications({ applicantID: userId });
    const { data } = res;

    // Approved Applications
    const approvedApplications = data.filter(
      (application) => application.adminResponse === "Approved"
    );

    // Pending Applications
    const pendingApplications = data.filter(
      (application) => application.adminResponse === "Pending"
    );

    // Rejected Applications
    const rejecetdApplications = data.filter(
      (application) => application.adminResponse === "Rejected"
    );
    
    const approvedCount = approvedApplications.length;
    const pendingCount = pendingApplications.length;
    const rejectedCount = rejecetdApplications.length;
    const totalCount = pendingCount + approvedCount + rejectedCount;

    const approvedDaysSum = approvedApplications.reduce(
      (total, application) => total + (application.period || 0),
      0
    );

    dispatch(setApprovedCount(approvedCount));
    dispatch(setPendingCount(pendingCount));
    dispatch(setRejectedCount(rejectedCount));
    dispatch(setTotalCount(totalCount));
    dispatch(setTotalApproved(approvedDaysSum));

    console.log("Leave Applications:", approvedCount, pendingCount, rejectedCount, approvedDaysSum);
  } catch (error) {
    console.error("Error fetching leave applications:", error);
  }
};

export default leaveSlice.reducer;
