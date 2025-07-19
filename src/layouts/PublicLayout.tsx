import Navbar from "@/components/Navbar";
import { Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <div className="">
      <section className="">
        <div className="">
          <Navbar />
          <Outlet />
        </div>
      </section>
    </div>
  );
}
