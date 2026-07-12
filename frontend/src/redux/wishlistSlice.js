import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchWishlist = createAsyncThunk('wishlist/fetchWishlist', async (argToken, { getState }) => {
    let token = argToken || getState().cart.token;
    if (!token) {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            token = JSON.parse(userInfo).token;
        }
    }
    if (!token) return [];
    const res = await fetch('/api/auth/wishlist', {
        headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    return data;
});

export const toggleWishlistItem = createAsyncThunk('wishlist/toggleItem', async ({ productId, token: argToken }, { getState }) => {
    let token = argToken || getState().cart.token;
    if (!token) {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            token = JSON.parse(userInfo).token;
        }
    }
    const res = await fetch(`/api/auth/wishlist/${productId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    return data.wishlist; 
});

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState: {
        items: [],
        status: 'idle',
    },
    reducers: {
        clearWishlist: (state) => {
            state.items = [];
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchWishlist.fulfilled, (state, action) => {
            state.items = action.payload;
            state.status = 'succeeded';
        });
        builder.addCase(toggleWishlistItem.fulfilled, (state, action) => {
            state.items = action.payload;
        });
    }
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
