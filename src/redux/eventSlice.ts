import { createSlice } from "@reduxjs/toolkit";
import { addEvent, fetchEvents, updateEvent } from "./eventThunk";
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
        state.events = state.events.map((event) =>
          event.id === action.payload.id
            ? {
                ...event,
                ...action.payload,
              }
            : event
        );
        toast.success("Event updated successfully!");
      });
  },
});
export const eventsReducer = eventsSlice.reducer;
