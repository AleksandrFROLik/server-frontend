import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios/axios';

export const fetchPosts = createAsyncThunk( '/posts/fetchPosts', async () => {
  const { data } = await axios.get( '/posts' )// здесь мы вытягиваем объект  data  из axios  запроса.
  return data
} )// создание асинроннго запроса.

export const fetchTags = createAsyncThunk( '/posts/fetchPosts', async () => {
  const { data } = await axios.get( '/tags' )// здесь мы вытягиваем объект  data  из axios  запроса.
  return data
} )// создание асинроннго запроса.


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

const postsSlice = createSlice( {
  name: 'posts',
  initialState,
  reducer: {},
  extraReducers: {
    [fetchPosts.pending]: ( state ) => {
      state.posts.items = [];
      state.post.status = 'loading';
    },
    [fetchPosts.fulfilled]: ( state, action ) => {
      state.posts.items = action.payload;
      state.post.status = 'loaded';
    },
    [fetchPosts.rejected]: ( state) => {
      state.posts.items = [];
      state.post.status = 'error';
    },
  }// в extraReducers мы отлавливаем состояние запроса что можно было использоват индикаторы загрузки или приход ошибки.
} );

export const postsReducer = postsSlice.reducer;