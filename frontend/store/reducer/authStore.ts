import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AuthUser = {
  id: string;
  name: string;
  email: string;
  token: string;
};


type AuthState = {
  auth: AuthUser | null;
};

const initialState: AuthState = {
  auth: null,
};

const authReducer = createSlice({
  name: "authStore",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<AuthUser>) => {
      state.auth = action.payload;
    },
    logout: (state) => {
      state.auth = null;
    },
  },
});

export const { login, logout } = authReducer.actions;
export default authReducer.reducer;
