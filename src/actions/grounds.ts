import { BookingType, Ground } from "../types/types";

const BACKEND_ENDPOINT = `${import.meta.env.VITE_BACKEND_ENDPOINT}/grounds` || "http://localhost:5000/api/grounds";

export async function getGroundsNearby(latitude: number, longitude: number): Promise<Ground[] | null> {
    try {
        const endpoint = await fetch(`${BACKEND_ENDPOINT}/all/${latitude.toString()}/${longitude.toString()}/0/5`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        const response = await endpoint.json();

        console.log({response})
        return response.grounds;

    } catch (error) {
        console.log("[ERROR]: ", (error instanceof Error) && error?.message);
        return null;
    }
}

export async function getGroundById(groundId: string): Promise<Ground | null> {
    try {
        const endpoint = await fetch(`${BACKEND_ENDPOINT}/${groundId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        const response = await endpoint.json();

        console.log({response});

        return response.ground;

    } catch (error) {
        console.log("[ERROR]: ", (error instanceof Error) && error?.message);
        return null;
    }
}

export async function getGroundBySportType(sportType: string, latitude: number, longitude: number): Promise<Ground[] | null> {
    try {
        const endpoint = await fetch(`${BACKEND_ENDPOINT}/sport/${sportType}/${latitude}/${longitude}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        const response = await endpoint.json();

        console.log({response});

        return response.grounds;

    } catch (error) {
        console.log("[ERROR]: ", (error instanceof Error) && error?.message);
        return null;
    }
}

export async function checkCourtAvailability(courtId: string, date: string): Promise<any> {
    try {
        const endpoint = await fetch(`${BACKEND_ENDPOINT}/court/availability`, {
            method: "POST",

            body: JSON.stringify({
                courtId: courtId,
                date: date
            }),

            headers: { "Content-Type": "application/json" },
        });

        const response = await endpoint.json();

        console.log({response});

        return response.isAvailable;

    } catch (error) {
        console.log("[ERROR]: ", (error instanceof Error) && error?.message);
        return null;
    }
}

export async function bookCourt({ groundId, groundCourtId, date, startTime, endTime, duration, price }: BookingType): Promise<any> {
    const { user, token } = JSON.parse(localStorage.getItem("session") as string);
    try {
        const endpoint = await fetch(`${BACKEND_ENDPOINT}/court/book`, {
            method: "POST",
            body: JSON.stringify({
                userId: user?.userId,
                groundId: groundId,
                groundCourtId: groundCourtId,
                date: date,
                startTime: startTime,
                endTime: endTime,
                duration: duration,
                price: price
            }),
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`,
            },
        });

        const response = await endpoint.json();

        console.log({response});

        return response;

    } catch (error) {
        console.log("[ERROR]: ", (error instanceof Error) && error?.message);
        return null;
    }
}

export async function savePaymentDetailsInDB({ groundId, groundCourtId, date, noOfPlayers, startTime, endTime, duration, price }: BookingType, {razorpay_order_id, razorpay_payment_id, razorpay_signature}: {razorpay_order_id: string, razorpay_payment_id: string, razorpay_signature: string}, isCreateMatch: boolean): Promise<any> {
    const { user, token } = JSON.parse(localStorage.getItem("session") as string);
    try {
        const endpoint = await fetch(`${BACKEND_ENDPOINT}/court/book/save`, {
            method: "POST",
            body: JSON.stringify({
                paymentId: razorpay_payment_id,
                orderId: razorpay_order_id,
                signature: razorpay_signature,
                userId: user?.userId,
                groundId: groundId,
                groundCourtId: groundCourtId,
                date: date,
                noOfPlayers,
                startTime: startTime,
                endTime: endTime,
                duration: duration,
                price: price
            }),
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`,
            },
        });

        const response = await endpoint.json();

        console.log({response});

        return response.payment;

    } catch (error) {
        console.log("[ERROR]: ", (error instanceof Error) && error?.message);
        return null;
    }
}