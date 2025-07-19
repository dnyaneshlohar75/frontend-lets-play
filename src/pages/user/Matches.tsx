import {
  acceptMemberInTeam,
  getMatchesByUserId,
  rejectMemberInTeam,
} from "@/actions/matches";
import { Match } from "@/types/types";

import {
  Avatar,
  AvatarGroup,
  Card,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  useDisclosure,
  Listbox,
  ListboxItem,
  Tab,
  Tabs,
  User,
  Divider,
} from "@heroui/react";

import {
  LuCircleArrowRight,
  LuCircleCheck,
  LuCircleX,
  LuClock8,
} from "react-icons/lu";

import { useCallback, useEffect, useState } from "react";
import { LuPlus } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useWebsocket } from "@/context/WebSocketContext";
import { MdArrowOutward, MdOutlineSportsBaseball } from "react-icons/md";
import { HiLocationMarker } from "react-icons/hi";

export default function UserMatches() {
  const navigate = useNavigate();
  const [matches, setMatches] = useState<Match[] | []>([]);
  const session = JSON.parse(localStorage.getItem("session") as string);
  const { user } = session;
  const { socket } = useWebsocket();
  const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure();

  const fetchMatches = useCallback(async () => {
    if (!user) return;
    const response = await getMatchesByUserId(user.userId);
    setMatches(response);
  }, [user]);

  const acceptMember = useCallback(
    async (matchId: string, userId: string) => {
      if (socket) {
        socket.emit("accept-request", {
          matchId,
          userId,
        });
      }

      await fetchMatches();
    },
    [socket, fetchMatches]
  );

  const rejectMember = useCallback(
    async (matchId: string, userId: string) => {
      if (socket) {
        socket.emit("reject-request", {
          matchId,
          userId,
        });
      }

      await fetchMatches();
    },
    [socket, fetchMatches]
  );

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  return (
    <section className="">
      <div className="">
        <div className="flex w-full flex-col">
          <div>
            <header className="flex items-center justify-between">
              <div>
                <h1 className="font-semibold text-xl text-gray-900">Matches</h1>
                <p className="text-gray-700">
                  This is some information about the matches.
                </p>
              </div>
              <Button
                radius="sm"
                className="rounded-md bg-blue-700 text-white"
                // isLoading={isLoading}
                startContent={<LuPlus />}
                onPress={() => {
                  navigate("/user/matches/create");
                }}
              >
                Create new match
              </Button>
            </header>
            <main className="my-6">
              <div className="gap-4 space-y-6">
                {matches ? (
                  matches.map((match) => (
                    <>
                      <Card className="p-4" radius="sm" shadow="sm">
                        <div className="mb-3 text-center">
                          <h1 className="font-semibold text-xl">
                            {new Date(match?.date).toLocaleDateString("en-IN", {
                              timeZone: "Asia/Kolkata",
                              weekday: "long",
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            })}
                          </h1>
                          <p className="text-gray-700">
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

                        <div className="space-x-4 grid grid-cols-12 mt-3">
                          <div className="col-span-2 flex items-center justify-center flex-col">
                            <Chip
                              color="primary"
                              size="sm"
                              className="text-white"
                            >
                              {match.sportType}
                            </Chip>
                          </div>

                          <p className="text-sm col-span-7">
                            <p className="font-semibold text-xl">
                              {match.ground?.name}
                            </p>
                            <span className="text-gray-600 line-clamp-1">
                              {match.ground?.address}, {match.ground?.city}
                            </span>
                          </p>

                          <p className="col-span-2">
                            {match.teamMembers?.length === 1 ? (
                              <div className="gap-y-2">
                                <Avatar
                                  size="sm"
                                  src={match.user?.profileImageUrl}
                                />
                                <h1 className="font-semibold text-sm">
                                  {match.teamMembers.length} is going
                                </h1>
                              </div>
                            ) : (
                              <div className="gap-y-2">
                                <AvatarGroup max={3}>
                                  {match.teamMembers?.map((member, idx) => (
                                    <Avatar
                                      key={idx}
                                      size="sm"
                                      src={member?.profileImageUrl}
                                    />
                                  ))}
                                </AvatarGroup>
                                <h1 className="font-semibold text-sm">
                                  {match.teamMembers?.length} are going
                                </h1>
                              </div>
                            )}
                          </p>

                          <Button
                            isIconOnly
                            startContent={<LuCircleArrowRight size={24} />}
                            size="sm"
                            variant="light"
                            radius="full"
                            color="primary"
                            onPress={onOpen}
                            // className="absolute bottom-1 right-2 z-50"
                          />
                        </div>
                      </Card>

                      <Modal
                        isOpen={isOpen}
                        onOpenChange={onOpenChange}
                        radius="sm"
                        size="4xl"
                      >
                        <ModalContent>
                          {(onClose) => (
                            <>
                              <ModalHeader className="flex flex-col gap-1">
                                <h1 className="text-2xl font-semibold">
                                  {match.name}
                                </h1>
                                <p className="text-gray-700 line-clamp-2 text-sm">
                                  Hosted by{" "}
                                  <span className="font-bold">
                                    {match?.user?.name}
                                  </span>
                                </p>
                              </ModalHeader>
                              <ModalBody>
                                <main className="grid grid-cols-12 gap-x-10">
                                  <div className="w-full col-span-7">
                                    <div className="col-span-2 space-y-5">
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
                                          <h1 className="text-xl font-semibold">
                                            {new Date(
                                              match?.date
                                            ).toLocaleDateString("en-IN", {
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
                                            <h1 className="text-xl font-semibold">
                                              {match?.ground?.name}
                                            </h1>
                                          </div>

                                          <p
                                            title={`${match?.ground?.address} ${match?.ground?.city}`}
                                            className="text-gray-700 pl-[2.6rem] line-clamp-1"
                                          >
                                            {match?.ground?.address},{" "}
                                            {match?.ground?.city}
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
                                    </div>
                                  </div>

                                  <div className="w-full col-span-5">
                                    <Tabs
                                      aria-label="Options"
                                      classNames={{
                                        tabList:
                                          "gap-6 w-full relative rounded-none p-0 border-b border-divider",
                                        cursor: "w-full bg-gray-800",
                                        tab: "max-w-fit px-0 h-12",
                                        tabContent:
                                          "group-data-[selected=true]:text-gray-800",
                                      }}
                                      className="w-full"
                                      color="default"
                                      variant="underlined"
                                    >
                                      <Tab
                                        key="pending"
                                        title={`Pending Requests ${(
                                          <Chip size="sm" color="primary">
                                            {match?.pendingRequests?.length ||
                                              0}
                                          </Chip>
                                        )}`}
                                      >
                                        <Listbox
                                          aria-label="Pending Requests"
                                          variant="light"
                                        >
                                          {match?.pendingRequests?.length !=
                                            undefined &&
                                          match?.pendingRequests?.length > 0 ? (
                                            match?.pendingRequests
                                              ?.slice(0, 5)
                                              .map((member) => (
                                                <ListboxItem
                                                  key={member?.userId}
                                                  variant="light"
                                                >
                                                  <div className="flex justify-between items-center">
                                                    <User
                                                      name={member.name}
                                                      avatarProps={{
                                                        src: member.profileImageUrl,
                                                      }}
                                                      description={
                                                        member.userId ==
                                                        match?.hostId
                                                          ? "Host"
                                                          : "Member"
                                                      }
                                                    />
                                                    <div className="flex gap-2">
                                                      <Button
                                                        radius="sm"
                                                        size="sm"
                                                        onPress={() =>
                                                          acceptMember(
                                                            match?.matchId as string,
                                                            member.userId
                                                          )
                                                        }
                                                        variant="solid"
                                                        color="primary"
                                                        startContent={
                                                          <LuCircleCheck
                                                            size={18}
                                                          />
                                                        }
                                                      >
                                                        Accept
                                                      </Button>
                                                      <Button
                                                        radius="sm"
                                                        size="sm"
                                                        onPress={() =>
                                                          rejectMember(
                                                            match?.matchId as string,
                                                            member.userId
                                                          )
                                                        }
                                                        variant="light"
                                                        color="danger"
                                                        startContent={
                                                          <LuCircleX
                                                            size={18}
                                                          />
                                                        }
                                                      >
                                                        Reject
                                                      </Button>
                                                    </div>
                                                  </div>
                                                </ListboxItem>
                                              ))
                                          ) : (
                                            <ListboxItem>
                                              No pending requestes available.
                                            </ListboxItem>
                                          )}
                                        </Listbox>
                                      </Tab>

                                      <Tab
                                        key="members"
                                        title="Team Members"
                                        className="w-full"
                                      >
                                        <Listbox
                                          aria-label="Team Members"
                                          variant="light"
                                        >
                                          {!match ? (
                                            <ListboxItem>
                                              No Members
                                            </ListboxItem>
                                          ) : (
                                            (match?.teamMembers ?? []).map(
                                              (member) => (
                                                <ListboxItem
                                                  key={member?.userId}
                                                  variant="light"
                                                >
                                                  <User
                                                    name={member.name}
                                                    avatarProps={{
                                                      src: member.profileImageUrl,
                                                    }}
                                                    description={
                                                      member.userId ==
                                                      match?.hostId
                                                        ? "Host"
                                                        : "Member"
                                                    }
                                                  />
                                                </ListboxItem>
                                              )
                                            )
                                          )}
                                        </Listbox>
                                      </Tab>
                                    </Tabs>
                                  </div>
                                </main>
                              </ModalBody>
                            </>
                          )}
                        </ModalContent>
                      </Modal>
                    </>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center gap-6 rounded-lg p-4">
                    <h1 className="text-xl font-semibold">Matches not found</h1>
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>
    </section>
  );
}
