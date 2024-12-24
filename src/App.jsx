import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from './pages/HomePage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ServicePage from './pages/ServicePage';
import ContactPage from './pages/ContactPage';
import CampaignDashboard from './pages/CampaignDashboard';
import AddPost from './pages/AddPost';
import { useState } from 'react';
import LoginModal from './components/LoginModal';
import RegisterPopup from './components/RegisterPopup';

function App() {
  const [activeModal, setActiveModal] = useState(null);

  const openModal = (modal) => setActiveModal(modal);
  const closeModal = () => setActiveModal(null);

  return (
    <BrowserRouter>
      <Navbar onLoginClick={() => openModal('login')} />
      {activeModal === 'login' && <LoginModal onClose={closeModal} onSwitchToRegister={() => openModal('register')} />}
      {activeModal === 'register' && <RegisterPopup onClose={closeModal} onSwitchToLogin={() => openModal('login')} />}
      <Routes>
        <Route element={<HomePage  onRegisterClick={() => openModal('register')} />} path='/' />
        <Route element={<ServicePage />} path='/service' />
        <Route element={<ContactPage />} path='/contact' />
        <Route element={<CampaignDashboard />} path='/campaign' />
        <Route element={<AddPost />} path='/addpost' />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
