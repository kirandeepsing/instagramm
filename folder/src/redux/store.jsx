import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../redux/userSlice";
import postReducer from './postSlice'; // Import the post reducer


const store = configureStore({
  reducer: {
    user: userReducer,
    posts: postReducer, // Add the post slice to the store
  },
});

export { store};
