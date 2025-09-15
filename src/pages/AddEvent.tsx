import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { addEvent, fetchEvents, updateEvent } from "../redux/eventThunk";
import type { Event } from "../interface";
import { toast } from "react-toastify";

type FormState = {
  title: string;
  date: string;
  time: string;
  description: string;
};

export default function AddEvent() {
  const { events } = useAppSelector((state) => state.event);
  const dispatch = useAppDispatch();

  const [form, setForm] = useState<FormState>({
    title: "",
    date: "",
    time: "",
    description: "",
  });

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

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
      time: form.time,
      description: form.description,
      status: "Upcoming",
    };

    dispatch(addEvent(newFormEvent));

    const [year, month, day] = form.date.split("-");
    const [hour, minute] = form.time.split(":");

    // format event reminder date
    const eventDateTime = new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute),
      0
    );

    if (!isNaN(eventDateTime.getTime())) {
      const remindTime = new Date(eventDateTime.getTime() - 5 * 60 * 1000);
      const now = new Date();
      const delay = remindTime.getTime() - now.getTime();

      if (delay > 0) {
        setTimeout(() => {
          toast.success("5 minutes before your event");
        }, delay);
      } else {
        toast.info("Cannot set reminder for events that have already passed");
      }
    } else {
      toast.error("Invalid date or time");
    }

    // Reset form AFTER scheduling
    setForm({ title: "", date: "", time: "", description: "" });
  };

  // Update event status
  const updateStatus = (event: Event) => {
    const newStatus = event.status === "Completed" ? "Upcoming" : "Completed";

    const updatedEvent: Event = { ...event, status: newStatus };

    dispatch(updateEvent(updatedEvent));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();

      events.forEach((event) => {
        const eventDateTime = new Date(`${event.date}T${event.time}:00`);
        if (
          event.status !== "Completed" &&
          eventDateTime.getTime() <= now.getTime()
        ) {
          const updatedEvent: Event = {
            ...event,
            status: "Completed",
          };
          dispatch(updateEvent(updatedEvent));
        }
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [events, dispatch]);

  return (
    <>
      <Paper elevation={3} sx={{ padding: 4, maxWidth: 600, margin: "0 auto" }}>
        <Typography variant="h5" gutterBottom>
          Add New Event
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
                value={form.time}
                onChange={handleChange("time")}
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
                  setForm({ title: "", date: "", time: "", description: "" })
                }
              >
                Reset
              </Button>
              <Button type="submit" variant="contained">
                Save Event
              </Button>
            </Box>
          </Stack>
        </Box>
      </Paper>
      <br />

      <Box sx={{ padding: 4, maxWidth: 600, margin: "0 auto" }}>
        <Typography variant="h4" gutterBottom>
          Calendar Events
        </Typography>
        <Paper elevation={2} sx={{ p: 2, maxWidth: 600 }}>
          <List>
            {(events || []).length === 0 ? (
              <Typography variant="body1">No events found.</Typography>
            ) : (
              events.map((event: Event) => (
                <ListItem
                  key={event.id}
                  sx={{
                    mb: 2,
                    borderBottom: "1px solid #eee",
                    backgroundColor:
                      event.status === "Completed" ? "#f2f2f2" : "white",
                  }}
                >
                  <ListItemText
                    primary={event.title}
                    secondary={
                      <Box
                        component="div"
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        <Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            component="span"
                          >
                            {event.date} at {event.time}
                          </Typography>
                          <br />
                          <Typography variant="body2" component="span">
                            {event.description}
                          </Typography>
                        </Box>
                        <Box>
                          <Button
                            size="small"
                            className="button"
                            sx={{
                              backgroundColor:
                                event.status === "Completed"
                                  ? "green"
                                  : "orange",
                              pointerEvents:
                                event.status === "Completed" ? "none" : "auto",
                            }}
                            onClick={() => updateStatus(event)}
                          >
                            {event.status}
                          </Button>
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
              ))
            )}
          </List>
        </Paper>
      </Box>
    </>
  );
}
