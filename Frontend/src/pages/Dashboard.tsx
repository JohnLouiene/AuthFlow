import { useNavigate } from 'react-router-dom';
import '../App.css';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const token = localStorage.getItem('token');
  
  useEffect(() => {
    fetch("http://localhost:3000/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 401 || res.status === 403){
          throw new Error("Unauthorized");
        }
        return res.json();
      })
      .then((data) => setData(data))
      .catch((err) => {
        console.error(err);
        window.location.href = "/"; //fallback redirect
      });
  }, [token]
  );

  if (!data) return <p>Loading...</p>

  const handleLogout = () => {
    // Optionally clear any auth state here
    localStorage.removeItem('token');
    navigate('/'); // send user back to login
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', textAlign: 'center' }}>
      <h1>Welcome to Your Dashboard</h1>
      <p>This is a placeholder dashboard page after login.</p>

      <button 
        style={{ padding: '10px 20px', marginTop: '20px', cursor: 'pointer' }}
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
}
