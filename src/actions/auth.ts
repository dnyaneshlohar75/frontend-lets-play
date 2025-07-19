import { redirect } from "react-router-dom";

const BACKEND_ENDPOINT ="http://localhost:5000/api";

export async function handleLogin(formdata: FormData) {
    const username = formdata.get("username")?.valueOf() as string;
    const password = formdata.get("password")?.valueOf() as string;

    console.log({username, password});

    try {
        const endpoint = await fetch(`${BACKEND_ENDPOINT}/user/auth/login`, {
            method: "POST",
            body: JSON.stringify({
                username: username.trim(),
                password: password.trim()
            }),
            headers: { "Content-Type": "application/json" },
        });

        const response = await endpoint.json();

        console.log({response});

        if (!response.token) {
            console.log("[ERROR]: Response has no parameter token");
            return;
        }

        localStorage.setItem("session", JSON.stringify({
            token: response?.token,
            user: response?.user,
            isLoggedIn: true
        }));

        redirect("/profile");
    } catch (error) {
        console.log("[ERROR]: " + error?.message);
    }
}

export async function createNewAccount(formdata: FormData) {

    const emailId = "";
    const username = "";
    const password = "";

    try {
        const endpoint = await fetch(`${BACKEND_ENDPOINT}/user/auth/register`, {
            method: "POST",
            body: JSON.stringify({
                username: username.trim(),
                emailId: emailId.trim(),
                password: password.trim()
            }),
            headers: { "Content-Type": "application/json" },
        });

        const response = await endpoint.json();

        console.log({ response });

        if (!response) {
            console.log("[ERROR]: Something went wrong");
            return;
        }

        console.log("Account created..");
    } catch (error) {
        console.log("[ERROR]: " + error?.message);
    }

}