import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Grid, Container } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { SIGN_IN } from '../graphql/mutations';
import EyesOpen from '../components/icons/EyesOpen';
import EyesClose from '../components/icons/EyesClose';
import LockIcons from '../components/icons/LockIcons';
import { ToastContainer, toast } from 'react-toastify';
import { setCookie } from '../utils/setCookie';

const Signin = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [signInMutation, { loading }] = useMutation(SIGN_IN);
    const navigate = useNavigate();

    const validationSchema = Yup.object().shape({
        email: Yup.string().matches(/^([a-zA-Z0-9_.]+@[a-z]+\.[a-z]{2,99})?$/, 'Invalid email').required('Email is required.'),
        password: Yup.string().matches(/^(?!\d)[A-Za-z0-9]{4,}$(?=.*[A-Za-z])?$/, 'Use 4 or more Char.').required('Password is required.'),
    });

    const handleSubmit = async (values, { resetForm }) => {
        const { email, password } = values;
        try {
            const { data } = await signInMutation({
                variables: { email, password }
            });
            setCookie('token', data.userSignin.token, 1);
            toast.success('Login successful')
            setTimeout(() => {
                navigate('/');
            }, 800)

        } catch (error) {
            toast.error(`${error.graphQLErrors[0].message}`);
        }
        resetForm();
    };

    return (
        <>
            <Formik
                initialValues={{
                    email: '',
                    password: '',
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ errors, touched }) => (
                    <Form>
                        <div className='h-screen-center'>
                            <div className='card-from'>
                                <div className='card-header'>
                                    <div className='lock-icons'>
                                        <LockIcons />
                                    </div>
                                </div>
                                <Container maxWidth='xs'>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <Field
                                                name='email'
                                                as={TextField}
                                                label='Email'
                                                error={touched.email && Boolean(errors.email)}
                                                helperText={touched.email && errors.email}
                                                fullWidth
                                                size='small'
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Field
                                                name='password'
                                                type={showPassword ? 'text' : 'password'}
                                                as={TextField}
                                                label='Password'
                                                error={touched.password && Boolean(errors.password)}
                                                helperText={touched.password && errors.password}
                                                fullWidth
                                                size='small'
                                                InputProps={{
                                                    endAdornment: (
                                                        <div className='icons-password' onClick={() => setShowPassword((prev) => !prev)}>
                                                            {showPassword ? <EyesOpen /> : <EyesClose />}
                                                        </div>
                                                    ),
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Button type='submit' variant='contained' color='primary' fullWidth disabled={loading}>
                                                {loading ? 'Loading...' : 'Sign In'}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Container>

                                <p className='donot-have'>
                                    Don't have an account <Link to={'/sign-up'} className='link'>Sign Up ?</Link>
                                </p>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
            <ToastContainer position="top-left" />
        </>

    );
};

export default Signin;
