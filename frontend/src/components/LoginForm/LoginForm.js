import { useMutation } from '@tanstack/react-query';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { TextInput, Text, Button, Group, Box, PasswordInput } from '@mantine/core';
import { useForm, isNotEmpty } from '@mantine/form';
import { IconEyeOff, IconEyeCheck } from '@tabler/icons';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import Loading from '../Loading/Loading';
import { useRef } from 'react';

async function postLoginInfo(values) {
	const response = await axios.post(process.env.REACT_APP_SERVER_URL + '/api/dj-rest-auth/login/', values);
	return response.data;
}

export default function LoginForm() {
	const navigate = useNavigate();
	const [, setCookie] = useCookies();
	const isError = useRef(false);
	const login = useMutation(postLoginInfo, {
		onSuccess: (data) => {
			setCookie('token', data.key, { path: '/', maxAge: 1000, secure: false, sameSite: 'strict' });
			navigate('/admin');
		},
		onError: () => (isError.current = true),
	});
	const form = useForm({
		initialValues: {
			username: '',
			password: '',
		},
		validate: {
			username: isNotEmpty('Required'),
			password: isNotEmpty('Required'),
		},
	});

	return (
		<Box className="w-full" maw={470} mx="auto" my="auto">
			<form onSubmit={form.onSubmit((values) => login.mutate(values))}>
				<TextInput
					label="Username"
					placeholder="Username"
					{...form.getInputProps('username')}
					disabled={login.isLoading}
					className="mb-1"
				/>
				<PasswordInput
					label="Password"
					placeholder="Password"
					visibilityToggleIcon={({ reveal, size }) =>
						reveal ? <IconEyeOff size={size} /> : <IconEyeCheck size={size} />
					}
					disabled={login.isLoading}
					{...form.getInputProps('password')}
				/>

				<Group position="center" mt="xl" className="flex flex-col">
					<Button variant="default" type="submit" miw={200} disabled={login.isLoading}>
						{login.isLoading ? 'Logging in...' : 'Login'}
					</Button>
					{isError.current && (
						<Text fz="xs" c="red">
							Incorrect username and password
						</Text>
					)}
				</Group>
			</form>
		</Box>
	);

	return (
		<div className="relative max-w-[90%] m-auto">
			{login.isLoading && <Loading />}
			<div className={login.isLoading ? `opacity-50` : ''}>
				<Formik
					initialValues={{ username: '', password: '' }}
					validationSchema={Yup.object({
						username: Yup.string().required('No username provided'),
						password: Yup.string().required('No password provided'),
					})}
					onSubmit={(values) => login.mutate(values)}
				>
					<Form className="w-[75%] max-w-[400px] my-8 m-auto">
						<h1 className="w-fit mx-auto text-2xl">ADMIN</h1>
						<div className="m-auto w-full">
							<div className={`${login.isError ? 'block' : 'hidden'} text-[0.70rem] mb-2 text-red-500 font-bold`}>
								Incorrect username or password
							</div>
							<Field
								name="username"
								type="text"
								placeholder="Username"
								className="block w-full mb-1 py-[.65em] px-2 text-xs border border-solid boder-slate-200 bg-slate-100 rounded"
								disabled={login.isLoading}
							/>
							<div className="text-[0.70rem] mb-2 text-red-500">
								<ErrorMessage name="username" />
							</div>
							<Field
								name="password"
								type="password"
								placeholder="Password"
								className="block w-full mb-1 py-[.65em] px-2 text-xs border border-solid boder-slate-200 bg-slate-100 rounded"
								disabled={login.isLoading}
							/>
							<div className="text-[0.70rem] mb-2 text-red-500">
								<ErrorMessage name="password" />
							</div>
							<button
								type="submit"
								className="w-full px-2 py-2.5 mt-2 bg-slate-500 rounded border-0 font-bold text-xs text-white hover:cursor-pointer transform transition"
								disabled={login.isLoading}
							>
								Login
							</button>
						</div>
					</Form>
				</Formik>
			</div>
		</div>
	);
}
