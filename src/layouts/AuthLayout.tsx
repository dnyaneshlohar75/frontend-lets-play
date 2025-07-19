import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export default function AuthLayout() {
  const session = JSON.parse(localStorage.getItem("session") as string);
  const navigate = useNavigate();

  useEffect(() => {
    if(session?.isLoggedIn) {
      navigate('/');
    }
  }, []);

  return (
    <div className="">
      <section className="">
        <div className="">
          <Outlet />
        </div>
      </section>
    </div>
  );
}
