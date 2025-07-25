import { createSlice } from "@reduxjs/toolkit";

const bookSlice = createSlice({
    name: 'book',
    initialState: {
        loading: false,
        allBooks: [],
        searchQuery: "",
        purchasedBooks: []
    },
    reducers: {
        //actions
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setBooks: (state, action) => {
            state.allBooks = action.payload;
        },
        setPurchasedBooks: (state, action) => {
            state.purchasedBooks = action.payload;
        },
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
        }
    }
 });

 export const { setLoading, setBooks, setPurchasedBooks, setSearchQuery } = bookSlice.actions;
 export default bookSlice.reducer;