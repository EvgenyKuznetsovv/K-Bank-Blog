import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import axios from '../../axios';

import styles from './Login.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAuth, fetchRegister, selectIsAuth } from '../../redux/slices/auth';
import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';


export const Registration = () => {
  const inputFileRef = React.useRef(null);
  const [imageUrl, setImageUrl ] = React.useState('');
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch();
  const {register, handleSubmit, setError, formState: { errors, isValid }} = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
	  avatarUrl: ''
    },
    mode: 'onChange',
  });

  const handleChangeFile = async (event) => {
	try {
		const formData = new FormData();
		const file = event.target.files[0];
		formData.append('image', file);
		const { data } = await axios.post('/upload', formData);
		setImageUrl(`http://localhost:4444/${data.url}`);
		console.log(imageUrl);
	} catch (err) {
		console.warn(err);
		alert("Ошибка при загрузке картинки");
	}
  }

  const onClickRemoveImage = () => {
	setImageUrl('');
  }

  const onSubmit = async (values) => {
	values.avatarUrl = imageUrl;

    const data = await dispatch(fetchRegister(values));

    if(!data.payload){
      console.log(data);
      return alert("Не удалось зарегистрироваться!");
    }

    if('token' in data.payload) {
      window.localStorage.setItem('token', data.payload.token);
    }
  };

  if(isAuth){
    return <Navigate to="/" />
  }

  return (
		<Paper classes={{ root: styles.root }}>
			<Typography classes={{ root: styles.title }} variant='h5'>
				Создание аккаунта
			</Typography>
			<div className={styles.avatar}>
				<Avatar
					sx={{ width: 100, height: 100 }}
					src={imageUrl}
					title='Нажмите, чтобы загрузить фото'
					onClick={() => inputFileRef.current.click()}
				/>
			</div>
			<input
				ref={inputFileRef}
				type='file'
				onChange={handleChangeFile}
				hidden
			/>
			{imageUrl && (
				<div className={styles['remove-button']}>
					<Button
						variant='contained'
						color='error'
						onClick={onClickRemoveImage}
					>
						Удалить фото
					</Button>
				</div>
			)}
			<form onSubmit={handleSubmit(onSubmit)}>
				<TextField
					error={Boolean(errors.fullName?.message)}
					helperText={errors.fullName?.message}
					{...register('fullName', { required: 'Укажите полное имя' })}
					className={styles.field}
					label='Полное имя'
					fullWidth
				/>
				<TextField
					error={Boolean(errors.email?.message)}
					helperText={errors.email?.message}
					type='email'
					{...register('email', { required: 'Укажите почту' })}
					className={styles.field}
					label='E-Mail'
					fullWidth
				/>
				<TextField
					error={Boolean(errors.password?.message)}
					helperText={errors.password?.message}
					type='password'
					{...register('password', { required: 'Введите пароль' })}
					className={styles.field}
					label='Пароль'
					fullWidth
				/>
				<Button
					disabled={!isValid}
					type='submit'
					size='large'
					variant='contained'
					fullWidth
				>
					Зарегистрироваться
				</Button>
			</form>
		</Paper>
	)
};
