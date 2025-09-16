import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Event } from "../interface";
import { eventApi } from "../api/eventApi";

const APP_URL = "http://localhost:3000/events";

export const fetchEvents = createAsyncThunk<Event[]>(
  "events/fetchEvents",
  async () => {
    return await eventApi({
      url: APP_URL,
    });
  }
);

export const addEvent = createAsyncThunk<Event, Event>(
  "events/addEvent",
  async (event) => {
    return await eventApi({
      url: APP_URL,
      method: "POST",
      body: event,
    });
  }
);

export const updateEvent = createAsyncThunk<Event, Event>(
  "events/updateEvent",
  async (event) => {
    return await eventApi({
      url: `${APP_URL}/${event.id}`,
      method: "PUT",
      body: event,
    });
  }
);

export const deleteEvent = createAsyncThunk<string, string>(
  "events/deleteEvent",
  async (id) => {
    return await eventApi({
      url: `${APP_URL}/${id}`,
      method: "DELETE",
    });
  }
);
