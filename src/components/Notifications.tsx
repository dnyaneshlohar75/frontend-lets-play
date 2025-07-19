import { useWebsocket } from "@/context/WebSocketContext";
import { NotificationInterface } from "@/types/types";
import {
  Badge,
  Button,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { LuBell } from "react-icons/lu";

export default function Notifications() {
  const { socket } = useWebsocket();
  const { user } = JSON.parse(localStorage.getItem("session") as string);
  const [viewMore, setViewMore] = useState(false);

  const [notifications, setNotifications] = useState<NotificationInterface[]>(
    []
  );

  useEffect(() => {
    if (!socket) return;
    const userId = user?.userId;

    socket.emit("get-notifications", {
      userId,
      limit: 10,
    });

    socket.on("notifications", (notifications: NotificationInterface[]) => {
      setNotifications(notifications);
    });
  }, [socket, user]);

  const renderNotificationMessage = (notification: NotificationInterface) => {
    switch (notification.type) {
      case "REQUEST_TO_JOIN":
        return (
          <h1 className="text-xs line-clamp-1">
            <span className="capitalize font-semibold">
              {notification?.user?.name}
            </span>{" "}
            <span className="font-normal text-gray-600">
              requested to join the match
            </span>
          </h1>
        );

      case "REQUEST_ACCEPTED":
        return (
          <h1 className="text-xs line-clamp-1">
            <span className="font-normal text-gray-600">
              You are accepted in match
            </span>{" "}
            <span className="capitalize font-semibold">
              {notification?.match?.name}
            </span>
          </h1>
        );

      case "REQUEST_REJECTED":
        return (
          <h1 className="text-xs line-clamp-1">
            <span className="font-normal text-gray-600">
              You are rejected from match
            </span>{" "}
            <span className="capitalize font-semibold">
              {notification?.match?.name}
            </span>
          </h1>
        );

      default:
        return null;
    }
  };

  return (
    <Dropdown
      placement="bottom"
      radius="sm"
      size="lg"
      shadow="sm"
      type="listbox"
      // onOpenChange={() => {}}
    >
      <Badge
        shape="circle"
        showOutline={false}
        content={notifications?.filter((noti) => noti.read).length || ""}
        size="sm"
        color="primary"
      >
        <DropdownTrigger>
          <Button
            as="button"
            isIconOnly
            startContent={<LuBell size={22} className="text-blue-700" />}
            size="sm"
            variant="light"
            className="bg-blue-50"
            radius="full"
          />
        </DropdownTrigger>
      </Badge>
      <DropdownMenu
        variant="light"
        aria-label="Notifications"
        className={`w-[340px] ${viewMore ? "max-h-[340px]" : "max-h-[240px]"} overflow-y-auto space-y-3`}
        bottomContent={
          notifications.length >=1 ? <button
            onClick={() => setViewMore(!viewMore)}
            className="text-center text-sm text-blue-700 hover:text-blue-500 w-full"
          >
            {viewMore ? "Show less" : "Show more"}
          </button>
          : ""
        }
      >
        <DropdownItem key="profile">
          <h1 className="font-semibold">Notifications</h1>
        </DropdownItem>
        {notifications.length > 0
          ? notifications?.slice(0, viewMore ? 10 : 5)?.map((notification) => (
              <DropdownItem
                key={notification.timestamp}
                className="rounded-none"
                showDivider = {true}
              >
                <User
                  as="button"
                  avatarProps={{
                    size: "sm",
                    isBordered: true,
                    src:
                      notification?.user?.profileImageUrl ||
                      "https://i.pravatar.cc/150?u=a042581f4e29026024d",
                  }}
                  className="transition-transform p-2 mb-2"
                  name={renderNotificationMessage(notification)}
                  description={` ${new Date(
                    notification.timestamp
                  ).toLocaleString("EN-IN", {
                    hour: "2-digit",
                    minute: "numeric",
                    timeZone: "Asia/Kolkata",
                  })} on ${new Date(notification.timestamp).toLocaleString(
                    "EN-IN",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      timeZone: "Asia/Kolkata",
                    }
                  )}`}
                />
              </DropdownItem>
            ))
          : 
          <DropdownItem>
            No notifications
            </DropdownItem>}
      </DropdownMenu>
    </Dropdown>
  );
}
