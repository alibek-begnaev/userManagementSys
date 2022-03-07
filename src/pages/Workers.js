import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import useAxios from 'axios-hooks';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';

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
  Modal,
  Pagination,
  Box
} from '@mui/material';

// components
import AddPerson from '../components/AddPerson';
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, PersonListToolbar, UserMoreMenu } from '../components/_dashboard/user';
//
import USERLIST from '../_mocks_/user';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'firstName', label: 'Name', alignRight: false },
  { id: 'lastName', label: 'Lastname', alignRight: false },
  { id: 'patronym', label: 'Patronym', alignRight: false },
  { id: 'address', label: 'Address', alignRight: false },

  { id: 'inps', label: 'inps', alignRight: false },
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

export default function Workers() {
  const [userData, setUserData] = useState([]);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [pages, setPages] = useState(1);
  const token = window.localStorage.getItem('token');

  const isAdmin =
    window.localStorage.getItem('role') === 'Administrator' ||
    window.localStorage.getItem('role') === 'Manager';
  console.log(isAdmin);
  const [selectedFile, setSelectedFile] = useState(null);
  const [{ data: getImage, loading: imageLoading, error }, executePost] = useAxios(
    {
      headers: {
        Accept: '*/*',
        'Content-Type': 'multipart/form-data',
        authorization: `Bearer ${token}`
      },
      url: `/api/excel/upload`,
      method: 'POST'
    },
    { manual: true }
  );
  useEffect(() => {
    if (error) {
      alert(error?.response?.data?.message);
    }
  }, [error]);

  const [{ data: getData, loading: getLoading, error: getError }] = useAxios({
    headers: { authorization: `Bearer ${token}` },
    url: `person/person?page=${page + 1}&limit=${rowsPerPage}`,

    method: 'GET'
  });

  useEffect(() => {
    setUserData(getData?.data);
  }, [getData]);

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
  const onFileChange = (event) => {
    // Update the state
    setSelectedFile(event.target.files[0]);
    console.log(selectedFile);
  };
  const onFileUpload = () => {
    // Create an object of formData
    if (selectedFile) {
      const formData = new FormData();

      // Update the formData object
      formData.append('file', selectedFile, selectedFile.name);

      // Details of the uploaded file
      console.log(selectedFile);

      // Request made to the backend api
      // Send formData object
      setTimeout(() => {
        executePost({
          data: formData
        });
      }, 1000);
    }
  };
  // const emptyRows =
  //   page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userData ? userData.length : 0) : 0;

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
          {isAdmin && (
            <div
              style={{
                paddingTop: '10px'
              }}
            >
              <label htmlFor="contained-button-file" className="custom-file-upload">
                {/* <Input onChange={onFileChange} id="contained-button-file" multiple type="file" /> */}
                <input type="file" onChange={onFileChange} />
              </label>

              <Button color="primary" variant="contained" onClick={onFileUpload}>
                Import Users
              </Button>
            </div>
          )}
          {isAdmin && <AddPerson />}
        </Stack>

        <Card>
          <PersonListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            user={filteredUsers ? filteredUsers.filter((item) => selected[0] === item.inps) : {}}
          />

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
                        // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
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
                                {isAdmin && (
                                  <Checkbox
                                    checked={isItemSelected}
                                    onChange={(event) => handleClick(event, inps)}
                                  />
                                )}
                              </TableCell>
                              <TableCell component="th" scope="row" padding="none">
                                <Stack direction="row" alignItems="center" spacing={2}>
                                  <Typography variant="subtitle2" noWrap>
                                    {firstName}
                                  </Typography>
                                </Stack>
                              </TableCell>
                              <TableCell align="left">{lastName}</TableCell>
                              <TableCell align="left">{patronym}</TableCell>
                              <TableCell align="left">{address}</TableCell>

                              <TableCell align="left">{inps}</TableCell>
                              <TableCell align="left">{phone}</TableCell>
                              {/* {isAdmin && (
                                <TableCell align="right">
                                  <UserMoreMenu userDatas={row} />
                                </TableCell>
                              )} */}
                            </TableRow>
                          );
                        })
                    : 'Sorry You are not able to See these INFO'}

                  {/* {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )} */}
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
          {/* <Pagination
            count={userData?.length / 5}
            page={page}
            defaultPage={1}
            onChange={handleChangePage}
          /> */}

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={getData ? getData?.total : 10}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}
