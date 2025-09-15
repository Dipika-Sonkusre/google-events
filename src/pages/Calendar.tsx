import {
  Box,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { useEffect } from "react";
import { fetchEvents } from "../redux/eventThunk";
import type { Event } from "../interface";

export default function Calendar() {
  const { events } = useAppSelector((state) => state.event);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  return (
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
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {event.date} at {event.time}
                        </Typography>
                        <Typography variant="body2">
                          {event.description}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "white",
                            fontWeight: "bold",
                            backgroundColor:
                              event.status === "Completed" ? "green" : "orange",
                            padding: 1,
                            borderRadius: 3,
                            fontSize: 12,
                            pointerEvents: "none",
                          }}
                        >
                          {event.status}
                        </Typography>
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
  );
}
