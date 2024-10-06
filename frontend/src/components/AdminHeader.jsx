import React, { useContext } from 'react';
// import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import '../components/AdminHeader.css';
import { AuthContext } from '../context/AuthContext';

function AdminHeader() {
  const { user, logout } = useContext(AuthContext);
  return (
    <div>

      {/* Top Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div className="container-fluid">
          {/* Left Side Logo */}
          <Link className="navbar-brand" to="/">
            {/* <img src="https://via.placeholder.com/100x40" alt="Logo" height="40" /> */}
            <Link className="navbar-brand" to="/">Carspare</Link>
          </Link>

          {/* Right Side Admin Profile */}
          <div className="ms-auto">
            <ul className="navbar-nav">
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle profile-dropdown" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  {/* <img src="https://via.placeholder.com/40" alt="Profile Image" className="profile-img" /> */}
                  <i className="bi bi-person-circle"></i> 
                  <span>{user ? ` ${user.username}` : ' Login'}</span>
                </a>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                {user ? (
                    <>
                      {/* <li><Link className="dropdown-item" to="/account">My Account</Link></li> */}
                      {/* <li><Link className="dropdown-item" to="/orders">Orders</Link></li> */}
                      <li><a className="dropdown-item" href="#" onClick={() => logout()}>Logout</a></li>
                    </>
                  ) : (
                    <li><Link className="dropdown-item" to="/user/login">Login</Link></li>
                  )}
                  {/* <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
                  <li><Link className="dropdown-item" to="/settings">Settings</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><Link className="dropdown-item" to="/logout">Logout</Link></li> */}
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <div className="sidebar">
        <Link to="/admin/dashboard">Dashboard</Link>
        <Link to="/admin/add-product">Products</Link>
        <Link to="/admin/orders">Orders</Link>
        <Link to="/admin/blog">Blogs</Link>
        <Link to="/admin/review">Reviews</Link>
      </div>

    </div>
  );
}

export default AdminHeader;
