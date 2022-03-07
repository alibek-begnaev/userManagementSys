import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import useAxios from 'axios-hooks';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';
import { useForm, Controller, useFieldArray } from 'react-hook-form';

// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  CircularProgress,
  Grid,
  TextField,
  Modal,
  Box
} from '@mui/material';

// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../components/_dashboard/user';
//

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'inps', label: 'inps', alignRight: false },
  { id: 'firstName', label: 'Firstame', alignRight: false },
  { id: 'lastName', label: 'Lastname', alignRight: false },
  { id: 'patronym', label: 'Patronym', alignRight: false },
  { id: 'address', label: 'Address', alignRight: false },

  { id: 'phone', label: 'phone', alignRight: false }
  // { id: '' }
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      (_user) =>
        _user.firstName.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.lastName.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.patronym.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.address.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.inps.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function SearchedPersons() {
  const [userData, setUserData] = useState([]);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const token = window.localStorage.getItem('token');

  const [selectedFile, setSelectedFile] = useState(null);

  const { register, handleSubmit, reset, setValue, control } = useForm();

  const [{ data: getData, loading: getLoading, error }, executePost] = useAxios(
    {
      headers: {
        authorization: `Bearer ${token}`
      },
      url: `/person/search`,
      method: 'POST'
    },
    { manual: true }
  );
  useEffect(() => {
    if (error) {
      alert(error?.response?.data?.message);
    }
  }, [error]);

  useEffect(() => {
    if (getData) setUserData(getData?.data);
  }, [getData]);
  const onSubmit = (data) => {
    executePost({
      data: {
        ...data
      }
    });
    console.log(data);
  };
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = userData ? userData.map((n) => n.inps) : '';
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userData ? userData.length : 0) : 0;

  const filteredUsers = userData
    ? applySortFilter(userData, getComparator(order, orderBy), filterName)
    : '';

  const isUserNotFound = filteredUsers.length === 0;
  if (getLoading) return <CircularProgress />;

  return (
    <Page title="User">
      <Container style={{ maxWidth: '100%' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            User
          </Typography>
        </Stack>
        <Card style={{ padding: 20, marginBottom: 20 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={3}>
                <TextField
                  {...register('inps')}
                  fullWidth
                  label="INPS"
                  id="outlined-basic"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  {...register('firstName')}
                  fullWidth
                  label="Firstname"
                  id="outlined-basic"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  {...register('lastName')}
                  fullWidth
                  label="Lastname"
                  id="outlined-basic"
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={3}>
                <TextField
                  {...register('patronym')}
                  fullWidth
                  label="Patronym"
                  id="outlined-basic"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={2}>
                <Button type="submit" variant="contained" color="primary">
                  Search
                </Button>
              </Grid>
              <Grid item xs={2}>
                <Button type="reset" variant="contained" color="secondary">
                  reset
                </Button>
              </Grid>
            </Grid>
          </form>
        </Card>

        {userData && (
          <Card>
            {/* <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          /> */}

            <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <UserListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={userData ? userData.length : 10}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAllClick}
                  />
                  <TableBody>
                    {userData
                      ? filteredUsers
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((row) => {
                            const {
                              inps,
                              firstName,
                              lastName,
                              phone,

                              address,
                              patronym
                            } = row;
                            // const skills = row.skills.map(({ title }) => title).join(', ');

                            const isItemSelected = selected.indexOf(inps) !== -1;

                            return (
                              <TableRow
                                hover
                                key={inps}
                                tabIndex={-1}
                                role="checkbox"
                                selected={isItemSelected}
                                aria-checked={isItemSelected}
                              >
                                <TableCell padding="checkbox">
                                  <Checkbox
                                    checked={isItemSelected}
                                    onChange={(event) => handleClick(event, inps)}
                                  />
                                </TableCell>
                                <TableCell component="th" scope="row" padding="none">
                                  <Stack direction="row" alignItems="center" spacing={2}>
                                    <Typography variant="subtitle2" noWrap>
                                      {inps}
                                    </Typography>
                                  </Stack>
                                </TableCell>
                                <TableCell align="left">{firstName}</TableCell>
                                <TableCell align="left">{lastName}</TableCell>
                                <TableCell align="left">{patronym}</TableCell>
                                <TableCell align="left">{address}</TableCell>

                                <TableCell align="left">{phone}</TableCell>
                              </TableRow>
                            );
                          })
                      : 'Search'}

                    {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>
                  {isUserNotFound && (
                    <TableBody>
                      <TableRow>
                        <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                          <SearchNotFound searchQuery={filterName} />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  )}
                </Table>
              </TableContainer>
            </Scrollbar>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={userData ? userData.length : 10}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        )}
      </Container>
    </Page>
  );
}
