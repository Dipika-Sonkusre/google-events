import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { deleteEvent, fetchEvents, updateEvent } from "../redux/eventThunk";

import type { Event, EventStatus } from "../interface";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Box,
  Paper,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router";

export default function Calendar() {
  const { events } = useAppSelector((state) => state.event);
  const dispatch = useAppDispatch();

  // Fetch events on mount
  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  // Update event status
  const updateStatus = (event: Event) => {
    const newStatus = event.status === "Completed" ? "Upcoming" : "Completed";

    const updatedEvent: Event = { ...event, status: newStatus };

    dispatch(updateEvent(updatedEvent));
  };

  // Update event status automatically after event time out
  useEffect(() => {
    const checkAndUpdateEvents = () => {
      const now = new Date();

      events.forEach((event) => {
        const eventDateTime = new Date(`${event.date}T${event.endTime}:00`);
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
    };

    // Run immediately
    checkAndUpdateEvents();

    // Then run every 60 seconds
    const interval = setInterval(() => {
      checkAndUpdateEvents();
    }, 60000);

    return () => clearInterval(interval);
  }, [events, dispatch]);

  // Group events by status for accordion
  const groupedEvents: Record<EventStatus, Event[]> = {
    Upcoming: events.filter((event) => event.status === "Upcoming"),
    Completed: events.filter((event) => event.status === "Completed"),
  };

  const onDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      dispatch(deleteEvent(id));
      dispatch(fetchEvents());
    }
  };

  return (
    <Box sx={{ padding: 4, maxWidth: 600, margin: "0 auto" }}>
      <Typography variant="h4" gutterBottom>
        Calendar Events
      </Typography>
      <Paper elevation={2} sx={{ p: 2 }}>
        {(["Upcoming", "Completed"] as EventStatus[]).map((status) => (
          <Accordion key={status} defaultExpanded={status === "Upcoming"}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">
                {status} Events ({groupedEvents[status].length})
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {groupedEvents[status].length === 0 ? (
                <Typography variant="body2">
                  No {status.toLowerCase()} events found.
                </Typography>
              ) : (
                <List>
                  {groupedEvents[status].map((event) => (
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
                                {event.date} at {event.startTime} -{" "}
                                {event.endTime}
                              </Typography>
                              <br />
                              <Typography variant="body2" component="span">
                                {event.description}
                              </Typography>
                            </Box>
                            {/* <Box>
                              <Button
                                size="small"
                                sx={{
                                  backgroundColor:
                                    event.status === "Completed"
                                      ? "green"
                                      : "orange",
                                  color: "white",
                                  pointerEvents:
                                    event.status === "Completed"
                                      ? "none"
                                      : "auto",
                                }}
                                onClick={() => updateStatus(event)}
                              >
                                {event.status}
                              </Button>
                            </Box> */}

                            <Box
                              sx={{
                                display: "flex",
                                gap: 1,
                                alignItems: "center",
                              }}
                            >
                              <Link to="/" state={event}>
                                <IconButton size="small" aria-label="edit">
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Link>

                              <IconButton
                                size="small"
                                onClick={() => onDelete(event.id)}
                                aria-label="delete"
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>

                              <Button
                                size="small"
                                sx={{
                                  backgroundColor:
                                    event.status === "Completed"
                                      ? "green"
                                      : "orange",
                                  color: "white",
                                  pointerEvents:
                                    event.status === "Completed"
                                      ? "none"
                                      : "auto",
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
                  ))}
                </List>
              )}
            </AccordionDetails>
          </Accordion>
        ))}
      </Paper>
    </Box>
  );
}
