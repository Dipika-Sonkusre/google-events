import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Event } from "../interface";

export const fetchEvents = createAsyncThunk<Event[]>(
  "events/fetchEvents",
  async () => {
    const response = await fetch("http://localhost:3000/events");
    const data = await response.json();
    return data;
  }
);

export const addEvent = createAsyncThunk(
  "events/addEvent",
  async (event: Event) => {
    const response = await fetch("http://localhost:3000/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    });
    const data = await response.json();
    return data;
  }
);

export const updateEvent = createAsyncThunk(
  "events/updateEvent",
  async (event: Event) => {
    const response = await fetch(`http://localhost:3000/events/${event.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    });

     if (!response.ok) {
       throw new Error("Failed to update event");
     }

    const data = await response.json();
    return data;
  }
);
