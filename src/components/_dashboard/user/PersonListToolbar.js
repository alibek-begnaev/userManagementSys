import React, { useState, useEffect } from 'react';
import useAxios from 'axios-hooks';

import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import searchFill from '@iconify/icons-eva/search-fill';
import trash2Fill from '@iconify/icons-eva/trash-2-fill';
import roundFilterList from '@iconify/icons-ic/round-filter-list';
// material
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import {
  Box,
  Toolbar,
  Tooltip,
  IconButton,
  Typography,
  OutlinedInput,
  InputAdornment,
  Button
} from '@mui/material';

// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3)
}));

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter
  }),
  '&.Mui-focused': { width: 320, boxShadow: theme.customShadows.z8 },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.grey[500_32]} !important`
  }
}));

// ----------------------------------------------------------------------

PersonListToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  user: PropTypes.array
};

export default function PersonListToolbar({ numSelected, filterName, onFilterName, user }) {
  const token = window.localStorage.getItem('token');
  const userId = user ? user[0]?._id : '';
  const isAdmin = 'Administrator';
  const [{ data: response, loading, error }, executePut] = useAxios(
    {
      headers: { authorization: `Bearer ${token}` },
      url: `/person/${userId}`,
      method: 'PUT'
    },
    { manual: true }
  );
  useEffect(() => {
    if (response?.success) {
      alert('UPDATED SUCCESSFULLY');
      window.location.reload();
    }
  }, response);
  const onDelete = () => {
    executePut({
      data: {
        isDeleted: true
      }
    });
  };
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <RootStyle
      sx={{
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter'
        })
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <SearchStyle
          value={filterName}
          onChange={onFilterName}
          placeholder="Search user..."
          startAdornment={
            <InputAdornment position="start">
              <Box component={Icon} icon={searchFill} sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          }
        />
      )}

      {numSelected > 0 ? (
        <Button onClick={handleClickOpen}>
          <IconButton>
            <Icon icon={trash2Fill} />
          </IconButton>
        </Button>
      ) : (
        ''
      )}
      <Dialog
        open={open}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Are You Sure To Delete</DialogTitle>

        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={onDelete}>Agree</Button>
        </DialogActions>
      </Dialog>
    </RootStyle>
  );
}
