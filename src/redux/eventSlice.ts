import { createSlice } from "@reduxjs/toolkit";
import { addEvent, deleteEvent, fetchEvents, updateEvent } from "./eventThunk";
import type { EventsState } from "../interface";
import { toast } from "react-toastify";

const initialState: EventsState = {
  events: [],
};

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.events = action.payload;
      })
      .addCase(addEvent.fulfilled, (state, action) => {
        state.events = [...state.events, action.payload];
        toast.success("Event added successfully!");
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        const index = state.events.findIndex(
          (event) => event.id === action.payload.id
        );

        if (index !== -1) {
          state.events[index] = action.payload;
        }
        toast.success("Event updated successfully!");
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.events = state.events.filter(
          (event) => event.id !== action.payload
        );
        toast.success("Event deleted successfully!");
      });
  },
});
export const eventsReducer = eventsSlice.reducer;
