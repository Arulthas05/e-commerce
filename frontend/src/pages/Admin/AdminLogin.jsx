import React, { useState, useContext } from 'react';
import Swal from 'sweetalert2';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const apiUrl = 'http://localhost:8000';

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    const requestData = { email, password };
  
    try {
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
  
      if (!response.ok) {
        const errorResponse = await response.json();
        const errorMessage = errorResponse?.message || 'Login failed. Please try again.';
        throw new Error(errorMessage);
      }
  
      const data = await response.json();
      const { token, user } = data;
      if (!token || !user) throw new Error('Invalid response from server.');
  
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      login(user);
  
      Swal.fire({
        icon: 'success',
        title: 'Login Successful',
        text: 'Welcome back!',
      }).then(() => {
        navigate('/admin/dashboard');
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <div className="d-flex align-items-center justify-content-center py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h4 className="card-title text-center mb-4">Login</h4>
                  <form onSubmit={handleLogin}>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">Email address</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                    <div className="d-grid">
                      <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                      </button>
                    </div>
                  </form>
                  {/* <div className="text-center mt-2">
                    <p>Don't have an account? <a href="/adnin/register">Sign up</a></p>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
