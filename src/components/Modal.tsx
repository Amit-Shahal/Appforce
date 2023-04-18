import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { Button, Grid, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { User } from '../features/counter/userSlice';
import { useAppDispatch } from '../app/hooks';
import { addUser, editUser } from '../features/counter/userSlice';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  user: User | null;
  users: User[];
};

export default function BasicModal({ open, setOpen, user, users }: Props) {
  const dispatch = useAppDispatch();
  const [isValid, setIsValid] = React.useState({
    name: true,
    email: true,
    location: true,
    unique: true,
  });
  const [form, setForm] = React.useState<User>({
    name: '',
    email: '',
    image: '',
    location: '',
    id: '',
  });

  React.useEffect(() => {
    const initForm = user
      ? user
      : {
          name: '',
          email: '',
          image: '',
          location: '',
          id: '',
        };
    setForm(initForm);
  }, [user]);

  const handleClose = () => {
    setIsValid({
      name: true,
      email: true,
      location: true,
      unique: true,
    });

    setOpen(false);
  };
  const handleSubmit = () => {
    //validate form
    let isValid = validateForm();
    if (!isValid) {
      return;
    }
    if (!user) {
      isValid = validateUniqueEmail();
      if (!isValid) {
        return;
      }
    }
    //dispatch
    dispatch(user ? editUser(form) : addUser(form));
    setOpen(false);
  };
  const validateForm = () => {
    let isValid = true;
    let validObj = {
      name: true,
      email: true,
      location: true,
      unique: true,
    };
    if (form.name.length < 3) {
      isValid = false;
      validObj.name = false;
    }
    if (form.email.indexOf('@') === -1) {
      isValid = false;
      validObj.email = false;
    }
    if (form.location.length === 0) {
      isValid = false;
      validObj.location = false;
    }
    setIsValid(validObj);
    return isValid;
  };
  function validateUniqueEmail(): boolean {
    // setIsValid(validObj);
    let index = users.findIndex((user) => user.email === form.email);

    if (index !== -1) {
      setIsValid({
        name: true,
        email: true,
        location: true,
        unique: false,
      });
    }
    return index === -1;
  }

  const handleForm = (text: string, input: 'name' | 'email' | 'location') => {
    setIsValid({
      name: true,
      email: true,
      location: true,
      unique: true,
    });
    setForm((prev) => {
      let temp = { ...prev };
      temp[input] = text;
      return temp;
    });
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box sx={style}>
          <TextField
            fullWidth
            margin="normal"
            error={!isValid.name}
            label="Name"
            defaultValue={user?.name}
            helperText={!isValid.name ? 'min of 3 characters' : ''}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              handleForm(event.target.value, 'name');
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            error={!isValid.email || !isValid.unique}
            label="Email"
            defaultValue={user?.email}
            helperText={
              !isValid.email
                ? 'not a valid email'
                : !isValid.unique
                ? 'please provide a unique email'
                : ''
            }
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              handleForm(event.target.value, 'email');
            }}
          />

          <TextField
            fullWidth
            margin="normal"
            error={!isValid.location}
            label="Location"
            defaultValue={user?.location}
            helperText={!isValid.location ? 'required' : ''}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              handleForm(event.target.value, 'location');
            }}
          />

          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center">
            <Button variant="outlined" onClick={handleClose}>
              cancel
            </Button>
            <Button
              variant="contained"
              endIcon={<EditIcon />}
              onClick={handleSubmit}>
              {user ? 'Edit' : 'Add'} User
            </Button>
          </Grid>
        </Box>
      </Modal>
    </div>
  );
}
