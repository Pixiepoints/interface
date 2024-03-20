import { createSlice } from '@reduxjs/toolkit';
import { AppState } from 'redux/store';
import { HYDRATE } from 'next-redux-wrapper';
import { InfoStateType } from 'redux/types/reducerTypes';

const initialState: InfoStateType = {
  isMobile: false,
  theme: 'light',
  itemsFromLocal: [],
};

// Actual Slice
export const infoSlice = createSlice({
  name: 'info',
  initialState,
  reducers: {
    setIsMobile(state, action) {
      state.isMobile = action.payload;
    },
    setItemsFromLocal(state, action) {
      // console.log('action',action)
      state.itemsFromLocal = action.payload;
    },
    setConfig(state, action) {
      state.config = action.payload;
    },
    setHasToken(state, action) {
      state.hasToken = action.payload;
    },
  },

  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.info,
      };
    },
  },
});

export const { setIsMobile, setItemsFromLocal, setConfig, setHasToken } = infoSlice.actions;
export const selectInfo = (state: AppState) => state.info;
export const getConfig = (state: AppState) => state.info.config;
export default infoSlice.reducer;
