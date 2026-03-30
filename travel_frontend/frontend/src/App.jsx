import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';

// Global Components
import Navbar from './components/global/Navbar.jsx';

// 🔥 FIXED: Customer Pages (Pointing to the right folder!)
import Home from './pages/customer/Home.jsx'; 
import Login from './pages/auth/Login.jsx'; 
import Register from './pages/auth/Register.jsx';
import Checkout from './pages/customer/Checkout.jsx';
import UserBookings from './pages/customer/UserBookings.jsx';
import Community from './pages/customer/Community.jsx';
import MyAccount from './pages/customer/MyAccount.jsx';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AddDestination from './pages/admin/AddDestination.jsx';
import AddHotel from './pages/admin/AddHotel.jsx'; 
import AddRestaurant from './pages/admin/AddRestaurant.jsx';

const CustomerLayout = () => {
  return (
    <>
      <Navbar />
      <div className="pt-24"> 
        <Outlet /> 
      </div>
    </>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        
        {/* ==========================================
            ADMIN ROUTES (No Navbar, clean layout)
        ========================================== */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/add-destination" element={<AddDestination />} />
        <Route path="/admin/add-hotel" element={<AddHotel />} />
        <Route path="/admin/add-restaurant" element={<AddRestaurant />} />

        {/* ==========================================
            CUSTOMER ROUTES (Wrapped in CustomerLayout)
        ========================================== */}
        <Route element={<CustomerLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} /> 
          <Route path="/register" element={<Register />} /> 
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/my-trips" element={<UserBookings />} /> 
          <Route path="/community" element={<Community />} />
          <Route path="/account" element={<MyAccount />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;