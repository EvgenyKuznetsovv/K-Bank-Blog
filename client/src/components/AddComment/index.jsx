import React from "react";

import styles from "./AddComment.module.scss";

import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuthMe } from "../../redux/slices/auth";
import axios from "../../axios";
import { fetchCommentsForPost } from "../../redux/slices/comments";

export const Index = ({ postId, increaseCommentCount }) => {
  const dispatch = useDispatch();
  const [text, setText] = React.useState('');
  const { avatarUrl, _id } = useSelector((state) => state.auth.data) || "";
  //console.log(avatarUrl);

  React.useEffect(()=>{
    dispatch(fetchAuthMe());
  }, []);

  const onSubmit = async() => {
    try {
      const fields = {
        text,
        userId: _id,
        postId,
      };
      //console.log(fields);
      await axios.post('/comments', fields);
      setText('');
      dispatch(fetchCommentsForPost(postId));
      increaseCommentCount();
    } catch (err) {
      console.warn(err);
      alert("Ошибка при отправке комментария");
    }
  }

  return (
    <>
      <div className={styles.root}>
        <Avatar
          classes={{ root: styles.avatar }}
          src={ avatarUrl}
        />
        <div className={styles.form}>
          <TextField
            label="Написать комментарий"
            variant="outlined"
            onChange={ e=> setText(e.target.value)}
            maxRows={10}
            value={text}
            multiline
            fullWidth
          />
          <Button onClick={onSubmit} disabled={text == ""} variant="contained">Отправить</Button>
        </div>
      </div>
    </>
  );
};
