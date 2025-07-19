import "./App.css";
import { Route, Routes } from "react-router-dom";

import "swiper/css";
import "swiper/css/navigation";

import { useEffect } from "react";
import { useLocation } from "./context/LocationContext";

import { LandingPage } from "./pages/LandingPage";

import UserLayout from "./layouts/UserLayout";
import AuthLayout from "./layouts/AuthLayout";
import PublicLayout from "./layouts/PublicLayout";

import Profile from "./pages/Profile";
import UserMatches from "./pages/user/Matches";
import History from "./pages/user/History";
import Settings from "./pages/user/Settings";

import Matches from "./pages/Matches";
import CreateMatch from "./pages/user/CreateMatch";
import MatchesById from "./pages/MatchesById";

import GroundPage from "./pages/GroundPage";
import GroundById from "./pages/GroundById";
import Booking from "./pages/Booking";

import Signup from "./pages/Signup";
import Login from "./pages/Login";

export default function App() {
  const { location, setLocation } = useLocation();

  useEffect(() => {
    if (location) return;

    (async () => {
      const permission = await navigator.permissions.query({ name: "geolocation" });

      if (permission.state === "granted") {
        navigator.geolocation.getCurrentPosition((position) => { setLocation(position); });
      }
    })();

  }, [location]);

  return (
    <div>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route index path="/" element={<LandingPage />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/match/:id" element={<MatchesById />} />
          <Route path="/grounds" element={<GroundPage />} />
          <Route path="/grounds/:id" element={<GroundById />} />
        </Route>

        {/* Auth Routes */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="signup" element={<Signup />} />
          <Route path="login" element={<Login />} />
        </Route>

        {/* User Routes (Protected) */}
        <Route path="/user" element={<UserLayout />}>
          <Route path="profile" element={<Profile />} />
          <Route path="matches" element={<UserMatches />} />
          <Route path="matches/create" element={<CreateMatch />} />
          <Route path="history" element={<History />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Vendor Routes (Protected) */}
        {/* <Route path="/vendor" element={<VendorLayout />}>
          <Route path="dashboard" element={<VendorDashboard />} />
          <Route path="grounds" element={<VendorGrounds />} />
          <Route path="bookings" element={<VendorBookings />} />
        </Route> */}
      </Routes>
    </div>
  );
}
