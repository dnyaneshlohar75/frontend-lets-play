import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { LocationProvider } from "./context/LocationContext.tsx";
import { HeroUIProvider } from "@heroui/system";

import "./index.css";
import App from "./App.tsx";
import { ToastProvider } from "@heroui/react";
import { WebsocketProvider } from "./context/WebSocketContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HeroUIProvider>
      <ToastProvider />
      <BrowserRouter>
        <LocationProvider>
          <WebsocketProvider>
            <App />
          </WebsocketProvider>
        </LocationProvider>
      </BrowserRouter>
    </HeroUIProvider>
  </StrictMode>
);
