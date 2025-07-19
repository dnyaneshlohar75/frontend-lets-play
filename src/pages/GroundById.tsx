import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Ground } from "../types/types";

import {
  bookCourt,
  checkCourtAvailability,
  getGroundById,
} from "../actions/grounds";

import {
  addToast,
  Button,
  DatePicker,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  TimeInput,
  useDisclosure,
} from "@heroui/react";

import GroundPageCarousel from "../components/GroundPageCarousel";

import {
  getLocalTimeZone,
  parseDate,
  Time,
  today,
} from "@internationalized/date";

import { useDateFormatter } from "@react-aria/i18n";

import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";

export default function GroundById() {
  const { id } = useParams();
  const [ground, setGround] = useState<Ground | null>(null);
  const [courtId, setCourtId] = useState<string>("");
  const [isAvailable, setIsAvailable] = useState(false);
  const navigate = useNavigate();
  const session = JSON.parse(localStorage.getItem("session") as string);
  const [loading, setLoading] = useState(false);
  const {Razorpay, error, isLoading} = useRazorpay();
  const formatter = useDateFormatter({ dateStyle: "full" });
  const [date, setDate] = useState(
    parseDate(today(getLocalTimeZone()).toString())
  );
  const [startTime, setStartTime] = useState<Time | null>(null);
  const [endTime, setEndTime] = useState<Time | null>(null);
  const [duration, setDuration] = useState<number>(0);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    (async function () {
      const response = await getGroundById(id as string);
      console.log({ response });
      setGround(response);
    })();
  }, [id]);

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
      price: amount,
    };

    setLoading(true);
    const response = await bookCourt(bookingData);
  
    if (!await loadRazorpayScript()) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const options: RazorpayOrderOptions = {
      key: "rzp_test_gtXUWTyn3o8q1Y",
      amount,
      currency: "INR",
      name: "LET'S PLAY",
      description: "Order Payment",
      order_id: response.order.id,
      handler: async function (response) {
        alert("Payment Successful!");
        //save into db
        console.log({response});
      },
      prefill: {
        name: session?.user?.name,
        email: session?.user?.email
      },
      theme: {
        color: "#2B6CB0",
      },
    };
  
    const razorpay = new Razorpay(options);
    setLoading(false);
    razorpay.open();

  }, [startTime, endTime, courtId, date, session, ground, duration]);

  if (ground) {
    return (
      <section className="w-full px-6 py-3 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-12 gap-8">
            <div className="w-full col-span-7">
              <div>
                <GroundPageCarousel data={ground.imageUrls} />
              </div>

              <div className="space-y-3 my-3">
                <div className="p-2 border rounded-lg border-neutral-200">
                  <h1 className="font-bold text-xl">Sports available</h1>
                  <ul style={{ display: "flex", gap: 14 }}>
                    {ground?.Amenities?.map((amenity, idx) => (
                      <li
                        key={idx}
                        className="text-neutral-700 flex items-center gap-3"
                      >
                        <p>{amenity}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-2 border rounded-lg border-neutral-200">
                  <h1 className="font-bold text-xl">Amenities</h1>
                  <ul style={{ display: "flex", gap: 14 }}>
                    {ground?.Amenities?.map((amenity, idx) => (
                      <li
                        key={idx}
                        className="text-neutral-700 flex items-center gap-3"
                      >
                        <p>{amenity}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="w-full col-span-5">
              <header className="">
                <h1 className="font-bold text-green-500 text-3xl mb-3">
                  {ground?.name}
                </h1>
                <p className="text-neutral-700 text-sm">
                  {ground?.description}
                </p>
              </header>
              <main className="my-3 space-y-3">
                <div className="p-2 border rounded-lg border-neutral-200">
                  <h1 className="font-bold text-xl">Opening time</h1>
                  <p>
                    {`${new Date(ground.startTime as string).toLocaleTimeString(
                      [],
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )} to ${new Date(
                      ground.endTime as string
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}`}
                  </p>
                </div>

                <div className="p-2 border rounded-lg border-neutral-200">
                  <h1 className="font-bold text-xl">Location</h1>
                  <div className="flex items-center gap-2">
                    <h1>
                      <b>
                        {ground.address}, {ground.city}
                      </b>{" "}
                      - {ground.distance} km.
                    </h1>
                  </div>
                </div>

                <div className="w-full">
                  <Button
                    color="success"
                    className="w-full text-white"
                    radius="sm"
                    onPress={onOpen}
                  >
                    Book Now
                  </Button>
                </div>
              </main>
            </div>
          </div>
        </div>
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
                          description: "Please login to proceed with booking",
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
      </section>
    );
  }
}