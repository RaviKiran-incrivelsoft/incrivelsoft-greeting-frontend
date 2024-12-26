import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import HomePage from './pages/HomePage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ServicePage from './pages/ServicePage';
import ContactPage from './pages/ContactPage';
import CampaignDashboard from './pages/CampaignDashboard';
import AddPost from './pages/AddPost';
import ScheduleDashboard from './pages/ScheduleDashboard';
import { jwtDecode } from 'jwt-decode';
import { ToastContainer } from 'react-toastify';
import NotFoundPage from './pages/NotFoundPage';

function App() {

  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem('token');
        return false;
      }
      return true;
    } catch (error) {
      localStorage.removeItem('token');
      return false;
    }
  };

  const ProtectedRoute = ({ element }) => {
    return isAuthenticated() ? element : <Navigate to="/" replace />;
  };

  return (
    <BrowserRouter>
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route element={<HomePage />} path='/' />
        <Route element={<ServicePage />} path='/service' />
        <Route element={<ContactPage />} path='/contact' />
        <Route element={<ProtectedRoute element={<CampaignDashboard />} />} path='/campaign' />
        <Route element={<ProtectedRoute element={<ScheduleDashboard />} />} path='/schedule' />
        <Route element={<ProtectedRoute element={<AddPost />} />} path='/addpost' />
        <Route element={<NotFoundPage />} path="*" />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
