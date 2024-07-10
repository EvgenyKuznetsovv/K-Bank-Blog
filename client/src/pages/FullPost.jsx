import React, { useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from 'react-markdown'
import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import axios from "../axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchCommentsForPost } from "../redux/slices/comments";

export const FullPost = () => {
  const [data, setData] = React.useState();
  const [isLoading, setLoading] = React.useState(true);
  const { id } = useParams();
  const dispatch = useDispatch();
  const comments = useSelector(state => state.comments);

  const isCommentsLoading = comments.status == 'loading';

  React.useEffect(() => {
    axios.get(`/posts/${id}`)
    .then( res => {
      setData(res.data);
      setLoading(false);
    })
    .catch((err) => {
      console.log(err);
      alert('Ошибка при получении статьи');
    });
    dispatch(fetchCommentsForPost(id));
  }, []);

  if(isLoading){
    return <Post isLoading = {isLoading} isFullPost/>
  }


  return (
    <>
      <Post
        id={data._id}
        title={data.title}
        imageUrl={ data.imageUrl ? `http://localhost:4444/${data.imageUrl}`: ''}
        user={data.user}
        createdAt={data.createdAt}
        viewsCount={data.viewsCount}
        commentsCount={data.commentCount}
        tags={data.tags}
        isFullPost
      >
        <ReactMarkdown children={data.text} />
      </Post>
      <CommentsBlock
        items={comments.comments}
        isLoading={isCommentsLoading}
      >
        <Index />
      </CommentsBlock>
    </>
  );
};
