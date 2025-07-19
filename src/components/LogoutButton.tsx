import { LuLogOut } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const navigate = useNavigate();

  return (
    <button className="flex items-center gap-2" onClick={() => {
        localStorage.setItem("session", JSON.stringify({
          user: null,
          isLoggedIn: false,
          token: null,
        }));

        navigate("/");
    }}>
      <LuLogOut />
      Logout
    </button>
  )
}