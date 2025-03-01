import React from "react";
import Typography from "@mui/material/Typography";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { useForm } from 'react-hook-form';

import styles from "./Login.module.scss";
import { fetchAuth, selectIsAuth } from "../../redux/slices/auth";

export const Login = () => {
  const isAuth = useSelector(selectIsAuth)
  const dispatch = useDispatch();

  const { register, handleSubmit, setError, formState: { errors, isValid }} = useForm({
    defaultValues: {
      email: '',
      password: ''
    },
    mode: 'onChange',
  });

  const onSubmit = async (values) => {
    const data = await dispatch(fetchAuth(values));

    if('error' in data) {
	  console.log(data);
	  if (data.payload.message) {
			alert(data.payload.message);	
		}
	  data.payload.forEach((error)=>{
		setError(error.path, {type: 'server', message: error.msg});
	  });
      return alert("Не удалось авторизоваться!");
    }

    if('token' in data.payload){
      window.localStorage.setItem('token', data.payload.token);
    }
  };



  if(isAuth){
    return <Navigate to="/" />
  }

  return (
		<Paper classes={{ root: styles.root }}>
			<Typography classes={{ root: styles.title }} variant='h5'>
				Вход в аккаунт
			</Typography>
			<form onSubmit={handleSubmit(onSubmit)}>
				<TextField
					className={styles.field}
					label='E-Mail'
					error={Boolean(errors.email?.message)}
					helperText={errors.email?.message}
          type="email"
					{...register('email', { required: 'Укажите почту' })}
					fullWidth
				/>
				<TextField
					className={styles.field}
					label='Пароль'
          type="password"
					error={Boolean(errors.password?.message)}
					helperText={errors.password?.message}
					{...register('password', { required: 'Введите пароль' })}
					fullWidth
				/>
				<Button disabled={!isValid} type='submit' size='large' variant='contained' fullWidth>
					Войти
				</Button>
			</form>
		</Paper>
	)
};
