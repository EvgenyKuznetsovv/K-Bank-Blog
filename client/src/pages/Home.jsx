import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import axios from '../axios';

import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';
import { fetchPosts, fetchTags, fetchPopularPosts } from '../redux/slices/posts';
import { Link } from 'react-router-dom';

export const Home = () => {
  const [tabValue, setTabValue] = useState(0); 
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data);
  const { posts, tags } = useSelector(state => state.posts);

  const isPostsLoading = posts.status == 'loading';
  const isTagsLoading = tags.status == 'loading';

  const handleChangeTab = (event, newValue) => {
	setTabValue(newValue);
	if(newValue == 1){
		dispatch(fetchPopularPosts());
		window.localStorage.setItem('page', 1);
	} else{
		dispatch(fetchPosts());
		window.localStorage.setItem('page', 0);
	}
  }

  React.useEffect(() => {
	if(!window.localStorage.getItem('page')){
		window.localStorage.setItem('page', 0);
		setTabValue(0);
		dispatch(fetchPosts())
	}
	const page = window.localStorage.getItem('page');
	if(page == 0){
		dispatch(fetchPosts());
		setTabValue(0);
	}
	if(page == 1){
		dispatch(fetchPopularPosts());
		setTabValue(1);
	}
    //dispatch(fetchPosts());
    dispatch(fetchTags());
  }, []);

  return (
		<>
			<Tabs
				style={{ marginBottom: 15 }}
				value={window.localStorage.getItem('page') ? tabValue: -1 }
				aria-label='basic tabs example'
				onChange={handleChangeTab}
			>
				<Tab label='Новые' component={Link} to='/' />
				<Tab label='Популярные' component={Link} to='/' />
			</Tabs>
			<Grid container spacing={4}>
				<Grid xs={8} item>
					{(isPostsLoading ? [...Array(5)] : posts.items).map((obj, index) =>
						isPostsLoading ? (
							<Post key={index} isLoading={true} />
						) : (
							<Post
								id={obj._id}
								title={obj.title}
								imageUrl={
									obj.imageUrl ? `http://localhost:4444/${obj.imageUrl}` : ''
								}
								user={obj.user}
								createdAt={obj.createdAt}
								viewsCount={obj.viewsCount}
								commentsCount={3}
								tags={obj.tags}
								isEditable={userData?._id == obj.user._id}
							/>
						)
					)}
				</Grid>
				<Grid xs={4} item>
					<TagsBlock items={tags.items} isLoading={isTagsLoading} />
					<CommentsBlock
						items={[
							{
								user: {
									fullName: 'Вася Пупкин',
									avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
								},
								text: 'Это тестовый комментарий',
							},
							{
								user: {
									fullName: 'Иван Иванов',
									avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
								},
								text: 'When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top',
							},
						]}
						isLoading={false}
					/>
				</Grid>
			</Grid>
		</>
	)
};
