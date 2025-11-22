export async function login(username:string, password:string) {
    const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
    });
    return res.json(); 
}

export async function refreshToken() {
    const res = await fetch("http://localhost:3000/auth/refresh", {
        method: "POST",
        credentials: "include",
    })
    return res.json();
}