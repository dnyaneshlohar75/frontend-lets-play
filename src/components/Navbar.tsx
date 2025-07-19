import { Link, NavLink, useLocation } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { User } from "@heroui/react";
import { LuLogIn, LuUser } from "react-icons/lu";
import Notifications from "./Notifications";

const links = [
  { url: "/", title: "Home" },
  { url: "/grounds", title: "Grounds" },
  { url: "/matches", title: "Matches" },
];

export type userProps = {
  user: {
    name: string;
    username: string;
    email: string;
    phone: string;
    userId: string;
    profileImageUrl: string;
  };
  isLoggedIn: boolean | null;
  token: string | null;
};

export default function Navbar() {
  const location = useLocation();

  let session: userProps | null = null;

  try {
    session = JSON.parse(localStorage.getItem("session") || "null");
  } catch {
    session = null;
  }

  const isHome = location.pathname === "/";

  return (
    <header
      className={`w-full px-6 py-5 ${
        isHome ? "absolute" : "relative"
      } top-0 left-0 z-50 transition-all duration-300`}
    >
      <nav className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-x-24">
          <Link to="/" className="text-xl font-bold text-green-600">
            Let's Play
          </Link>
          <div className="space-x-12">
            {links.map((link) => (
              <NavLink
                key={link.title}
                to={link.url}
                className={`${
                  location.pathname === link.url
                    ? "font-semibold text-blue-700"
                    : isHome ? "text-gray-50" : "text-gray-400"
                } text-sm transition-colors duration-200 ease-in-out`}
              >
                {link.title}
              </NavLink>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-x-8">
          {session?.isLoggedIn ? (
            <>
            <Notifications />

            <Dropdown placement="bottom-start" radius="sm">
              <DropdownTrigger>
                <User
                  as="button"
                  avatarProps={{
                    size: "sm",
                    src:
                      session.user?.profileImageUrl ??
                      "https://i.pravatar.cc/150?u=a042581f4e29026024d",
                  }}
                  className="transition-transform bg-blue-700 p-1 pr-4 rounded-full"
                  name={
                    <h1 className="capitalize text-white font-medium line-clamp-1">
                      Hello, {session.user.name.split(" ")[0]}
                    </h1>
                  }
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="User Actions" variant="flat">
                <DropdownItem key="profile">
                  <Link to="/user/profile" className="flex items-center gap-2">
                    <LuUser />
                    My profile
                  </Link>
                </DropdownItem>
                <DropdownItem key="logout">
                  <LogoutButton />
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
            </>
          ) : (
            <Link
              to="/auth/login"
              className="px-4 py-2 rounded-md text-white bg-blue-700 text-sm flex items-center gap-x-3 hover:bg-blue-800"
            >
              <LuLogIn size={16} />
              <span>Get started</span>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
