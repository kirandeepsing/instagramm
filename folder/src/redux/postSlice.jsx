import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  posts: [], // An array to hold the posts
  comments:[],
  bookmark:[],
};

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    // Action to set posts (e.g., fetch posts from an API)
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    setComment:(state,action) =>{
      state.comments = action.payload;
    },
    setBookmarks:(state,action) =>{
      state.bookmark = action.payload;
    }
  },
});

export const {setPosts,setComment,setBookmarks } = postSlice.actions;
export default postSlice.reducer;
