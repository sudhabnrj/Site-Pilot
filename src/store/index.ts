import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import authReducer from "./slices/auth-slice";
import auditReducer from "./slices/audit-slice";
import { designAuditReducer } from "./slices/design-audit-slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    audit: auditReducer,
    designAudit: designAuditReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
