import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";

interface WebsocketContextType {
  socket: Socket | null;
  setSocket: (socket: Socket | null) => void;
}

export const WebsocketContext = createContext<WebsocketContextType | null>(null);

const session = JSON.parse(localStorage.getItem("session") as string);

export const WebsocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const client = io(import.meta.env.VITE_WEBSOCKET_ENDPOINT || "http://localhost:5000", {
      path: "/match",
      transports: ["websocket"],
    });

    client.on("connect", () => {
      console.log("Socket.IO connected:", client.id);
      setSocket(client);
    });

    if(session) {
      client.emit('register', session?.user?.userId);
    }

    client.on("disconnect", () => {
      console.log("Socket.IO disconnected");
    });

    return () => {
      client.off("connect");
      client.disconnect();
    };
  }, [session]);

  return (
    <WebsocketContext.Provider value={{ socket, setSocket }}>
      {children}
    </WebsocketContext.Provider>
  );
};

export const useWebsocket = (): WebsocketContextType => {
  const context = useContext(WebsocketContext);

  if (!context) {
    throw new Error("useWebsocket must be used within a WebsocketProvider");
  }

  return context;
};
