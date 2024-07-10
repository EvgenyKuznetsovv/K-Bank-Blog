import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchLastComments = createAsyncThunk('/comments/fetchLastComments', async () => {
    const { data } = await axios.get('/comments');
    return data;

});

export const fetchCommentsForPost = createAsyncThunk('/comments/fetchCommentsForPost', async (id) => {
    const { data } = await axios.get(`/comments/${id}`)
    return data;
})

const initialState = {
    comments: [],
    status: 'loading',
};

const commentsSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {},
    extraReducers: {
        // получение последних комментариев
        [fetchLastComments.pending]: (state) => {
            state.comments = []
            state.status = 'loading'
        },
        [fetchLastComments.fulfilled]: (state, action) => {
            state.comments = action.payload
            state.status = 'loaded'
        },
        [fetchLastComments.rejected]: (state) =>{
            state.comments = []
            state.status = 'error'
        },
        // получение комментариев для поста
        [fetchCommentsForPost.pending]: (state) => {
            state.comments = []
            state.status = 'loading'
        },
        [fetchCommentsForPost.fulfilled]: (state,  action) => {
            state.comments = action.payload
            state.status = 'loaded'
        },
        [fetchCommentsForPost.rejected]: (state) => {
            state.comments = []
            state.status = 'error'
        },
    }
});

export const commentsReducer = commentsSlice.reducer;