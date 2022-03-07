import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
import editFill from '@iconify/icons-eva/edit-fill';
import { Link as RouterLink } from 'react-router-dom';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';

// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import plusFill from '@iconify/icons-eva/plus-fill';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';

import UserProfile from '../../userProfile';
import UserDetails from '../../UserDetails';
// ----------------------------------------------------------------------
const style = {
  position: 'relative',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '1000px',
  height: '120%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
};
export default function UserMoreMenu(props) {
  const { userDatas } = props;
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => {
    setIsOpen(true);
    console.log(userDatas);
  };
  const closeModal = () => {
    setIsOpen(false);
  };
  return (
    <>
      {/* <IconButton ref={ref} onClick={openModal}>
        <Icon icon={editFill} width={20} height={20} />
      </IconButton> */}
      <Button variant="contained" onClick={openModal} startIcon={<Icon icon={editFill} />}>
        Edit
      </Button>
      <Dialog
        open={isOpen}
        onClose={closeModal}
        maxWidth="lg"
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogContent>
          <UserDetails user={userDatas} closeM={closeModal} />
        </DialogContent>
      </Dialog>
      {/* <Modal
        open={isOpen}
        onClose={closeModal}
        disableScrollLock="true"
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h2 id="parent-modal-title">ADD New User</h2>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                name="password"
                id="filled-required"
                label="password"
                variant="filled"
              />
            </Grid>
          </Grid>
          <Button type="submit" style={{ marginTop: 20 }} variant="contained">
            New User
          </Button>
          
          
        </Box>
      </Modal> */}
      {/* <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' }
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Icon icon={trash2Outline} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Delete" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

        <MenuItem component={RouterLink} to="#" sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Icon icon={editFill} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Edit" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
      </Menu> */}
    </>
  );
}
