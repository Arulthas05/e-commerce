import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext'; // Adjust the path as necessary
import { AuthContext } from '../context/AuthContext'; // Import AuthContext

import '../components/Header.css';
import { Link } from 'react-router-dom';

function Header() {
  const { cartCount } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div className="container">
          <Link className="navbar-brand" to="/">Carspare</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link active" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" to="/shop">Shop</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" to="/blog">Blog</Link>
              </li>
              <li className="nav-item">
                <Link to="/cart" className="nav-link position-relative" style={{ padding: '0' }}>
                  <button
                    type="button"
                    style={{
                      backgroundColor: 'transparent',
                      color: 'white',
                      lineHeight: '0',
                      fontFamily: 'none',
                      boxShadow: 'none',
                      border: 'none',
                      marginTop: '12px',
                      marginBottom: '12px',
                    }}
                    className="position-relative"
                  >
                    <i className="bi bi-cart-fill"></i>
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {cartCount}
                      <span className="visually-hidden">items in cart</span>
                    </span>
                  </button>
                </Link>
              </li>

              {/* User Account */}
              {/* <li className="nav-item dropdown">
                <a
                  className="nav-link active dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-person-circle"></i> Account
                </a>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                  <li><Link className="dropdown-item" to="/account">My Account</Link></li>
                  <li><Link className="dropdown-item" to="/orders">Orders</Link></li>
                  <li><Link className="dropdown-item" to="/logout">Logout</Link></li>
                </ul>
              </li> */}
              {/* User Account */}
              <li className="nav-item dropdown">
                <a
                  className="nav-link active dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-person-circle"></i> 
                  {user ? ` ${user.username}` : ' Login'}
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
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Header;
