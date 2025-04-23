import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth-slice";
import mainSlice from "./main-slice";
import teamSlice from "./team-slice";
import userSlice from "./user-slice";
import leaveSlice from "./leave-slice";
import thunk from "redux-thunk";  // Import redux-thunk if you're handling async actions.

const store = configureStore({
  reducer: {
    authSlice,
    mainSlice,
    teamSlice,
    userSlice,
    leaveSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(thunk), // Add redux-thunk middleware if not included by default.
});

export default store;
