import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import listingReducer from './slices/listingSlice';
import cartReducer from './slices/cartSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        listing: listingReducer,
        cart: cartReducer,
    },
    devTools: process.env.NODE_ENV !== 'production',
});
