import React from "react";
import { IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Clear';
import { SideBlock } from "./SideBlock";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import Skeleton from "@mui/material/Skeleton";
import styles from '../components/Post/Post.module.scss';
import { useDispatch, useSelector } from "react-redux";
import { fetchRemoveComment } from "../redux/slices/comments";


export const CommentsBlock = ({ items, children, isLoading = true, isFullPost=false, decreaseCommentCount}) => {
	const dispatch = useDispatch();
	const { _id } = useSelector(state => state.auth.data) || "";
	console.log( _id );
	console.log(items);

	const onClickRemove = (id) => {
		try {
			if (window.confirm('Вы дествительно хотите удалить комментарий?')) {
				dispatch(fetchRemoveComment(id));
				decreaseCommentCount();
			}
		} catch (err) {
			console.log(err);
			alert('Не удалось удалить комментарий');
		}
	}
  return (
		<SideBlock title='Комментарии'>
			<List>
				{(isLoading ? [...Array(5)] : items).map((obj, index) => (
					<React.Fragment key={index}>
						<ListItem alignItems='flex-start'>
							<ListItemAvatar>
								{isLoading ? (
									<Skeleton variant='circular' width={40} height={40} />
								) : (
									<Avatar alt={obj.user.fullName} src={obj.user.avatarUrl} />
								)}
							</ListItemAvatar>
							{isLoading ? (
								<div style={{ display: 'flex', flexDirection: 'column' }}>
									<Skeleton variant='text' height={25} width={120} />
									<Skeleton variant='text' height={18} width={230} />
								</div>
							) : (
								<>
									<ListItemText
										primary={obj.user.fullName}
										secondary={obj.text}
									/>
									{isFullPost && _id == obj.user._id && (
										<IconButton onClick={() => onClickRemove(obj._id)} color='secondary'>
											<DeleteIcon />
										</IconButton>
									)}
								</>
							)}
						</ListItem>
						<Divider variant='inset' component='li' />
					</React.Fragment>
				))}
			</List>
			{children}
		</SideBlock>
	)
};
