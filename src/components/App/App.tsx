import React, { useState, memo } from "react";
import { usePostByIds } from "../../store/posts/posts-selectors";
import { Post } from "../../types/post";
import styled from "styled-components";
import { PostDetail } from "../PostDetail/PostDetail";

const postIds = ([1, 2, 3] as unknown) as string[];

export const App = memo(() => {
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const handleSelectPost = (post: Post) => {
    if (selectedPostId === post.id) return setSelectedPostId(null);
    setSelectedPostId(post.id);
  };

  const posts = usePostByIds(postIds);

  return (
    <Wrapper>
      <LeftCol>
        {posts.map((p) => (
          <div key={p.id}>
            <h2>{p.title}</h2>
            <input
              type="checkbox"
              checked={p.id === selectedPostId}
              onChange={() => handleSelectPost(p)}
            />
            <p>{p.body}</p>
          </div>
        ))}
      </LeftCol>
      <RightCol>
        {selectedPostId && <PostDetail postId={selectedPostId} />}
      </RightCol>
    </Wrapper>
  );
});

const Wrapper = styled.div`
  display: flex;
`;

const LeftCol = styled.div`
  flex: 1;
  padding: 10px 20px;
`;

const RightCol = styled.div`
  width: 350px;
  padding: 10px 20px;
`;
