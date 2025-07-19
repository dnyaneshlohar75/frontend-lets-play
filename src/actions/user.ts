const BACKEND_ENDPOINT = import.meta.env.VITE_BACKEND_ENDPOINT || "http://localhost:5000/api";

export async function uploadProfilePicture(imageUrl: string) {
    const session = JSON.parse(localStorage.getItem("session") as string);

    try {
        const endpoint = await fetch(`${BACKEND_ENDPOINT}/user/${session?.user?.userId}/upload/profile_img`, {
            method: "POST",
            body: JSON.stringify({
                imageUrl
            }),
            headers: { "Content-Type": "application/json", "authorization": `Bearer ${session?.token}` },
        });

        const response = await endpoint.json();

        if(response) {
            localStorage.setItem("session", JSON.stringify({
                token: response?.token,
                user: response?.imageEntry,
                isLoggedIn: true
            }));
        }
  
    } catch(error) {
        console.log("[ERROR]:", (error instanceof Error) && error?.message);
    }
}

export async function getUserSettings(userId: string) {
    const session = JSON.parse(localStorage.getItem("session") as string);

    try {
        const endpoint = await fetch(`${BACKEND_ENDPOINT}/user/${userId}/settings`, {
            method: "GET",
            headers: { "Content-Type": "application/json", "authorization": `Bearer ${session?.token}` },
        });

        const response = await endpoint.json();
        return response?.userSettings;

    } catch(error) {
        console.log("[ERROR]:", (error instanceof Error) && error?.message);
    }

}

export async function updateUserSettings(userId: string, serviceName: string, serviceValue: boolean) {
    const session = JSON.parse(localStorage.getItem("session") as string);

    try {
        const endpoint = await fetch(`${BACKEND_ENDPOINT}/user/${userId}/settings`, {
            method: "PUT",

            body: JSON.stringify({
               isEmailService: serviceName === "email" ? serviceValue : false,
               isLocationService: serviceName === "location" ? serviceValue : false,
               isNotificationService: serviceName === "notification" ? serviceValue : false
            }),

            headers: { "Content-Type": "application/json", "authorization": `Bearer ${session?.token}` },
        });

        const response = await endpoint.json();
        return response;

    } catch(error) {
        console.log("[ERROR]:", (error instanceof Error) && error?.message);
    }
}