import React, { useState, useContext, useEffect } from 'react';
import { Grid, Button, Typography, TextField, MenuItem } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import useAxios from 'axios-hooks';

export default function UserProfile() {
  const { register, handleSubmit, setValue, control } = useForm();
  const token = window.localStorage.getItem('token');

  const [{ data: userData, loading: getLoading, error: getError }] = useAxios({
    headers: { authorization: `Bearer ${token}` },
    url: `/user/current`,
    method: 'GET'
  });

  const user = userData?.data;
  useEffect(() => {
    if (user)
      Object.entries(user).forEach(([key, value]) => {
        setValue(key, value);
      });
  }, [user]);

  const [{ data: response, loading, error }, executePut] = useAxios(
    {
      headers: { authorization: `Bearer ${token}` },
      url: `/user/${user?._id}`,
      method: 'PUT'
    },
    { manual: true }
  );

  useEffect(() => {
    if (response?.success) {
      alert('UPDATED SUCCESSFULLY');
    }
  }, response);
  useEffect(() => {
    if (error) {
      alert(error?.response?.data?.message);
    }
  }, [error]);
  const onSubmit = (data) => {
    console.log(data);
    executePut({
      data: {
        ...data
      }
    });
  };

  return (
    <div
      style={{
        margin: '50px',
        backgroundColor: 'white',
        padding: '30px 20px',
        borderRadius: '15px',
        boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1) , 0px 4px 6px -2px rgba(0,0,0,0.05) '
      }}
      className="Home"
    >
      <h1 style={{ textAlign: 'center', marginBottom: '40px' }}>Profile</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        {user && (
          <Grid container spacing={3}>
            <Grid style={{ display: 'flex', justifyContent: 'center' }} item xs={6}>
              <Typography variant="h5" gutterBottom component="div">
                Firstname
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <TextField
                {...register('firstName')}
                fullWidth
                label="Firstname"
                variant="outlined"
              />
            </Grid>{' '}
            <Grid style={{ display: 'flex', justifyContent: 'center' }} item xs={6}>
              <Typography variant="h5" gutterBottom component="div">
                Lastname
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <TextField {...register('lastName')} fullWidth label="Lastname" variant="outlined" />
            </Grid>{' '}
            <Grid style={{ display: 'flex', justifyContent: 'center' }} item xs={6}>
              <Typography variant="h5" gutterBottom component="div">
                Patronym
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <TextField {...register('patronym')} fullWidth label="Patronym" variant="outlined" />
            </Grid>
            <Grid style={{ display: 'flex', justifyContent: 'center' }} item xs={6}>
              <Typography variant="h5" gutterBottom component="div">
                birthday
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <TextField {...register(`birthday`)} fullWidth label="birthday" variant="outlined" />
            </Grid>{' '}
            <Grid style={{ display: 'flex', justifyContent: 'center' }} item xs={6}>
              <Typography variant="h5" gutterBottom component="div">
                Phone number
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <TextField {...register(`phone`)} fullWidth label="Phone number" variant="outlined" />
            </Grid>
            <Grid style={{ display: 'flex', justifyContent: 'center' }} item xs={6}>
              <Typography variant="h5" gutterBottom component="div">
                Address
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <TextField {...register('address')} fullWidth label="Address" variant="outlined" />
            </Grid>{' '}
            <Grid style={{ display: 'flex', justifyContent: 'center' }} item xs={6}>
              <Typography variant="h5" gutterBottom component="div">
                Login
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <TextField {...register('login')} fullWidth label="Login" variant="outlined" />
            </Grid>
            <Grid style={{ display: 'flex', justifyContent: 'end' }} item xs={12}>
              <Button type="submit" variant="contained" color="primary">
                Save Changes
              </Button>
            </Grid>
          </Grid>
        )}
      </form>
    </div>
  );
}
