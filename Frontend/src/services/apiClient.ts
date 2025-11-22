import { refreshToken } from "./authService";

export async function fetchWithToken(url:string, options:any = {}) {
    let token = localStorage.getItem("token");

    if (!options.headers) options.headers = {};
    options.headers["Authorization"] = `Bearer ${token}`;
    options.credentials = "include";

    let res = await fetch(url, options)

    if (res.status === 401){
        const data = await refreshToken();
        if (!data.token) throw new Error("Unable to Refresh Token");

        localStorage.setItem("token", data.token);
        options.headers["Authorization"] = `Bearer ${data.token}`;
        res = await fetch(url, options)
    }
    
    return res.json();
}