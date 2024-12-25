import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import HomePage from './pages/HomePage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ServicePage from './pages/ServicePage';
import ContactPage from './pages/ContactPage';
import CampaignDashboard from './pages/CampaignDashboard';
import AddPost from './pages/AddPost';

function App() {

  const isAuthenticated = () => {
    return !!localStorage.getItem('token');
  };

  const ProtectedRoute = ({ element }) => {
    return isAuthenticated() ? element : <Navigate to="/" replace />;
  };

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route element={<HomePage />} path='/' />
        <Route element={<ServicePage />} path='/service' />
        <Route element={<ContactPage />} path='/contact' />
        <Route element={<ProtectedRoute element={<CampaignDashboard />} />} path='/campaign' />
        <Route element={<ProtectedRoute element={<AddPost />} />} path='/addpost' />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
