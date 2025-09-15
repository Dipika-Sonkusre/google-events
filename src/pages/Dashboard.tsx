import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router";

export default function Dashboard() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <main
        style={{
          flexGrow: 1,
          padding: "24px",
          backgroundColor: "#f4f5fa",
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}
