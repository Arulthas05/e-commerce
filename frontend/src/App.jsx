import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './pages/Admin/Dashboard';
import AdminHeader from './components/AdminHeader';
import AddProduct from './pages/Admin/AddProduct';
import Order from './pages/Admin/order';
import { Outlet } from 'react-router-dom';
import Shop from './pages/Shop';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

import Card from './pages/Card';
import Login from './pages/Auth/login';
import Register from './pages/Auth/Register';
import Blog from './pages/Blog';
import AdminBlog from './pages/Admin/Blog';
import Review from './pages/Admin/Review';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminRegister from './pages/Admin/AdminRegister';
import PrivateRoute from './components/PrivateRoute';
import User from './pages/Admin/User';
import Notfound from './pages/Notfound';
import BlogDetails from './pages/BlogDetails';




function AdminLayout() {
  return (
    <>
      <AdminHeader />
      <Outlet />
    </>
  );
}

function App() {
  const location = useLocation();

  // Check if the current route starts with "/admin"
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      
      {!isAdminRoute && <Header />}
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/Blog" element={<Blog />} />
        <Route path="/cart" element={<Card />} />
        <Route path="/user/login" element={<Login />} />
        <Route path="/user/register" element={<Register />} />
        <Route path="*" element={<Notfound />} />
        <Route path="/blog/:id" element={<BlogDetails />} />
        
         {/* Admin Routes */}
         <Route path="/admin" element={<AdminLayout />}>
          <Route element={<PrivateRoute adminOnly />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="add-product" element={<AddProduct />} />
            <Route path="orders" element={<Order />} />
            <Route path="blog" element={<AdminBlog />} />
            <Route path="review" element={<Review />} />
            <Route path="user" element={<User />} />
          </Route>
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />
       
      </Routes>
      
      {/* Conditionally render Footer - Hide on admin routes */}
      {!isAdminRoute && <Footer />}
    </>
  );
}

const AppWithRouter = () => (
  <AuthProvider>
    <CartProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </CartProvider>
  </AuthProvider>
);

export default AppWithRouter;
