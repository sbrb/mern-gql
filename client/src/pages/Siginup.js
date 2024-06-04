import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Grid, Container } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { CloudinaryContext, Image } from 'cloudinary-react'; 
import { ToastContainer, toast } from 'react-toastify';
import { SIGN_UP } from '../graphql/mutations';
import EyesOpen from '../components/icons/EyesOpen';
import EyesClose from '../components/icons/EyesClose';
import UserIcons from '../components/icons/UserIcons';
import { setCookie } from '../utils/setCookie';


const Signup = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [profilePic, setProfilePic] = useState(null);
    const [signUpMutation, { loading }] = useMutation(SIGN_UP);
    const navigate = useNavigate();

    const validationSchema = Yup.object().shape({
        firstName: Yup.string().matches(/^[a-zA-Z]*$/, "Name can't contain numbers.").required('First Name is required.'),
        lastName: Yup.string().matches(/^[a-zA-Z]*$/, "Name can't contain numbers.").required('Last Name is required.'),
        userName: Yup.string()
            .matches(/^(?!\d)[A-Za-z0-9]*[A-Za-z][A-Za-z0-9]*$/, "Username can't start with numbers.")
            .min(3, 'Username must be at least 3 characters')
            .max(15, 'Username must not exceed 15 characters')
            .required('Username is required.'),
        phone: Yup.string()
            .matches(/^\d{10}$/, 'Phone number must be 10 digits')
            .required('Phone number is required.'),
        email: Yup.string().matches(/^([a-zA-Z0-9_.]+@[a-z]+\.[a-z]{2,99})?$/, 'Invalid email').required('Email is required.'),
        password: Yup.string().matches(/^(?!\d)[A-Za-z0-9]{4,}$(?=.*[A-Za-z])?$/, 'Use 4 or more Char.').required('Password is required.'),
    });

    const handleSubmit = async (values, { resetForm }) => {
        const { firstName, lastName, userName, phone, email, password } = values;
        try {
            let profilePicUrl = null;
            if (profilePic) {
                profilePicUrl = profilePic;
            }

            const { data } = await signUpMutation({
                variables: {
                    firstName,
                    lastName,
                    userName,
                    phone,
                    email,
                    password,
                    profilePic: profilePicUrl,
                }
            });
            resetForm();
            setProfilePic(null);
            setCookie('token', data.userSignUp.token, 1);
            toast.success('Registration successful')
            setTimeout(() => {
                navigate('/'); 
            }, 800)
        } catch (error) {
            toast.error(`${error.graphQLErrors[0].message}`);
        }
    };

    const handleUploadFile = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('upload_preset', 'cloudinary');
                const response = await fetch('https://api.cloudinary.com/v1_1/ddvjlniy0/image/upload', {
                    method: 'POST',
                    body: formData,
                });
                const data = await response.json();
                setProfilePic(data.secure_url);
            } catch (error) {
                toast.error(`${error.graphQLErrors[0].message}`);
            }
        }
    };

    return (
         <>
        <Formik
            initialValues={{
                firstName: '',
                lastName: '',
                userName: '',
                phone: '',
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
                                <div className='sign-form-lock-container'>
                                    {profilePic ? (
                                        <CloudinaryContext cloudName="ddvjlniy0">
                                            {profilePic ? (
                                                <Image publicId={profilePic} width="150" height="150" crop="fill" radius="max" className='profile-pic ' />
                                            ) : (
                                                <div className='lock-icons'>
                                                    <UserIcons />
                                                </div>
                                            )}
                                        </CloudinaryContext>

                                    ) : (
                                        <div className='lock-icons'>
                                            <UserIcons />
                                        </div>
                                    )}

                                    <label htmlFor='upload-pic-input'>
                                        <div className='upload-pic-text'>Upload Pic</div>
                                        <input
                                            type='file'
                                            id='upload-pic-input'
                                            onChange={handleUploadFile}
                                            style={{ display: 'none' }}
                                        />
                                    </label>
                                </div>
                            </div>
                            <br />
                            <Container maxWidth='xs'>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={12}>
                                        <Field
                                            name='firstName'
                                            as={TextField}
                                            label='First Name'
                                            error={touched.firstName && Boolean(errors.firstName)}
                                            helperText={touched.firstName && errors.firstName}
                                            fullWidth
                                            variant='outlined'
                                            size='small'
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <Field
                                            name='lastName'
                                            as={TextField}
                                            label='Last Name'
                                            error={touched.lastName && Boolean(errors.lastName)}
                                            helperText={touched.lastName && errors.lastName}
                                            fullWidth
                                            variant='outlined'
                                            size='small'
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Field
                                            name='userName'
                                            as={TextField}
                                            label='Username'
                                            error={touched.userName && Boolean(errors.userName)}
                                            helperText={touched.userName && errors.userName}
                                            fullWidth
                                            variant='outlined'
                                            size='small'
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Field
                                            name='phone'
                                            as={TextField}
                                            label='Phone'
                                            error={touched.phone && Boolean(errors.phone)}
                                            helperText={touched.phone && errors.phone}
                                            fullWidth
                                            variant='outlined'
                                            size='small'
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Field
                                            name='email'
                                            as={TextField}
                                            label='Email'
                                            error={touched.email && Boolean(errors.email)}
                                            helperText={touched.email && errors.email}
                                            fullWidth
                                            variant='outlined'
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
                                            variant='outlined'
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
                                            {loading ? 'Loading...' : 'Sign Up'}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Container>

                            <p className='donot-have'>
                                Already have an account <Link to={'/sign-in'} className='link'>Sign In ?</Link>
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

export default Signup;
