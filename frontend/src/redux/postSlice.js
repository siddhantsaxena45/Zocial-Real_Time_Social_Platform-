import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
    name: "post",
    initialState: {
        posts: [],
        selectedPost: null,
        engagementModalOpen: false,
    },
    reducers: {
        setPosts: (state, action) => {
            state.posts = action.payload;
        },
        setSelectedPost: (state, action) => {
            state.selectedPost = action.payload;
        },
        setEngagementModalOpen: (state, action) => {
            state.engagementModalOpen = action.payload;
        },
    },
});

export const { setPosts, setSelectedPost, setEngagementModalOpen } = postSlice.actions;
export default postSlice.reducer;