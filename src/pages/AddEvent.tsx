import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";

import { useAppDispatch } from "../redux/hooks";
import { addEvent, updateEvent } from "../redux/eventThunk";
import type { Event, EventStatus } from "../interface";

import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useLocation } from "react-router";
import { toast } from "react-toastify";

type FormState = {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  status: EventStatus;
};

export default function AddEvent() {
  const dispatch = useAppDispatch();
  const { state } = useLocation();

  const [form, setForm] = useState<FormState>({
    title: "",
    date: "",
    startTime: "",
    endTime: "",
    description: "",
    status: "Upcoming",
  });

  useEffect(() => {
    if (state) {
      setForm({
        title: state.title,
        date: state.date,
        startTime: state.startTime,
        endTime: state.endTime,
        description: state.description,
        status: state.status ?? "Upcoming",
      });
    } else {
      setForm({
        title: "",
        date: "",
        startTime: "",
        endTime: "",
        description: "",
        status: "Upcoming",
      });
    }
  }, [state]);

  const handleChange =
    (field: keyof FormState) => (e: ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const newFormEvent: Event = {
      id: Date.now().toString(),
      title: form.title,
      date: form.date,
      startTime: form.startTime,
      endTime: form.endTime,
      description: form.description,
      status: "Upcoming",
    };

    if (state) {
      const updatedFormEvent: Event = {
        id: state.id,
        title: form.title,
        date: form.date,
        startTime: form.startTime,
        endTime: form.endTime,
        description: form.description,
        status: form.status,
      };
      console.log("Updating Event ID:", updatedFormEvent.id);
      dispatch(updateEvent(updatedFormEvent));
    } else {
      console.log("add api-------");
      dispatch(addEvent(newFormEvent));
    }

    // Schedule reminder for 5 minutes before event
    const [year, month, day] = form.date.split("-");
    const [startHour, startMinute] = form.startTime.split(":");

    // format event reminder date
    const eventDateTimeS = new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(startHour),
      Number(startMinute),
      0
    );

    if (!isNaN(eventDateTimeS.getTime())) {
      const remindBeforeStart = new Date(
        eventDateTimeS.getTime() - 5 * 60 * 1000
      );
      const now = new Date();
      const delayBeforeStart = remindBeforeStart.getTime() - now.getTime();

      if (delayBeforeStart > 0) {
        setTimeout(() => {
          console.log("5 minutes before your event");
          toast.success("5 minutes before your event");
        }, delayBeforeStart);
      } else {
        toast.info("Cannot set reminder for events that have already passed");
      }
    } else {
      toast.error("Invalid date or time");
    }

    // 5 minute left for an event
    const [endHour, endMinute] = form.endTime.split(":");
    // format event reminder date
    const eventDateTimeE = new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(endHour),
      Number(endMinute),
      0
    );

    if (!isNaN(eventDateTimeE.getTime())) {
      const remindBeforeEnd = new Date(
        eventDateTimeE.getTime() - 5 * 60 * 1000
      );
      const now = new Date();
      const delayBeforeEnd = remindBeforeEnd.getTime() - now.getTime();

      if (delayBeforeEnd > 0) {
        setTimeout(() => {
          console.log(`5 minutes left for your ${form.title} event`);
          toast.success(`5 minutes left for your ${form.title} event`);
        }, delayBeforeEnd);
      } else {
        toast.info("Cannot set reminder for events that have already passed");
      }
    } else {
      toast.error("Invalid date or time");
    }

    // Reset form AFTER scheduling
    setForm({
      title: "",
      date: "",
      startTime: "",
      endTime: "",
      description: "",
      status: "Upcoming",
    });
  };

  return (
    <>
      <Paper elevation={3} sx={{ padding: 4, maxWidth: 600, margin: "0 auto" }}>
        <Typography variant="h5" gutterBottom>
          {state ? "Edit Event" : "Add New Event"}
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={3}>
            <TextField
              label="Event Title"
              value={form.title}
              onChange={handleChange("title")}
              required
              fullWidth
            />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Start Date"
                type="date"
                value={form.date}
                onChange={handleChange("date")}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Time"
                type="time"
                value={form.startTime}
                onChange={handleChange("startTime")}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Time"
                type="time"
                value={form.endTime}
                onChange={handleChange("endTime")}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Stack>
            <TextField
              label="Description"
              value={form.description}
              onChange={handleChange("description")}
              multiline
              minRows={3}
              fullWidth
            />

            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "flex-end",
                pt: 1,
              }}
            >
              <Button
                type="button"
                variant="outlined"
                onClick={() =>
                  setForm({
                    title: "",
                    date: "",
                    startTime: "",
                    endTime: "",
                    description: "",
                    status: "Upcoming",
                  })
                }
              >
                Reset
              </Button>
              <Button type="submit" variant="contained">
                {state ? "Update Event" : "Save Event"}
              </Button>
            </Box>
          </Stack>
        </Box>
      </Paper>
    </>
  );
}
