import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import useAxios from 'axios-hooks';
// material
import {
  Link,
  Stack,
  Checkbox,
  TextField,
  IconButton,
  InputAdornment,
  FormControlLabel
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    login: Yup.string().required('login is required'),
    password: Yup.string().required('Password is required')
  });
  const [{ data: response, loading, error }, executePost] = useAxios(
    {
      headers: { authorization: '' },
      url: `/auth/login`,
      method: 'POST'
    },
    { manual: true }
  );

  useEffect(() => {
    if (response) {
      window.localStorage.setItem('token', response.token);
      window.localStorage.setItem('role', response.data.role);
      window.localStorage.setItem('id', response.data._id);
      window.localStorage.setItem('firstName', response.data.firstName);
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 1000);
    }
  }, [response]);

  const formik = useFormik({
    initialValues: {
      login: '',
      password: ''
    },
    validationSchema: LoginSchema,
    onSubmit: () => {
      console.log(formik.values);
      executePost({
        data: {
          ...formik.values
        }
      });
    }
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps, setSubmitting } =
    formik;
  useEffect(() => {
    if (error) {
      setSubmitting(false);
      alert(error?.response?.data?.message);
    }
  }, [error]);
  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            autoComplete="username"
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
                  <IconButton onClick={handleShowPassword} edge="end">
                    <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                  </IconButton>
                </InputAdornment>
              )
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
          {/* <FormControlLabel
            control={<Checkbox {...getFieldProps('remember')} checked={values.remember} />}
            label="Remember me"
          />

          <Link component={RouterLink} variant="subtitle2" to="#">
            Forgot password?
          </Link> */}
        </Stack>

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Login
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}
