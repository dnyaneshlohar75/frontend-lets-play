import Navbar from "@/components/Navbar";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

export default function UserLayout() {
  return (
    <section>
      <Navbar />
      <div className="flex">
      <Sidebar />
      <section className="flex-1 max-w-6xl mx-auto px-6 py-3 bg-white">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </section>
    </div>
    </section>
  );
}
