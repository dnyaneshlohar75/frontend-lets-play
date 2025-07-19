import { FilterType, Match } from "@/types/types";

const BACKEND_ENDPOINT = import.meta.env.VITE_BACKEND_ENDPOINT || "http://localhost:5000/api";

const session = JSON.parse(localStorage.getItem("session") as string);

export async function createNewMatch(match: Match) {

    try {
        const response = await fetch(`${BACKEND_ENDPOINT}/matches/create`, {
            method: "POST",
            body: JSON.stringify(match),
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${session?.token}`
            }
        });

        const data = await response.json();

        if (response.ok) {
            console.log("Match createed...");
            return data;
        }

    } catch(error) {
        console.log("[ERROR]:", (error instanceof Error) && error?.message);
    }
}

export async function getMatchesByFilter(filter: FilterType) {
    try {
        const response = await fetch(`${BACKEND_ENDPOINT}/matches/all`, {
            method: "POST",
            body: JSON.stringify(filter),
            headers: {
                "Content-Type": "application/json",
            }
        });

        const data = await response.json();

        if (response.ok) {
            return data;
        }

    } catch(error) {
        console.log("[ERROR]: ", (error instanceof Error) && error?.message);
    }
}

export async function getMatchesByUserId(userId: string) {
    try {
        const response = await fetch(`${BACKEND_ENDPOINT}/matches/user/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${session?.token}`
            }
        });

        const data = await response.json();

        if (response.ok) {
            return data.matches;
        }

    } catch(error) {
        console.log("[ERROR]: ", (error instanceof Error) && error?.message);
    }
}

export async function getMatchById(matchId: string) {
    try {
        const response = await fetch(`${BACKEND_ENDPOINT}/matches/get/${matchId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${session?.token}`
            }
        });

        const data = await response.json();

        console.log("Match data", data);
        
        if (response.ok) {
            return data.match;
        }

    } catch(error) {
        console.log("[ERROR]: ", (error instanceof Error) && error?.message);
    }
}

export async function sendRequestToAddInTeam(matchId: string) {
    try {
        const response = await fetch(`${BACKEND_ENDPOINT}/matches/request`, {
            method: "POST",
            body: JSON.stringify({ matchId, userId: session.user.userId }),
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${session?.token}`
            }
        });

        const data = await response.json();

        console.log({data});
        if (response.ok) {
            return data;
        }

    } catch(error) {
        console.log("[ERROR]: ", (error instanceof Error) && error?.message);
    }
}

export async function acceptMemberInTeam(matchId: string, userId: string) {
    try {
        const response = await fetch(`${BACKEND_ENDPOINT}/matches/request/accept`, {
            method: "POST",
            body: JSON.stringify({ matchId, userId }),
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${session?.token}`
            }
        });

        const data = await response.json();
        return data;

    } catch(error) {
        console.log("[ERROR]: ", (error instanceof Error) && error?.message);
    }
}

export async function rejectMemberInTeam(matchId: string, userId: string) {
    try {
        const response = await fetch(`${BACKEND_ENDPOINT}/matches/request/reject`, {
            method: "POST",
            body: JSON.stringify({ matchId, userId }),
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${session?.token}`
            }
        });

        const data = await response.json();

        return data;
        
    } catch(error) {
        console.log("[ERROR]: ", (error instanceof Error) && error?.message);
    }
}