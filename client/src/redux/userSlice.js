import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { request } from 'graphql-request';
import { FETCH_USER_DETAILS } from '../graphql/queries';

export const fetchUserDetails = createAsyncThunk('user/fetchUserDetails', async (_, { rejectWithValue }) => {
    const token = document.cookie.split(';').find(item => item.trim().startsWith('token='));

    if (!token) {
        return rejectWithValue('No token found.');
    }
    try {
        const response = await request('http://localhost:8080/graphql', FETCH_USER_DETAILS, {}, {
            Authorization: token ? `Bearer ${token.split('=')[1]}` : '',
        });
        return response.userProfile;

    } catch (error) {
        return rejectWithValue(error.message);
    }
});



const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        status: 'idle',
        error: null,
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserDetails.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUserDetails.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload;
            })
            .addCase(fetchUserDetails.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
