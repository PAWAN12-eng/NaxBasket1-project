import { createSlice } from '@reduxjs/toolkit';

const initialValue = {
    allCategory: [],
    loadingCategoy:false,
    subCategory: [],
    product: [],
};

const productSlice = createSlice({
    name: 'product',
    initialState: initialValue,
    reducers: {
        setAllCategory: (state, action) => {
            state.allCategory = [...action.payload]
        },
        setLoadingCategory: (state, action) => {
            state.loadingCategoy = action.payload;
        },
        setSubCategory: (state, action) => {
            state.subCategory = action.payload;
        },
        setProduct: (state, action) => {
            state.product = action.payload;
        },
        clearProductState: (state) => {
            state.allCategory = [];
            state.subCategory = [];
            state.product = [];
        },
    },
});

export const { setAllCategory,setSubCategory,setLoadingCategory} = productSlice.actions;

export default productSlice.reducer;
