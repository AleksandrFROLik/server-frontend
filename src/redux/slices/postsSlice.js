import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios/axios';

export const fetchPosts = createAsyncThunk('/posts/fetchPosts', async () => {
  const { data } = await axios.get('/posts')// здесь мы вытягиваем объект  data  из axios  запроса.
  return data
})// создание асинроннго запроса.

export const fetchRemovePost = createAsyncThunk('/posts/fetchPosts', async (id) => {
  await axios.delete(`/posts/${id}`)
})

export const fetchTags = createAsyncThunk('/posts/fetchPosts', async () => {
  const { data } = await axios.get('/tags')// здесь мы вытягиваем объект  data  из axios  запроса.
  return data
})// создание асинроннго запроса.


const initialState = {
  posts: {
    items: [],
    status: 'loading'
  },
  tags: {
    items: [],
    status: 'loading'
  },
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducer: {},
  extraReducers: {
    [fetchPosts.pending]: (state) => {
      state.post.status = 'loading';
      state.posts.items = [];
    },
    [fetchPosts.fulfilled]: (state, action) => {
      state.post.status = 'loaded';
      state.posts.items = action.payload;
    },
    [fetchPosts.rejected]: (state) => {
      state.post.status = 'error';
      state.posts.items = [];
    },

    [fetchRemovePost.pending]: (state, action) => {
      state.posts.items = state.posts.items.filter(post => post._id !== action.meta.arg)
    },
    // [fetchRemovePost.fulfilled]: (state, action) => {
    //   state.post.status = 'loaded';
    //   state.posts.items = action.payload;
    // },
    // [fetchRemovePost.rejected]: (state) => {
    //   state.post.status = 'error';
    //   state.posts.items = [];
    // },

    [fetchTags.pending]: (state) => {
      state.tags.status = 'loading';
      state.tags.items = [];
    },
    [fetchTags.fulfilled]: (state, action) => {
      state.tags.status = 'loaded';
      state.tags.items = action.payload;
    },
    [fetchTags.rejected]: (state) => {
      state.tags.status = 'error';
      state.tags.items = [];
    },
  }// в extraReducers мы отлавливаем состояние запроса что можно было использоват индикаторы загрузки или приход ошибки.
});

export const postsReducer = postsSlice.reducer;