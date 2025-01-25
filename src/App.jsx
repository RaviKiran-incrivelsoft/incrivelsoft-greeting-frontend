import './App.css';
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from './pages/HomePage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ServicePage from './pages/ServicePage';
import ContactPage from './pages/ContactPage';
import AddPost from './pages/AddPost';
import ScheduleDashboard from './pages/ScheduleDashboard';
import NotFoundPage from './pages/NotFoundPage';
import LoginModal from './components/LoginModal';
import RegisterPopup from './components/RegisterPopup';
import TemplateDashboard from './pages/TemplateDashboard';
import GreetingDashboard from './pages/GreetingsDashboard';
import ProtectedRoute from './ProtectedRoute';
import DashboardAnalytics from './pages/DashboardAnalytics';
import UserTicketingList from './pages/UserTicketingList';
import SupportForm from './components/SupportForm';
import AdminDashboard from './pages/AdminDashboard';
import EmailConfigPopup from './components/EmailConfigPopup';

function App() {
  const [activeModal, setActiveModal] = useState(null);

  const openModal = (modal) => setActiveModal(modal);
  const closeModal = () => setActiveModal(null);

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
        <Route element={<SupportForm />} path='/form' />
        <Route element={<EmailConfigPopup />} path='/settings' />
        <Route element={<ProtectedRoute element={<GreetingDashboard />} />} path='/greetings' />
        <Route element={<ProtectedRoute element={<TemplateDashboard />} />} path='/templates' />
        <Route element={<ProtectedRoute element={<DashboardAnalytics />} />} path='/analytics' />
        <Route element={<ProtectedRoute element={<ScheduleDashboard />} />} path='/schedule' />
        <Route element={<ProtectedRoute element={<UserTicketingList />} />} path='/support' />
        <Route element={<AdminDashboard />} path='/admin/dashboard' />
        <Route element={<ProtectedRoute element={<AddPost />} />} path='/addpost' />
        <Route element={<NotFoundPage />} path="*" />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
