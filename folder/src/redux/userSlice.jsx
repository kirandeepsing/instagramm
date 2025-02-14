import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: [], // Holds user data
    userProfile:[],
    suggestedUser: null
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload; // Set user data
    }, 
    setsuggestedUser: (state, action) => {
      state.suggestedUser = action.payload; // Set user data
    }, 
    setProfile: (state, action) => {
      state.userProfile = action.payload; // Set user data
    }, 
    clearUser: (state) => {
      state.user = null; // Clear user data
    },
  },
});

export const { setUser,setsuggestedUser, clearUser,setProfile } = userSlice.actions;
export default userSlice.reducer;
