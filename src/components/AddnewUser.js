import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import useAxios from 'axios-hooks';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import plusFill from '@iconify/icons-eva/plus-fill';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
};

export default function AddNewUser() {
  const [modal, setModal] = useState();
  const { register, handleSubmit, setValue, control } = useForm();
  const isAdministrator = 'Administrator';
  const [role, setRole] = React.useState();

  const handleChange = (event) => {
    setRole(event.target.value);
  };
  const openModal = () => {
    setModal(true);
  };
  const closeModal = () => {
    setModal(false);
  };
  const token = window.localStorage.getItem('token');

  const [{ data: response, loading, error }, executePost] = useAxios(
    {
      headers: { authorization: `Bearer ${token}` },
      url: `/user`,
      method: 'POST'
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
    executePost({
      data: {
        ...data
      }
    });
  };
  return (
    <div>
      <Button variant="contained" onClick={openModal} startIcon={<Icon icon={plusFill} />}>
        New User
      </Button>
      <Modal
        open={modal}
        onClose={closeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h2 id="parent-modal-title">ADD New User</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  {...register('login', {
                    required: true
                  })}
                  id="standard-required"
                  label="*Login"
                  variant="standard"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  {...register('password', {
                    required: true
                  })}
                  id="standard-required"
                  label="*Password"
                  variant="standard"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  {...register('firstName')}
                  id="filled-required"
                  label="First Name"
                  variant="filled"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  {...register('lastName')}
                  id="standard-required"
                  label="Last Name"
                  variant="filled"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  {...register('patronym')}
                  id="filled-required"
                  label="MiddleName"
                  variant="standard"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  {...register('phone')}
                  id="filled-required"
                  label="Phone"
                  variant="standard"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  {...register('address')}
                  id="filled-required"
                  label="Address"
                  variant="filled"
                />
              </Grid>
              {isAdministrator && (
                <Grid item xs={6}>
                  <TextField
                    id="filled-select-currency"
                    select
                    fullWidth
                    label="*Role"
                    value={role}
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
            </Grid>

            <Button type="submit" style={{ marginTop: 20 }} variant="contained">
              Submit
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
