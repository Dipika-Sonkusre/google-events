import { createBrowserRouter } from "react-router";
import Dashboard from "../pages/Dashboard";
import AddEvent from "../pages/AddEvent";
import Calendar from "../pages/Calendar";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Dashboard,
    children: [
      {
        index: true,
        Component: AddEvent,
      },
      {
        path: "calendar",
        Component: Calendar,
      },
    ],
  },
]);
