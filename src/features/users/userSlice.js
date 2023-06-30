import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { delay } from "../../helpers/simulation";

export const getUsers = createAsyncThunk(
    'users/getUsers',
    async (arg, { dispatch, getState, extra, requestId, signal, rejectWithValue }) => {
        try {
            const response = await fetch(import.meta.env.VITE_API_URL);
            const data = await response.json();
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
            const response = await fetch(import.meta.env.VITE_API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user)
            });
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue('Error creating user');
        }
    }
)

const deleteUser2 = createAsyncThunk(
    'users/deleteUser',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/${userId}`, {
                method: "DELETE"
            });
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue('An error occurred while trying to delete user.');
        }
    }
)

const deleteUser = async (userId) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/${userId}`, {
            method: "DELETE"
        });
        const data = await response.json();
        return data.id;
    } catch (error) {
        return error;
    }
}

export const deleteUsers = createAsyncThunk(
    'users/deleteUsers',
    async (usersIds, { rejectWithValue, dispatch }) => {
        const deletedUsers = [];
        try {
            for (const userId of usersIds) {
                const user = await deleteUser(userId);
                deletedUsers.push(user);
            }

            return deletedUsers;
        } catch (error) {
            return rejectWithValue('An error ocurrend while trying to delete users');
        }
    }
)



export const editUser = createAsyncThunk(
    'users/editUser',
    async (user, { rejectWithValue }) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/${user.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user)
            });
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue('An error occurred while trying to edit the user.')
        }
    }
)

const initialState = {
    users: [],
    searchedUsers: [],
    selectedUsers: [],
    currentUser: {},
    loadings: {
        isFetchingUsers: true,
        isCreating: false,
        isDeleting: false,
        isEditing: false,
        isClosingModal: false

    },
    error: false,
    modals: {
        alert: false,
        edit: false,
        details: false
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
            state.modals.alert = !state.modals.alert;
        },
        handleModalEdit: (state, action) => {
            if (state.modals.edit) {
                state.currentUser = {}
            } else {
                state.currentUser = action.payload;
            }

            state.modals.edit = !state.modals.edit;
        },
        handleModalDetails: (state, action) => {
            if (state.modals.details) {
                state.currentUser = {}
            } else {
                if (state.loadings.isClosingModal) return;
                state.currentUser = action.payload;
            }

            state.modals.details = !state.modals.details;
        },
        setIsClosingModal: (state, action) => {
            state.loadings.isClosingModal = action.payload;
        },
        setSelectedUsers: (state, action) => {
            state.selectedUsers = action.payload;
        },
        searchUser: (state, action) => {
            if (!action.payload) return;
            if (state.users.length > 0) {
                state.searchedUsers = state.users.filter(user => user.fullname.toLowerCase().includes(action.payload.toLowerCase()));
            }
        },
        clearSearch: (state) => {
            state.searchedUsers = state.users;
        }

    },
    extraReducers: (builder) => {

        builder.addCase(getUsers.pending, (state) => {
            state.loadings.isFetchingUsers = true;
        })
            .addCase(getUsers.fulfilled, (state, action) => {
                state.users = [...action.payload].sort((a, b) => b.createdAt - a.createdAt);
                state.searchedUsers = state.users;
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
                state.searchedUsers = state.users;
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


            .addCase(deleteUsers.pending, (state, action) => {
                state.loadings.isDeleting = true;
            })
            .addCase(deleteUsers.fulfilled, (state, action) => {
                if (action.payload) {
                    state.users = state.users.filter(user => !action.payload.includes(user.id));
                    state.searchedUsers = state.users;
                    state.selectedUsers = [];
                    state.success = true;
                    state.message = "Users has been successfully deleted."
                }

                state.loadings.isDeleting = false;
            })
            .addCase(deleteUsers.rejected, (state, action) => {
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
                state.searchedUsers = state.users;
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
    handleModalDetails,
    setIsClosingModal,
    setSelectedUsers,
    resetAlerts,
    searchUser,
    clearSearch } = userSlice.actions;

export default userSlice.reducer;