import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';

// Global Components
import Navbar from './components/global/Navbar.jsx';

import Home from './pages/customer/Home.jsx'; 
import Login from './pages/auth/Login.jsx'; 
import Register from './pages/auth/Register.jsx';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AddDestination from './pages/admin/destinations/AddDestination.jsx';
import DestinationView from './pages/admin/destinations/DestinationView';
import DestinationEdit from './pages/admin/destinations/DestinationEdit';
import AddHotel from './pages/admin/hotels/AddHotel';
import EditHotel from './pages/admin/hotels/EditHotel';
import AddRestaurant from './pages/admin/restaurants/AddRestaurant';
import EditRestaurant from './pages/admin/restaurants/EditRestaurant';
import HotelView from './pages/admin/hotels/HotelView';
import RestaurantView from './pages/admin/restaurants/RestaurantView';

// User pages
import Checkout from './pages/customer/hotels/Checkout.jsx';
import Community from './pages/customer/Community.jsx';
import MyAccount from './pages/customer/MyAccount.jsx';
import MyTrips from './pages/customer/MyTrips';
import HotelDetails from './pages/customer/hotels/HotelDetails';
import RestaurantDetails from './pages/customer/restaurants/RestaurantDetails';

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
        <Route path="/admin/destinations/:id" element={<DestinationView />} />
        <Route path="/admin/edit-destination/:id" element={<DestinationEdit />} />
        <Route path="/admin/add-hotel" element={<AddHotel />} />
        <Route path="/admin/add-restaurant" element={<AddRestaurant />} />
        <Route path="/admin/edit-hotel/:id" element={<EditHotel />} />
        <Route path="/admin/edit-restaurant/:id" element={<EditRestaurant />} />
        <Route path="/admin/hotels/:id" element={<HotelView />} />
        <Route path="/admin/restaurants/:id" element={<RestaurantView />} />

        {/* ==========================================
            CUSTOMER ROUTES (Wrapped in CustomerLayout)
        ========================================== */}
        <Route element={<CustomerLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} /> 
          <Route path="/register" element={<Register />} /> 
          <Route path="/checkout/hotel/:id" element={<Checkout />} />
          <Route path="/community" element={<Community />} />
          <Route path="/account" element={<MyAccount />} />
          <Route path="/my-trips" element={<MyTrips />} />
          <Route path="/hotel/:id" element={<HotelDetails />} />
          <Route path="/restaurant/:id" element={<RestaurantDetails />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;