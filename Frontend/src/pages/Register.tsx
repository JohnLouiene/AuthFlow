import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import '../App.css';

//Registration Page
function Register() {
    //Variables Calling the database
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    const goToLogin = () => {
        navigate('/')
    }

    // Function to call the backend
    async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setMessage('Registering New User...');

        //Calling the backend
        try {
            const res = await fetch('http://localhost:3000/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage(`✅ ${data.message}`);
                console.log('New User data:', data.safeUser);

                setTimeout(() => {
                    goToLogin()
                },
                    1500
                );

            } else {
                setMessage(`❌ ${data.error}`);
            }

        } catch (err) {
            console.error('Error Registering New User:', err);
            setMessage('❌ Server error');
        }
    }

    return (
        <div className="register-container" style={{ maxWidth: "300px", margin: "auto" }}>
            <h1>Register</h1>
            <form onSubmit={handleRegister}>

                <div style={{ marginBottom: "10px" }}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div style={{ marginBottom: "10px" }}>
                    <input
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div style={{ marginBottom: "10px" }}>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit">Register</button>
            </form>

            <div>
            <p>{message}</p>
            </div>
             
            <button type="button" onClick={goToLogin}>Already Have an Account?</button>
        </div>
    );
}

export default Register;
