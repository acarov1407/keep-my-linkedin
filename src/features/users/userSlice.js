import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { delay } from "../../helpers/simulation";

export const getUsers = createAsyncThunk(
    'users/getUsers',
    async (arg, { dispatch, getState, extra, requestId, signal, rejectWithValue }) => {
        try {
            
            const data = JSON.parse(localStorage.getItem('users')) ?? [];
            //await delay(500);
            return data;
        } catch (error) {
            return rejectWithValue('Error loading users');
        }

    }
);

export const createUser = createAsyncThunk(
    'users/createUser',
    async (user, { rejectWithValue }) => {
        try {
            const actualStorage = JSON.parse(localStorage.getItem('users'));
            await delay(800);
            localStorage.setItem('users', JSON.stringify([...actualStorage, user]));
            return user;
        } catch (error) {
            console.log(error);
            return rejectWithValue('Error creating user');
        }
    }
)

export const deleteUser = createAsyncThunk(
    'users/deleteUser',
    async (userId, { rejectWithValue }) => {
        try {
            const actualStorage = JSON.parse(localStorage.getItem('users'));
            await delay(1000);
            const updatedStorage = actualStorage.filter(user => user.id !== userId);
            localStorage.setItem('users', JSON.stringify(updatedStorage));
            return userId;
        } catch (error) {
            return rejectWithValue('An error occurred while trying to delete the user.');
        }
    }
)

export const editUser = createAsyncThunk(
    'users/editUser',
    async (user, { rejectWithValue }) => {
        try {
            await delay(1000);
            const actualStorage = await JSON.parse(localStorage.getItem('users'));
            const updatedStorage = actualStorage.map(_user => _user.id === user.id ? user : _user);
            localStorage.setItem('users', JSON.stringify(updatedStorage));
            return user;
        } catch (error) {
            return rejectWithValue('An error occurred while trying to edit the user.')
        }
    }
)

const initialState = {
    users: [],
    currentUser: {},
    loadings: {
        isFetchingUsers: true,
        isCreating: false,
        isDeleting: false,
        isEditing: false

    },
    error: false,
    modals: {
        alert: false,
        edit: false
    },
    success: false,
    message: ""
}

export const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        resetAlerts: (state) => {
            state.error = null;
            state.success = false;
            state.message = "";
        },

        handleModalAlert: (state, action) => {
            if (state.modals.alert) {
                state.currentUser = {}
            } else {
                state.currentUser = action.payload;
            }

            state.modals.alert = !state.modals.alert;
        },
        handleModalEdit: (state, action) => {
            if (state.modals.edit) {
                state.currentUser = {}
            } else {
                state.currentUser = action.payload;
            }

            state.modals.edit = !state.modals.edit;
        }
    },
    extraReducers: (builder) => {

        builder.addCase(getUsers.pending, (state) => {
            state.loadings.isFetchingUsers = true;
        })
            .addCase(getUsers.fulfilled, (state, action) => {
                state.users = action.payload.reverse() || [];
                state.loadings.isFetchingUsers = false;
            })
            .addCase(getUsers.rejected, (state, action) => {
                state.users = [];
                state.success = false;
                state.error = true;
                state.message = action.payload;
                state.loadings.isFetchingUsers = false;

            })

            .addCase(createUser.pending, (state, action) => {
                state.loadings.isCreating = true;
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.users = [action.payload, ...state.users];
                state.success = true;
                state.message = "User has been successfully created.";
                state.loadings.isCreating = false;
            })
            .addCase(createUser.rejected, (state, action) => {
                state.success = false;
                state.error = true;
                state.message = action.payload;
                state.loadings.isCreating = false;
            })


            .addCase(deleteUser.pending, (state, action) => {
                state.loadings.isDeleting = true;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                if (action.payload) {
                    state.users = state.users.filter(user => user.id !== action.payload);
                    state.success = true;
                    state.message = "User has been successfully deleted."
                }

                state.loadings.isDeleting = false;
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.success = false;
                state.error = true;
                state.message = action.payload;
                state.loadings.isDeleting = false;
            })
            .addCase(editUser.pending, (state, action) => {
                state.loadings.isEditing = true;
            })
            .addCase(editUser.fulfilled, (state, action) => {
                state.users = state.users.map(user => user.id === action.payload.id ? action.payload : user);
                state.success = true;
                state.message = "Changes have been saved successfully."
                state.loadings.isEditing = false;
            })
            .addCase(editUser.rejected, (state, action) => {
                state.success = false;
                state.error = true;
                state.message = action.payload;
                state.loadings.isEditing = false;
            })
    },
})

export const {
    handleModalAlert,
    handleModalEdit,
    resetAlerts } = userSlice.actions;

export default userSlice.reducer;