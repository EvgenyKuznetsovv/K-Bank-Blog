import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    const { data } = await axios.get('/posts');
	// for(let post of data){
	// 	const commentsCount = await axios.get(`/comments/count/${post._id}`);
	// 	post.commentsCount = commentsCount.data.count;
	// }
    return data;
});

export const fetchPopularPosts = createAsyncThunk('/posts/fetchPopularPosts', async () => {
	const { data } = await axios.get('/posts/popular');
	// for (let post of data) {
	// 	const commentsCount = await axios.get(`/comments/count/${post._id}`)
	// 	post.commentsCount = commentsCount.data.count
	// }
	return data;
});

export const fetchPostsByTag = createAsyncThunk('/posts/fetchPostsByTag', async (name) => {
	const { data } = await axios.get(`/posts/tags/${name}`)
	//console.log(data);
	return data;
});

export const fetchTags = createAsyncThunk('posts/fetchTags', async () => {
    const { data } = await axios.get('/tags');
    return data;
});

export const fetchRemovePost = createAsyncThunk('/posts/fetchRemovePost', async (id) => {
    axios.delete(`/posts/${id}`);
});

const initialState = {
    posts: {
        items: [],
        status: "loading",
    },
    tags: {
        items: [],
        status: "loading",
    },
};

const postsSlice = createSlice({
	name: 'posts',
	initialState,
	reducers: {},
	extraReducers: {
		// Получение статей
		[fetchPosts.pending]: state => {
			state.posts.items = []
			state.posts.status = 'loading'
		},
		[fetchPosts.fulfilled]: (state, action) => {
			state.posts.items = action.payload
			state.posts.status = 'loaded'
		},
		[fetchPosts.rejected]: state => {
			state.posts.items = []
			state.posts.status = 'error'
		},
		// Получение популярных статей
		[fetchPopularPosts.pending]: state => {
			state.posts.items = []
			state.posts.status = 'loading'
		},
		[fetchPopularPosts.fulfilled]: (state, action) => {
			state.posts.items = action.payload
			state.posts.status = 'loaded'
		},
		[fetchPopularPosts.rejected]: state => {
			state.posts.items = []
			state.posts.status = 'error'
		},
		// Получение статей по тэгу
		[fetchPostsByTag.pending]: state => {
			state.posts.items = []
			state.posts.status = 'loading'
		},
		[fetchPostsByTag.fulfilled]: (state, action) => {
			state.posts.items = action.payload
			state.posts.status = 'loaded'
		},
		[fetchPostsByTag.rejected]: state => {
			state.posts.items = []
			state.posts.status = 'error'
		},
		// Получение тегов
		[fetchTags.pending]: state => {
			state.tags.items = []
			state.tags.status = 'loading'
		},
		[fetchTags.fulfilled]: (state, action) => {
			state.tags.items = action.payload
			state.tags.status = 'loaded'
		},
		[fetchTags.rejected]: state => {
			state.tags.items = []
			state.tags.status = 'error'
		},
		// Удаление статьи
		[fetchRemovePost.pending]: (state, action) => {
			state.posts.items = state.posts.items.filter(
				obj => obj._id != action.meta.arg
			)
		},
	},
})

export const postsReducer = postsSlice.reducer;