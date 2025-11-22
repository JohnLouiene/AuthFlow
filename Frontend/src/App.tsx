import {Route, Routes, Outlet} from 'react-router-dom';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import Dashboard from './pages/Dashboard.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx'

function App() {
  return (
    // Navigation of each page in the App
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/register' element={<Register />} />
      
      <Route element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
      <Route path='/dashboard' element={<Dashboard/>} />
      </Route>
    </Routes>
  );
};

export default App;