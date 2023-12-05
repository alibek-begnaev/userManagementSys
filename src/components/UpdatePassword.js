import React, { useState, useContext, useEffect } from 'react';
import { Grid, Button, IconButton, TextField, MenuItem } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import useAxios from 'axios-hooks';

export default function UpdatePassword() {
  const { register, handleSubmit, setValue, control } = useForm();
  const token = window.localStorage.getItem('token');

  const [{ data: userData, loading: getLoading, error: getError }] = useAxios({
    headers: { authorization: `Bearer ${token}` },
    url: `/users/1`,
    method: 'GET'
  });

  const user = userData;

  const [{ data: response, loading, error }, executePut] = useAxios(
    {
      headers: { authorization: `Bearer ${token}` },
      url: `/auth/updatePassword/${user?._id}`,
      method: 'PUT'
    },
    { manual: true }
  );
  useEffect(() => {
    if (error) {
      alert(error?.response?.data?.message);
    }
  }, [error]);
  useEffect(() => {
    if (response?.success) {
      alert('UPDATED SUCCESSFULLY');
    }
  }, response);

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
      <h1 style={{ textAlign: 'center', marginBottom: '40px' }}>Update Password</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        {user && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                {...register('oldPassword', { required: true })}
                fullWidth
                type="password"
                label="Old Password"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...register('password', { required: true })}
                fullWidth
                type="password"
                label="New Password"
                variant="outlined"
              />
            </Grid>
            <Grid style={{ display: 'flex', justifyContent: 'end' }} item xs={12}>
              <Button type="submit" variant="contained" color="primary">
                Update Password
              </Button>
            </Grid>
          </Grid>
        )}
      </form>
    </div>
  );
}
