import {
  bookCourt,
  checkCourtAvailability,
  getGroundBySportType,
  savePaymentDetailsInDB,
} from "@/actions/grounds";
import { createNewMatch } from "@/actions/matches";
import { CustomRadio } from "@/components/CustomRadio";
import { useLocation } from "@/context/LocationContext";
import { Ground, SportType } from "@/types/types";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import {
  addToast,
  DateInput,
  DatePicker,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  RadioGroup,
  Select,
  SelectItem,
  TimeInput,
  useDisclosure,
} from "@heroui/react";
import { useCallback, useState } from "react";
import { FaTableTennisPaddleBall } from "react-icons/fa6";
import { GiBasketballBall, GiShuttlecock } from "react-icons/gi";
import { IoIosFootball } from "react-icons/io";
import { MdSportsCricket } from "react-icons/md";
import {
  getLocalTimeZone,
  parseDate,
  Time,
  today,
} from "@internationalized/date";
import { RazorpayOrderOptions, useRazorpay } from "react-razorpay";
import { useDateFormatter } from "@react-aria/i18n";

export default function CreateMatch() {
  const [loading, setLoading] = useState(false);
  const [grounds, setGrounds] = useState<Ground[]>([]);
  const [ground, setGround] = useState<Ground>();
  const [courtId, setCourtId] = useState<string>("");
  const [isAvailable, setIsAvailable] = useState(false);
  const [date, setDate] = useState(
    parseDate(today(getLocalTimeZone()).toString())
  );
  const [teamMembers, setTeamMembers] = useState("1");
  const [startTime, setStartTime] = useState<Time | null>(null);
  const [endTime, setEndTime] = useState<Time | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [bookingId, setBookingId] = useState<string>();
  const { Razorpay, error, isLoading } = useRazorpay();
  const formatter = useDateFormatter({ dateStyle: "full" });
  const session = JSON.parse(localStorage.getItem("session") as string);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const loc = useLocation();
  const { user } = JSON.parse(localStorage.getItem("session") as string);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const findDuration = useCallback(() => {
    if (!startTime || !endTime) return 0;

    const startDateTime = date.toDate(getLocalTimeZone());
    startDateTime.setHours(startTime.hour, startTime.minute);

    const endDateTime = date.toDate(getLocalTimeZone());
    endDateTime.setHours(endTime.hour, endTime.minute);

    const durationMs = endDateTime.getTime() - startDateTime.getTime();
    const durationHours = durationMs / (1000 * 60 * 60);

    setDuration(durationHours);
  }, [startTime, endTime]);

  const checkAvailability = useCallback(async () => {
    const formattedDate = formatter.format(date.toDate(getLocalTimeZone()));
    const response = await checkCourtAvailability(courtId, formattedDate);
    console.log(response);
    setIsAvailable(response);
  }, [date, courtId]);

  const bookCourtHandler = useCallback(async () => {
    if (
      !startTime ||
      !endTime ||
      !courtId ||
      !date ||
      !session?.token ||
      !ground
    ) {
      addToast({
        title: "Missing Fields",
        description: "Please select all required booking information.",
        color: "warning",
      });
      return;
    }

    if (duration <= 0) {
      addToast({
        title: "Invalid Duration",
        description: "End time must be after start time.",
        color: "danger",
      });
      return;
    }

    const startDateTime = date.toDate(getLocalTimeZone());
    startDateTime.setHours(startTime.hour, startTime.minute);

    const endDateTime = date.toDate(getLocalTimeZone());
    endDateTime.setHours(endTime.hour, endTime.minute);

    const amount =
      ground?.groundCourts?.find((court) => court.groundCourtId === courtId)
        ?.pricePerHour * duration;

    const bookingData = {
      groundId: ground?.groundId as string,
      groundCourtId: courtId,
      date: date.toString(),
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      duration,
      price: amount * parseInt(teamMembers),
    };

    setLoading(true);
    const response = await bookCourt(bookingData);

    if (!(await loadRazorpayScript())) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    if(!response) {
      alert("Payment could not be processed");
      setLoading(false);
      return;
    }

    const options: RazorpayOrderOptions = {
      key: import.meta.env.VITE_RAZORPAY_API || "rzp_test_gtXUWTyn3o8q1Y",
      amount,
      currency: "INR",
      name: "LET'S PLAY",
      description: "Order Payment",
      order_id: response.order.id,
      handler: async function (response) {

        const data = await savePaymentDetailsInDB(
          {
            ...bookingData,
            noOfPlayers: parseInt(teamMembers)
          },
          {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          },
          true
        )

        setBookingId(data.bookingId);

        alert("Payment Successful!");
        
      },
      prefill: {
        name: session?.user?.name,
        email: session?.user?.email,
      },
      theme: {
        color: "#2B6CB0",
      },
    };

    const razorpay = new Razorpay(options);
    setLoading(false);
    razorpay.open();
  }, [startTime, endTime, courtId, date, session, ground, duration]);

  async function onSportChange(event: React.ChangeEvent<HTMLInputElement>) {
    const sportType = event.target.value;

    const data = await getGroundBySportType(
      sportType,
      loc.location?.coords.latitude as number,
      loc.location?.coords.longitude as number
    );
    setGrounds(data || []);
  }

  async function onGroundChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedGround = grounds.find(
      (g) => g?.groundId === event.target.value
    );

    if (selectedGround) {
      setGround(selectedGround);
      console.log({ selectedGround });
      onOpenChange(true);
    }
  }

  async function handleCreateAccount(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const matchData = {
      name: data.name.toString(),
      description: data.description.toString(),
      sportType: data.sport as SportType,
      date: new Date(date),
      groundId: data.ground.toString(),
      hostId: user?.userId.toString(),
      bookingId
    };

    const response = await createNewMatch(matchData);

    console.log({ response });
    alert('Match created');

    setLoading(false);
  }

  return (
    <div className="w-full space-y-6">
      <header className="mb-4">
        <h1 className="font-semibold text-2xl text-gray-900">Create Match</h1>
        <p className="text-gray-700">
          This is some information about the matches.
        </p>
      </header>
      <main className="my-6 space-y-6">
        <div className="">
          <form className="w-full space-y-3" onSubmit={handleCreateAccount}>
            <Input
              errorMessage=""
              label="Match Name"
              labelPlacement="outside"
              name="name"
              radius="sm"
              placeholder="Enter your match name"
              type="text"
              isRequired
            />
            <Textarea
              errorMessage=""
              label="Description"
              labelPlacement="outside"
              name="description"
              radius="sm"
              placeholder="Enter your match description"
              type="text"
            />

            <div className="">
              <RadioGroup
                className="w-full pb-6 flex justify-between"
                label="Select Sport"
                name="sport"
                onChange={onSportChange}
                defaultValue="football"
                orientation="horizontal"
                isRequired
              >
                <CustomRadio value="football" icon={IoIosFootball}>
                  Football
                </CustomRadio>
                <CustomRadio value="cricket" icon={MdSportsCricket}>
                  Cricket
                </CustomRadio>
                <CustomRadio value="badminton" icon={GiShuttlecock}>
                  Badminton
                </CustomRadio>
                <CustomRadio value="basketball" icon={GiBasketballBall}>
                  Basketball
                </CustomRadio>
                <CustomRadio value="tt" icon={FaTableTennisPaddleBall}>
                  Tennis
                </CustomRadio>
              </RadioGroup>
            </div>

            <Select
              labelPlacement="outside"
              label="Select Ground"
              radius="sm"
              name="ground"
              placeholder="Select your ground"
              onChange={onGroundChange}
              isRequired
            >
              {grounds.length > 0 ? (
                grounds.map((ground) => (
                  <SelectItem key={ground.groundId}>{ground.name}</SelectItem>
                ))
              ) : (
                <SelectItem isReadOnly>No grounds available</SelectItem>
              )}
            </Select>

            {ground ? (
              <>
                <Modal
                  isOpen={isOpen}
                  onOpenChange={onOpenChange}
                  radius="sm"
                  size="2xl"
                >
                  <ModalContent>
                    {(onClose) => (
                      <>
                        <ModalHeader>Enter booking details</ModalHeader>
                        <ModalBody className="p-6">
                          <header>
                            <h1 className="text-xl font-bold">
                              {ground?.name} @ {ground.address}, {ground.city}
                            </h1>
                            <p className="text-xs text-gray-600">
                              {ground?.description}
                            </p>
                          </header>

                          <Select
                            label="Select Court"
                            labelPlacement="outside"
                            radius="sm"
                            onSelectionChange={(e) => {
                              setCourtId(e.currentKey?.toString());
                            }}
                            isRequired
                          >
                            {ground?.groundCourts?.map((court) => (
                              <SelectItem
                                key={court.groundCourtId}
                                value={court?.courtName}
                              >
                                {court.courtName}
                              </SelectItem>
                            ))}
                          </Select>

                          <Input
                            labelPlacement="outside"
                            label="Team members"
                            errorMessage=""
                            type="number"
                            radius="sm"
                            name="teamMembers"
                            min={1}
                            max={ground?.groundCourts?.find((court) => court.groundCourtId == courtId)?.playerCapacity}
                            defaultValue={teamMembers}
                            onChange={(e) => setTeamMembers(e.target.value)}
                            placeholder="Team members"
                            isRequired
                          />

                          <DatePicker
                            defaultValue={today(getLocalTimeZone()).subtract({
                              days: 1,
                            })}
                            label="Select Date"
                            labelPlacement="outside"
                            radius="sm"
                            value={date}
                            onChange={setDate}
                            minValue={today(getLocalTimeZone())}
                            isRequired
                          />

                          <div>
                            <button
                              onClick={checkAvailability}
                              className="text-sm text-blue-800 font-semibold cursor-pointer"
                            >
                              Check availability
                            </button>
                            {isAvailable ? (
                              <p className="text-sm text-green-600 font-semibold">
                                Available
                              </p>
                            ) : (
                              <p className="text-sm text-red-600 font-semibold">
                                Not Available
                              </p>
                            )}
                          </div>

                          {isAvailable && (
                            <>
                              <div className="grid grid-cols-2 gap-4 mt-3">
                                <TimeInput
                                  label="Start Time"
                                  radius="sm"
                                  labelPlacement="outside"
                                  value={startTime}
                                  onChange={(e) => {
                                    setStartTime(e);
                                    findDuration();
                                  }}
                                  isRequired
                                />

                                <TimeInput
                                  label="End Time"
                                  radius="sm"
                                  labelPlacement="outside"
                                  value={endTime}
                                  onChange={(e) => {
                                    setEndTime(e);
                                    findDuration();
                                  }}
                                  isRequired
                                />
                              </div>
                              <p className="text-sm text-blue-600 font-semibold">
                                {duration} Hrs.
                              </p>
                            </>
                          )}
                        </ModalBody>

                        <ModalFooter>
                          <Button
                            color="success"
                            className="w-full text-white"
                            radius="sm"
                            isLoading={loading}
                            onPress={() => {
                              if (session?.token) {
                                bookCourtHandler();
                              } else {
                                addToast({
                                  title: "You are not logged in",
                                  description:
                                    "Please login to proceed with booking",
                                  color: "danger",
                                });
                              }
                            }}
                          >
                            Proceed to payment
                          </Button>
                        </ModalFooter>
                      </>
                    )}
                  </ModalContent>
                </Modal>
              </>
            ) : null}
            <Button
              type="submit"
              color="success"
              radius="sm"
              size="sm"
              className="text-white rounded px-6 py-2"
              isLoading={loading}
            >
              {loading ? "Creating.." : "Create"}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
