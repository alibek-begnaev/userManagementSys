import React, { useState, useContext, useEffect } from 'react';
import { Grid, Button, IconButton, TextField, MenuItem, Checkbox } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import useAxios from 'axios-hooks';

export default function UserDetails(props) {
  const { user, closeM } = props;
  const token = window.localStorage.getItem('token');
  const isAdministrator = 'Administrator';
  const [role, setRole] = React.useState();

  const handleChange = (event) => {
    setRole(event.target.value);
  };
  console.log('user', user);

  const { register, handleSubmit, setValue, control } = useForm();

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
      closeM();
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
  useEffect(() => {
    if (error) {
      alert(error?.response?.data?.message);
    }
  }, [error]);
  useEffect(() => {
    if (user)
      Object.entries(user).forEach(([key, value]) => {
        setValue(key, value);
      });
  }, [user]);

  return (
    <div
      style={{
        backgroundColor: 'white',
        padding: '30px 20px',
        borderRadius: '15px',
        boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1) , 0px 4px 6px -2px rgba(0,0,0,0.05) '
      }}
      className="Home"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <TextField
              {...register('firstName')}
              fullWidth
              id="outlined-basic"
              label="Firstname"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              {...register('lastName')}
              fullWidth
              id="outlined-basic"
              label="Lastname"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              {...register('patronym')}
              fullWidth
              id="outlined-basic"
              label="Patronym"
              variant="outlined"
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              {...register(`birthday`)}
              fullWidth
              id="outlined-basic"
              label="birthday"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              {...register(`phone`)}
              fullWidth
              id="outlined-basic"
              label="Phone number"
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              {...register('address')}
              fullWidth
              id="outlined-basic"
              label="Address"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              {...register('login')}
              fullWidth
              id="outlined-basic"
              label="Login"
              variant="outlined"
            />
          </Grid>
          {isAdministrator && (
            <Grid item xs={6}>
              <TextField
                id="filled-select-currency"
                select
                fullWidth
                label="Role"
                value={role}
                defaultValue={user.role}
                onChange={handleChange}
                {...register('role', {
                  required: true
                })}
                variant="filled"
              >
                <MenuItem value="Manager">Manager</MenuItem>
                <MenuItem value="Client">User</MenuItem>
              </TextField>
            </Grid>
          )}
          <Grid item xs={6}>
            Active
            <Controller
              name="isActive"
              defaultValue={user.isActive}
              control={control}
              render={({ field }) => (
                <Checkbox
                  onChange={(e) => field.onChange(e.target.checked)}
                  checked={field.value}
                />
              )}
            />
          </Grid>
          <Grid style={{ display: 'flex', justifyContent: 'end' }} item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Save Changes
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}
