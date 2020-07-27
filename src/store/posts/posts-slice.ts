import {
  createEntityAdapter,
  EntityState,
  createReducer,
} from "@reduxjs/toolkit";
import { StorePost } from "../../types/post";

export const postsAdater = createEntityAdapter<StorePost>();

interface PostsState extends EntityState<StorePost> {
  fetchingIds: string[];
}

const initialState = postsAdater.getInitialState({ fetchingIds: [] });

export const postsReducer = createReducer<PostsState>(initialState, (builder) =>
  builder
    .addCase("posts/fetch/pending", (state, action: any) => {
      state.fetchingIds = [...state.fetchingIds, action.meta.arg.postId];
    })
    .addCase("posts/fetch/fulfilled", (state, action: any) => {
      state.fetchingIds = state.fetchingIds.filter(
        (id) => id !== action.meta.arg.postId
      );

      const post: StorePost = {
        ...action.payload,
        __loadedTimestamp__: Date.now(),
      };
      postsAdater.upsertOne(state, post);
    })
);
