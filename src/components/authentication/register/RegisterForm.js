import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useFormik, Form, FormikProvider } from 'formik';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import { useNavigate } from 'react-router-dom';
// material
import { Stack, TextField, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import useAxios from 'axios-hooks';

// ----------------------------------------------------------------------

export default function RegisterForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('First name required'),
    lastName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Last name required'),
    // email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
    patronym: Yup.string().required('Patronym is required'),
    address: Yup.string().required('Address is required'),
    login: Yup.string().required('Login is required')
  });
  const [{ data: response, loading, error }, executePut] = useAxios(
    {
      headers: { authorization: '' },
      url: `/auth/signup`,
      method: 'PUT'
    },
    { manual: true }
  );

  useEffect(() => {
    if (response) {
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 1000);
    }
  }, [response]);
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      patronym: '',
      address: '',
      login: '',

      password: ''
    },
    validationSchema: RegisterSchema,
    onSubmit: () => {
      console.log(formik.values);
      executePut({
        data: {
          ...formik.values
        }
      });
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label="First name"
              {...getFieldProps('firstName')}
              error={Boolean(touched.firstName && errors.firstName)}
              helperText={touched.firstName && errors.firstName}
            />

            <TextField
              fullWidth
              label="Last name"
              {...getFieldProps('lastName')}
              error={Boolean(touched.lastName && errors.lastName)}
              helperText={touched.lastName && errors.lastName}
            />
            <TextField
              fullWidth
              label="Patronym"
              {...getFieldProps('patronym')}
              error={Boolean(touched.patronym && errors.patronym)}
              helperText={touched.patronym && errors.patronym}
            />
          </Stack>
          <TextField
            fullWidth
            label="Address"
            {...getFieldProps('address')}
            error={Boolean(touched.address && errors.address)}
            helperText={touched.address && errors.address}
          />
          <TextField
            fullWidth
            autoComplete="login"
            label="Login"
            {...getFieldProps('login')}
            error={Boolean(touched.login && errors.login)}
            helperText={touched.login && errors.login}
          />

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            {...getFieldProps('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                    <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                  </IconButton>
                </InputAdornment>
              )
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Register
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
