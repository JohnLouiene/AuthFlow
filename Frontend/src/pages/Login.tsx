import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { login } from '../services/authService';
import '../App.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const goToRegister = () => {
    navigate("/register");
  };
  
  const goToDashboard = () => {
    navigate("/dashboard")
  }
  

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage('Logging in...');

    try {
      const data = await login(username, password);

      if (data.token) {
        //JWT token authentication
        localStorage.setItem('token', data.token);

        setMessage(`✅ ${data.message}`);
        console.log('User data:', data.safeUser);

        setTimeout(() => {
          goToDashboard()}, 
          1500
      )
      } else {
        setMessage(`❌ ${data.error}`);
      }

    } catch (err) {
      console.error('Login error:', err);
      setMessage('❌ Server error');
    }
  }

  return (
    <div className="login-container" style={{ maxWidth: "300px", margin: "auto" }}>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>

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
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        </div>
        
        <button type="submit">Login</button>
      </form>
      <p>{message}</p> <button type="button" onClick={goToRegister}>New User?</button>
    </div>
  );
}

export default Login;
