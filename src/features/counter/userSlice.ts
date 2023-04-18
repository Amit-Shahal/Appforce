import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';

export interface User {
  name: string;
  email: string;
  image: string;
  location: string;
  id: string;
}

export interface UsersState {
  loading: Boolean;
  users: User[];
  status: 'idle' | 'loading' | 'failed';
  filteredItems: User[];
}

const initialState: UsersState = {
  loading: false,
  users: [],
  status: 'idle',
  filteredItems: [],
};

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const fetchData = async (request: string): Promise<any> => {
    const response = await fetch(request);
    return await response.json();
  };

  const res = await fetchData('https://randomuser.me/api/?results=10.');
  return res.results.map(
    (
      user: {
        name: { title: any; last: any; first: any };
        email: any;
        picture: { medium: any };
        location: { country: any; city: any; street: any };
        id: { value: any };
      },
      index: number
    ) => ({
      name: `${user.name.title} ${user.name.last} ${user.name.first}`,
      email: user.email,
      image: user.picture.medium,
      location: `${user.location.country} ${user.location.city} ${user.location.street.name}`,
      id: index,
    })
  );
});

export const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    filterUsers: (state, action: PayloadAction<User>) => {
      if (
        !action.payload.id &&
        !action.payload.email &&
        !action.payload.name &&
        !action.payload.location
      ) {
        state.filteredItems = state.users;
        return;
      }

      if (action.payload.name) {
        state.filteredItems = state.users.filter((item) =>
          item.name.toLowerCase().includes(action.payload.name.toLowerCase())
        );
      }
      if (action.payload.id) {
        state.filteredItems = state.users.filter((item) =>
          item.id
            .toString()
            .toLowerCase()
            .includes(action.payload.id.toLowerCase())
        );
      }
      if (action.payload.location) {
        state.filteredItems = state.users.filter((item) =>
          item.location
            .toLowerCase()
            .includes(action.payload.location.toLowerCase())
        );
      }
      if (action.payload.email) {
        state.filteredItems = state.users.filter((item) =>
          item.email.toLowerCase().includes(action.payload.email.toLowerCase())
        );
      }
    },
    addUser: (state, action: PayloadAction<User>) => {
      action.payload.id = state.users.length.toString();
      state.users.unshift(action.payload);
      state.filteredItems = state.users;
    },
    editUser: (state, action: PayloadAction<User>) => {
      state.users.forEach((user) => {
        if (user.id === action.payload.id) {
          user.email = action.payload.email;
          user.name = action.payload.name;
          user.image = action.payload.image;
          user.location = action.payload.location;
        }
      });
      state.filteredItems = state.users;
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter((item) => item.email !== action.payload);
      state.filteredItems = state.users;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'idle';
        state.users = action.payload;
        state.filteredItems = action.payload;
        state.loading = false;
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.status = 'failed';
        state.loading = false;
      });
  },
});

export const { addUser, editUser, filterUsers, deleteUser } = userSlice.actions;

export const selectUsers = (state: RootState) => state.users;

export default userSlice.reducer;
