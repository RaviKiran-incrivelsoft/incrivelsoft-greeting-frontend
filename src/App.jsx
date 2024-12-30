import './App.css';
import { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import HomePage from './pages/HomePage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ServicePage from './pages/ServicePage';
import ContactPage from './pages/ContactPage';
import CampaignDashboard from './pages/CampaignDashboard';
import AddPost from './pages/AddPost';
import ScheduleDashboard from './pages/ScheduleDashboard';
import NotFoundPage from './pages/NotFoundPage';
import LoginModal from './components/LoginModal';
import RegisterPopup from './components/RegisterPopup';
import GreetingDashboard from './pages/GreetingsDashboard';
import CompanyPopup from './components/CompanyPopup';
import MarriageDetails from './components/MarriageDetails';
import BirthdayGreetings from './components/BirthdayGreetings';
import EventComponent from './components/EventComponent';
import FestivalGreetings from './components/FestivalGreetings';
import Template from './components/Template';
import TemplateDashboard from './pages/TemplateDashboard';

function App() {
  const [activeModal, setActiveModal] = useState(null);

  const openModal = (modal) => setActiveModal(modal);
  const closeModal = () => setActiveModal(null);

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
      <Navbar onLoginClick={() => openModal('login')} />
      {activeModal === 'login' && <LoginModal onClose={closeModal} onSwitchToRegister={() => openModal('register')} />}
      {activeModal === 'register' && <RegisterPopup onClose={closeModal} onSwitchToLogin={() => openModal('login')} />}
      <Routes>
        <Route element={<HomePage onRegisterClick={() => openModal('register')} />} path='/' />
        <Route element={<ServicePage />} path='/service' />
        <Route element={<ContactPage />} path='/contact' />
        <Route element={<CompanyPopup />} path='/company' />
        <Route element={<GreetingDashboard />} path='/greetings' />
        <Route element={<Template />} path='/template' />
        <Route element={<TemplateDashboard />} path='/templates' />
        <Route element={<MarriageDetails />} path='/marriage' />
        <Route element={<BirthdayGreetings />} path='/birthday' />
        <Route element={<EventComponent />} path='/event' />
        <Route element={<FestivalGreetings />} path='/festival' />
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
