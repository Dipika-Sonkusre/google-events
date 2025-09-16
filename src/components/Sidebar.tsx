import { Box, Button, Drawer } from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { Link, useLocation } from "react-router";

const drawerWidth = 240;
export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    {
      text: "Add Event",
      icon: <EventIcon />,
      path: "/",
    },
    {
      text: "Calendar",
      icon: <CalendarMonthIcon />,
      path: "/calendar",
    },
  ];

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#1e1e2f",
          color: "#fff",
          padding: "16px 8px",
        },
      }}
    >
      <nav>
        <Box display="flex" flexDirection="column" gap={1}>
          {menuItems.map((item) => (
            <Button
              key={item.text}
              startIcon={item.icon}
              component={Link}
              to={item.path}
              variant={location.pathname === item.path ? "contained" : "text"}
              sx={{
                justifyContent: "flex-start",
                color: "#fff",
                backgroundColor:
                  location.pathname === item.path ? "#3f51b5" : "transparent",
                "&:hover": {
                  backgroundColor:
                    location.pathname === item.path ? "#334296" : "#2c2c3d",
                },
              }}
            >
              {item.text}
            </Button>
          ))}
        </Box>
      </nav>
    </Drawer>
  );
}
