import { useDispatch, RootState, AppDispatch } from "../store";
import { useCallback } from "react";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { Post } from "../../types/post";
import { API_URL } from "../../lib/env";

export const fetchPost = createAsyncThunk<Post, { postId: string }>(
  "posts/fetch",
  ({ postId }, thunkApi) => {
    return fetch(API_URL + "/posts/" + postId, { method: "GET" })
      .then((res) => res.json())
      .catch((err) => thunkApi.rejectWithValue(err));
  }
);

const fetchPostAction = (...params: Parameters<typeof fetchPost>) => (
  dispatch: AppDispatch,
  getState
) => {
  console.log("fetchPostAction");
  const state = getState() as RootState;

  const post = state.posts.entities[params[0].postId];
  const postIsNew = post ? post.__loadedTimestamp__ > Date.now() - 100 : false;

  if (state.posts.fetchingIds.includes(params[0].postId) || postIsNew) return;

  dispatch(fetchPost(...params));
};

export const useRequestPost = () => {
  const dispatch = useDispatch();

  const requestUser = useCallback(
    (...params: Parameters<typeof fetchPost>) =>
      dispatch(fetchPostAction(...params)),
    [dispatch]
  );

  return requestUser;
};
