// store/leave-slice.jsx
import { createSlice } from "@reduxjs/toolkit";
import { viewLeaveApplications } from "../http";

const initialState = {
  totalApproved: 0,
  approvedCount: 0,
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
  },
});

export const { setTotalApproved, setApprovedCount } = leaveSlice.actions;

// ✅ Async function to fetch leave applications and update approved count + total days
export const fetchLeaveApplications = (userId) => async (dispatch) => {
  try {
    const res = await viewLeaveApplications({ applicantID: userId });
    const { data } = res;

    const approvedApplications = data.filter(
      (application) => application.adminResponse === "Approved"
    );

    const approvedCount = approvedApplications.length;
    const approvedDaysSum = approvedApplications.reduce(
      (total, application) => total + (application.period || 0),
      0
    );

    dispatch(setApprovedCount(approvedCount));
    dispatch(setTotalApproved(approvedDaysSum));
  } catch (error) {
    console.error("Error fetching leave applications:", error);
  }
};

export default leaveSlice.reducer;
