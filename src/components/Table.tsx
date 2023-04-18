import * as React from 'react';
import { useEffect } from 'react';
import { User, deleteUser, filterUsers } from '../features/counter/userSlice';
//components
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, Grid, IconButton, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Modal from './Modal';
//css
import './table.css';
import { useAppDispatch } from '../app/hooks';

type Props = {
  users: User[];
};

export default function BasicTable({ users }: Props) {
  const dispatch = useAppDispatch();
  const [open, setOpen] = React.useState(false);
  const [user, setUser] = React.useState<User | null>(null);
  const handleOpen = (user: User | null) => {
    setUser(user);
    setOpen(true);
  };
  const handleDelete = (email: string) => {
    dispatch(deleteUser(email));
  };
  return (
    <>
      <SearchArea users={users} open={open} />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name </TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>ID</TableCell>
              <TableCell align="center">Edit</TableCell>
              <TableCell align="center">Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user: User) => (
              <TableRow
                key={user.email}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {user.name}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <img src={user.image} />
                </TableCell>
                <TableCell>{user.location}</TableCell>
                <TableCell>{user.id}</TableCell>
                <TableCell>
                  <IconButton
                    aria-label="edit"
                    onClick={() => handleOpen(user)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton
                    aria-label="delete"
                    onClick={() => handleDelete(user.email)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="addUserBtn">
        <Button
          variant="contained"
          endIcon={<AddIcon />}
          onClick={() => handleOpen(null)}>
          Add User
        </Button>
      </div>
      <Modal open={open} setOpen={setOpen} user={user} users={users} />
    </>
  );
}

const SearchArea = ({ users, open }: { users: User[]; open: boolean }) => {
  const dispatch = useAppDispatch();

  const [filterValues, setFilterValues] = React.useState<User>({
    name: '',
    email: '',
    location: '',
    id: '',
    image: '',
  });

  useEffect(() => {
    //set filters
    dispatch(filterUsers(filterValues));
  }, [filterValues]);
  useEffect(() => {
    //set filters
    setFilterValues({
      name: '',
      email: '',
      location: '',
      id: '',
      image: '',
    });
  }, [open]);

  const handleSearch = (
    text: string,
    input: 'name' | 'email' | 'location' | 'id'
  ) => {
    setFilterValues((prev) => {
      let temp = { ...prev };
      temp[input] = text;
      return temp;
    });
  };
  return (
    <Grid
      container
      direction="row"
      justifyContent="flex-start"
      alignItems="center"
      spacing={2}>
      <Grid item>
        <TextField
          margin="normal"
          label="Name"
          value={filterValues.name}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            handleSearch(event.target.value, 'name');
          }}
        />
      </Grid>
      <Grid item>
        <TextField
          margin="normal"
          label="Email"
          value={filterValues?.email}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            handleSearch(event.target.value, 'email');
          }}
        />
      </Grid>
      <Grid item>
        <TextField
          margin="normal"
          label="ID"
          value={filterValues?.id}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            handleSearch(event.target.value, 'id');
          }}
        />
      </Grid>
      <Grid item>
        <TextField
          margin="normal"
          label="Location"
          value={filterValues?.location}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            handleSearch(event.target.value, 'location');
          }}
        />
      </Grid>
    </Grid>
  );
};
