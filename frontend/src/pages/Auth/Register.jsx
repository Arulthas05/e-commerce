import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const apiUrl = 'http://localhost:8000';

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      return Swal.fire({
        title: 'Error!',
        text: 'Password must be at least 8 characters long.',
        icon: 'error',
        confirmButtonText: 'Try Again',
      });
    }

    setLoading(true);

    try {
      const response = await axios.post(`${apiUrl}/api/auth/register`, {
        username: name, 
        email,
        password,
      });

      Swal.fire({
        title: 'Success!',
        text: 'Registration successful! You can now log in.',
        icon: 'success',
        confirmButtonText: 'OK',
      });

      setName('');
      setEmail('');
      setPassword('');

      window.location.href = '/user/login';
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Something went wrong. Please try again later.';
      Swal.fire({
        title: 'Error!',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'Try Again',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <nav aria-label="breadcrumb">
        <div className="container">
          <ol className="breadcrumb pt-5 pb-2">
            <li className="breadcrumb-item"><a href="/">Home</a></li>
            <li className="breadcrumb-item active" aria-current="page">Register</li>
          </ol>
        </div>
      </nav>
      <div className="d-flex align-items-center justify-content-center pb-5 pt-3">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h4 className="card-title text-center mb-4">Sign Up</h4>
                  <form onSubmit={handleRegister}>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
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
                        {loading ? 'Signing up...' : 'Sign Up'}
                      </button>
                    </div>
                  </form>
                  <div className="text-center mt-3">
                    <p>Already have an account? <a href="/user/login">Login here</a></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
