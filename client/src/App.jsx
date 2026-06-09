import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import WhyExchange from './pages/WhyExchange';
import Browse from './pages/Browse';
import DonateBook from './pages/DonateBook';
import Profile from './pages/Profile';
import MyDonations from './pages/MyDonations';
import MyOrders from './pages/MyOrders';
import './App.css';

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/why-exchange" element={<WhyExchange />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/donate" element={
            <ProtectedRoute><DonateBook /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><Profile /></ProtectedRoute>
          } />
          <Route path="/my-donations" element={
            <ProtectedRoute><MyDonations /></ProtectedRoute>
          } />
          <Route path="/my-orders" element={
            <ProtectedRoute><MyOrders /></ProtectedRoute>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
