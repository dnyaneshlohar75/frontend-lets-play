import { getMatchById, sendRequestToAddInTeam } from "@/actions/matches";
import { Match } from "@/types/types";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { LuCheckCheck, LuClock8 } from "react-icons/lu";
import { MdOutlineSportsBaseball } from "react-icons/md";
import { HiLocationMarker } from "react-icons/hi";
import { MdArrowOutward } from "react-icons/md";
import { TbUsersGroup } from "react-icons/tb";
import { PiCoinsFill } from "react-icons/pi";
import {
  addToast,
  Button,
  Divider,
  Listbox,
  ListboxItem,
  User,
} from "@heroui/react";
import { useWebsocket } from "@/context/WebSocketContext";

export default function MatchesById() {
  const { id } = useParams();
  const session = JSON.parse(localStorage.getItem("session") as string);
  const [isAlreadyInMatch, setAlreadyInMatch] = useState<boolean | null>(null);
  const [isRequested, setIsRequested] = useState(false);
  const { socket } = useWebsocket();

  const [match, setMatch] = useState<Match>();

  const fetchMatches = useCallback(async () => {
    if (!session) return;
    const response = await getMatchById(id as string);
    setMatch(response);
  }, [session, id]);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  useEffect(() => {
    if (!match || !session?.user?.userId) return;

    const alreadyInMatch = match?.teamMembers?.some(
      (member) => member.userId === session.user.userId
    );

    const isReq = match?.pendingRequests?.some(
      (requestId) => requestId == session.user?.userId
    );
    setIsRequested(isReq || false);
    setAlreadyInMatch(alreadyInMatch as boolean);

    const handleInfo = (resp: { isInMatch: boolean }) => {
      setIsRequested(resp?.isInMatch);
      fetchMatches();
    };

    socket?.on("info", handleInfo);

    return () => {
      socket?.off("info", handleInfo);
    };
  }, [match, socket, session, fetchMatches]);

  const request = async () => {
    if (!session || !id) {
      addToast({
        title: "You are not logged in",
        description: "Please login to proceed.",
        color: "danger",
      });
      return;
    }

    try {
      if (socket) {
        socket.emit("request-to-join", {
          matchId: match?.matchId,
          userId: session.user.userId,
          hostId: match?.hostId,
        });

        socket.once(
          "info",
          async (resp: { isInMatch: boolean; message?: string }) => {
            if (resp?.isInMatch) {
              setIsRequested(true);
              await fetchMatches();
              addToast({
                title: "Request sent",
                description:
                  resp.message || "You’ve requested to join the match.",
                color: "success",
              });
            } else {
              addToast({
                title: "Request Failed",
                description: resp.message || "Could not send request.",
                color: "danger",
              });
            }
          }
        );
      }
    } catch (error) {
      console.error("Request error:", error);
      addToast({
        title: "Something went wrong",
        description: "Unable to send request. Try again later.",
        color: "danger",
      });
    }
  };

  return (
    <section className="w-full px-6 py-3 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-5">
            <div>
              <h1 className="text-3xl font-semibold">{match?.name}</h1>
              <p className="text-gray-700 line-clamp-2">
                Hosted by <span className="font-bold">{match?.user?.name}</span>
              </p>
            </div>

            <div className="flex items-center gap-4">
              <MdOutlineSportsBaseball size={28} />
              <h1 className="text-xl font-semibold capitalize">
                {match?.sportType}
              </h1>
            </div>

            <Divider />

            <div className="grid gap-1">
              <div className="grid grid-cols-[auto_1fr] items-center gap-4">
                <LuClock8 size={28} />
                <h1 className="text-2xl font-semibold">
                  {new Date(match?.date).toLocaleDateString("en-IN", {
                    timeZone: "Asia/Kolkata",
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </h1>
              </div>

              <p className="text-gray-700 pl-[2.6rem]">
                {new Date(
                  match?.groundBookingDetails?.startTime
                ).toLocaleTimeString("en-IN", {
                  timeZone: "Asia/Kolkata",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}{" "}
                to{" "}
                {new Date(
                  match?.groundBookingDetails?.endTime
                ).toLocaleTimeString("en-IN", {
                  timeZone: "Asia/Kolkata",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </p>
            </div>

            <Divider />

            <div>
              <div className="grid gap-1">
                <div className="grid grid-cols-[auto_1fr] items-center gap-4">
                  <HiLocationMarker size={28} />
                  <h1 className="text-2xl font-semibold">
                    {match?.ground?.name}
                  </h1>
                </div>

                <p
                  title={`${match?.ground?.address} ${match?.ground?.city}`}
                  className="text-gray-700 pl-[2.6rem] line-clamp-1"
                >
                  {match?.ground?.address}, {match?.ground?.city}
                </p>
              </div>
              <Button
                size="sm"
                radius="sm"
                className="mt-3 ml-[2.6rem] cursor-pointer border border-blue-600 text-blue-600 py-2 rounded-lg hover:border-blue-500 disabled:bg-gray-400 transition"
                color="primary"
                variant="light"
                endContent={<MdArrowOutward />}
              >
                View on map
              </Button>
            </div>

            <Divider />

            <div className="grid gap-1">
              <div className="grid grid-cols-[auto_1fr] items-center gap-4">
                <PiCoinsFill size={28} />
                <p className="text-2xl font-semibold">
                  {new Intl.NumberFormat("EN-IN", {
                    style: "currency",
                    currency: "INR",
                  }).format(
                    (match?.groundBookingDetails?.bookingCost as number) /
                      match?.noOfPlayers
                  )}
                </p>
              </div>

              <p className="text-gray-700 pl-[2.6rem]">per player</p>
            </div>

            <Divider />

            <div className="grid gap-1">
              <div className="grid grid-cols-[auto_1fr] items-center gap-4">
                <TbUsersGroup size={28} />
                <p className="text-2xl font-semibold">{`${match?.noOfPlayers - match?.teamMembers?.length} ${match?.teamMembers?.length > 1 ? " player" : " players"} required`}</p>
              </div>

              <p className="text-gray-700 pl-[2.6rem]">
                out of {match?.noOfPlayers} players
              </p>
            </div>

            <div></div>
            {/* <div>
              <h1 className="text-xl font-semibold">Amenities</h1>

              <Listbox>
                {match &&
                  match?.ground?.Amenities?.map((amenitie, idx) => (
                    <ListboxItem
                      key={idx}
                      startContent={<LuCheckCheck color="green" />}
                      variant="light"
                    >
                      {amenitie}
                    </ListboxItem>
                  ))}
              </Listbox>
            </div> */}
          </div>

          <div className="space-y-4">
            {/* {match?.teamMembers?.some(
              (member) => member?.userId == match?.hostId
            ) ? null : (
              
            )} */}
            <Button
              disabled={isAlreadyInMatch || isRequested}
              onPress={request}
              className="cursor-pointer w-full bg-blue-700 text-white py-2 rounded-md hover:bg-blue-500 disabled:bg-gray-400 transition"
            >
              {isAlreadyInMatch === null
                ? "You are not logged in"
                : isAlreadyInMatch
                  ? "You are already in this match"
                  : isRequested
                    ? "You already requested"
                    : "Request to join match"}
            </Button>

            <div>
              <h1 className="text-xl font-semibold">
                Players ({match?.teamMembers?.length})
              </h1>

              <Listbox aria-label="Team members" variant="light">
                {match?.teamMembers
                  ? match?.teamMembers?.map((member) => (
                      <ListboxItem key={member.userId} variant="light">
                        <User
                          name={
                            member.userId == session?.user?.userId
                              ? "You"
                              : member.name
                          }
                          avatarProps={{
                            src: member.profileImageUrl,
                          }}
                          description={
                            member.userId == match?.hostId ? "Host" : "Member"
                          }
                        />
                      </ListboxItem>
                    ))
                  : null}
              </Listbox>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
