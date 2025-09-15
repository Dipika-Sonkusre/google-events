import { configureStore } from "@reduxjs/toolkit";
import { eventsReducer } from "./eventSlice";

export const store = configureStore({
  reducer: {
    event: eventsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
