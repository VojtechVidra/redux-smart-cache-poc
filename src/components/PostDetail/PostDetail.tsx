import React from "react";
import { usePostById } from "../../store/posts/posts-selectors";

interface Props {
  postId: string;
}

export const PostDetail = ({ postId }: Props) => {
  const post = usePostById({ id: postId });

  return (
    <div>
      <h2>Post detail: </h2>

      {post ? (
        <div>
          <h1>{post.title}</h1>
          <p>{post.body}</p>
        </div>
      ) : (
        <p>No post</p>
      )}
    </div>
  );
};
