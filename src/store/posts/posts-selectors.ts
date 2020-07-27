import { useRequestPost } from "./posts-actions";
import { useSelector, RootState } from "../store";
import { shallowEqual } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import { postsAdater } from "./posts-slice";
import { StorePost, Post } from "../../types/post";
import { useEffect } from "react";

const DEFAULT_ENTITY_EXPIRE_LENGTH_MS = 60 * 1000;

const idx = (rootState: RootState): RootState => rootState;

const { selectById } = postsAdater.getSelectors(
  (state: RootState) => state.posts
);

const getPostById = createSelector(
  idx,
  (_: unknown, postId: string) => postId,
  selectById
);

const getPostsByIds = createSelector(
  idx,
  (_: unknown, postIds: string[]) => postIds,
  (state, postIds) => {
    const posts: StorePost[] = postIds.flatMap((id) => {
      const post = getPostById(state, id);
      if (!post) return [];
      return post;
    });

    return posts;
  }
);

export const isPostExpired = (e: StorePost): boolean =>
  e.__loadedTimestamp__ < Date.now() - DEFAULT_ENTITY_EXPIRE_LENGTH_MS;

const getPostIdsToRequest = ({
  loadedPosts,
  requestedIds,
}: {
  requestedIds: string[];
  loadedPosts: StorePost[];
}): string[] => {
  const loadedPostIds = loadedPosts.map((p) => p.id);
  const loadedPostIdsSet = new Set<string>(loadedPostIds);

  const missingPostIds = requestedIds.flatMap((id) => {
    if (loadedPostIdsSet.has(id)) return [];

    return id;
  });

  const idsToRefetch = loadedPosts.flatMap((p) => {
    if (isPostExpired(p)) return p.id;

    return [];
  });

  return [...missingPostIds, ...idsToRefetch];
};

export const usePostByIds = (postIds: string[]): Post[] => {
  const requestPost = useRequestPost();

  const posts = useSelector(
    (state) => getPostsByIds(state, postIds),
    shallowEqual
  );

  useEffect(() => {
    const ids = getPostIdsToRequest({
      loadedPosts: posts,
      requestedIds: postIds,
    });

    ids.forEach((postId) => requestPost({ postId }));
  }, [postIds, requestPost]);

  return posts;
};

export const usePostById = ({ id }: { id: string }): Post | undefined => {
  const requestPost = useRequestPost();

  const post = useSelector((state) => getPostById(state, id), shallowEqual);

  useEffect(() => {
    if (post && !isPostExpired(post)) return;

    requestPost({ postId: id });
  }, [id, requestPost]);

  return post;
};
