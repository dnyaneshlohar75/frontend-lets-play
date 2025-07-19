import {
  Avatar,
  AvatarGroup,
  Button,
  Card,
  CheckboxGroup,
  Chip,
  DatePicker,
  Input,
  Slider,
  Tab,
  Tabs,
} from "@heroui/react";

import { CustomSportCheckbox } from "@/components/SportsSelectors";
import { getLocalTimeZone, today } from "@internationalized/date";

import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";

import { LuSearch } from "react-icons/lu";
import { IoIosFootball } from "react-icons/io";
import { MdSportsCricket } from "react-icons/md";
import { FaTableTennisPaddleBall } from "react-icons/fa6";
import { GiShuttlecock, GiBasketballBall } from "react-icons/gi";
import { FilterType } from "@/types/types";
import { getMatchesByFilter } from "@/actions/matches";
import { Match } from "@/types/types";
import { useLocation } from "@/context/LocationContext";

export default function Matches() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [matches, setMatches] = useState<Match[] | []>([]);

  const [sports, setSports] = useState<string[]>([]);

  const loc = useLocation();

  const [filter, setFilter] = useState<FilterType>({
    searchQuery: searchParams.get("location") || "",
    date:
      searchParams.get("date") ||
      today(getLocalTimeZone()).add({ days: 1 }).toString(),
    distance: [
      Number(searchParams.get("min")) || 500,
      Number(searchParams.get("max")) || 1500,
    ],
    sports: searchParams.get("sports")?.split(",") || [],
    location: {
      latitude: loc.location?.coords.latitude as number,
      longitude: loc.location?.coords.longitude as number,
    },
  });

  useEffect(() => {
    (async () => {
      await applyFilter();
    })();
  }, []);

  async function applyFilter() {
    const params = new URLSearchParams();

    if (filter.searchQuery) params.set("q", filter.searchQuery);
    if (filter.date) params.set("date", filter.date);
    if (filter.distance.length === 2) {
      params.set("min", filter.distance[0].toString());
      params.set("max", filter.distance[1].toString());
    }

    params.set("lat", loc.location?.coords?.latitude.toString() as string);
    params.set("lng", loc.location?.coords?.longitude.toString() as string);

    if (filter.sports.length > 0) {
      params.set("sports", filter.sports.join(","));
    }

    navigate({ search: `?${params.toString()}` }, { replace: true });

    const response = await getMatchesByFilter({
      ...filter,
      location: {
        latitude: loc.location?.coords.latitude as number,
        longitude: loc.location?.coords.longitude as number,
      },
    });
    setMatches(response?.matches || []);
    setSports(response?.sportsGroup);
  }

  return (
    <section className="w-full px-6 py-3 bg-white -z-50">
      <div className="max-w-6xl mx-auto flex gap-12">
        <div className="min-w-72 sticky top-4 left-0">
          <header>
            <h1 className="font-semibold text-xl text-gray-900">
              Filter matches
            </h1>
          </header>

          <main className="my-4 space-y-6 overflow-hidden">
            <Input
              placeholder="Search location..."
              startContent={<LuSearch />}
              radius="sm"
              value={filter.searchQuery}
              onChange={(e) =>
                setFilter((prev) => ({
                  ...prev,
                  searchQuery: e.target.value,
                }))
              }
            />

            <DatePicker
              defaultValue={today(getLocalTimeZone()).add({ days: 1 })}
              label="Select date"
              labelPlacement="outside"
              radius="sm"
              minValue={today(getLocalTimeZone())}
              onChange={(val) =>
                setFilter((prev) => ({
                  ...prev,
                  date: val?.toString() || "",
                }))
              }
            />

            <Slider
              className="max-w-md"
              defaultValue={filter.distance}
              label="Distance in (metres)"
              maxValue={2000}
              size="sm"
              minValue={0}
              step={50}
              color="primary"
              onChange={(val) =>
                setFilter((prev) => ({
                  ...prev,
                  distance: val as number[],
                }))
              }
            />

            <CheckboxGroup
              className="w-72 flex justify-between"
              value={filter.sports}
              label={<h1 className="text-sm text-gray-900">Select Sports</h1>}
              onChange={(val) =>
                setFilter((prev) => ({
                  ...prev,
                  sports: val,
                }))
              }
              orientation="horizontal"
            >
              <CustomSportCheckbox value="football" icon={IoIosFootball}>
                Football
              </CustomSportCheckbox>
              <CustomSportCheckbox value="cricket" icon={MdSportsCricket}>
                Cricket
              </CustomSportCheckbox>
              <CustomSportCheckbox value="badminton" icon={GiShuttlecock}>
                Badminton
              </CustomSportCheckbox>
              <CustomSportCheckbox value="basketball" icon={GiBasketballBall}>
                Basketball
              </CustomSportCheckbox>
              <CustomSportCheckbox value="tt" icon={FaTableTennisPaddleBall}>
                Tennis
              </CustomSportCheckbox>
            </CheckboxGroup>

            <Button
              className="cursor-pointer w-full bg-blue-700 text-white py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400 transition"
              onPress={() => applyFilter()}
            >
              Apply filter
            </Button>
          </main>
        </div>

        <div className="flex-1">
          <header>
            <h1 className="font-semibold text-xl text-gray-900">
              Search results
            </h1>
          </header>
          <main className="my-4 space-y-6">
            <Tabs variant="light" color="primary" size="sm" radius="sm">
              <Tab key="All" title="Related to search">
                {matches && matches.length === 0 ? (
                  <h1 className="font-semibold text-2xl text-center">
                    No matches found
                  </h1>
                ) : (
                  <div>
                    <div className="space-y-6">
                      {matches.map((match) => (
                        <Card className="p-4" radius="sm">
                          <Link
                            to={`/match/${match.matchId}`}
                            className="space-y-2"
                          >
                            <h1 className="font-bold text-lg text-center">
                              {new Date(match.date).toLocaleDateString(
                                "en-IN",
                                {
                                  timeZone: "Asia/Kolkata",
                                  weekday: "long",
                                  day: "2-digit",
                                  month: "long",
                                  year: "numeric",
                                }
                              )}
                            </h1>
                            <Chip
                              color="warning"
                              size="sm"
                              className="text-white"
                            >
                              {match.sportType}
                            </Chip>
                            <p className="text-sm">
                              <span>
                                {match.ground?.name}, {match.ground?.address},{" "}
                                {match.ground?.city}
                              </span>
                            </p>

                            {match.teamMembers?.length === 1 ? (
                              <div className="flex items-center gap-x-2">
                                <Avatar
                                  size="sm"
                                  src={match.user?.profileImageUrl}
                                />
                                <h1 className="font-semibold">
                                  {match.teamMembers.length} is going
                                </h1>
                              </div>
                            ) : (
                              <div className="flex items-center gap-x-2">
                                <AvatarGroup max={3}>
                                  {match.teamMembers?.map((member, idx) => (
                                    <Avatar
                                      key={idx}
                                      size="sm"
                                      src={member.profileImageUrl}
                                    />
                                  ))}
                                </AvatarGroup>
                                <h1 className="font-semibold">
                                  {match.teamMembers?.length} are going
                                </h1>
                              </div>
                            )}
                          </Link>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </Tab>
              {sports?.map((sport) => (
                <Tab key={sport} title={<p className="capitalize">{sport}</p>}>
                  {matches
                    ?.filter((match) => match.sportType.includes(sport))
                    .map((match) => (
                      <div>
                        <div className="space-y-6">
                          {matches.map((match) => (
                            <Card className="p-4" radius="sm">
                              <Link
                                to={`/match/${match.matchId}`}
                                className="space-y-2"
                              >
                                <h1 className="font-bold text-lg text-center">
                                  {new Date(match.date).toLocaleDateString(
                                    "en-IN",
                                    {
                                      timeZone: "Asia/Kolkata",
                                      weekday: "long",
                                      day: "2-digit",
                                      month: "long",
                                      year: "numeric",
                                    }
                                  )}
                                </h1>
                                <Chip
                                  color="warning"
                                  size="sm"
                                  className="text-white"
                                >
                                  {match.sportType}
                                </Chip>
                                <p className="text-sm">
                                  <span>
                                    {match.ground?.name},{" "}
                                    {match.ground?.address},{" "}
                                    {match.ground?.city}
                                  </span>
                                </p>

                                {match.teamMembers?.length === 1 ? (
                                  <div className="flex items-center gap-x-2">
                                    <Avatar
                                      size="sm"
                                      src={match.user?.profileImageUrl}
                                    />
                                    <h1 className="font-semibold">
                                      {match.teamMembers.length} is going
                                    </h1>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-x-2">
                                    <AvatarGroup max={3}>
                                      {match.teamMembers?.map((member, idx) => (
                                        <Avatar
                                          key={idx}
                                          size="sm"
                                          src={member.profileImageUrl}
                                        />
                                      ))}
                                    </AvatarGroup>
                                    <h1 className="font-semibold">
                                      {match.teamMembers?.length} are going
                                    </h1>
                                  </div>
                                )}
                              </Link>
                            </Card>
                          ))}
                        </div>
                      </div>
                    ))}
                </Tab>
              ))}
            </Tabs>
          </main>
        </div>
      </div>
    </section>
  );
}
