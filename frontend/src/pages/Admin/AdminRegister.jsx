import React, { useState } from 'react';
import Swal from 'sweetalert2';

function AdminRegister() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiUrl = 'http://localhost:8000';

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading state
    const requestData = { username: name, email: email, password: password };
  
    try {
      const response = await fetch(`${apiUrl}/api/auth/create-admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
  
      if (!response.ok) {
        const errorResponse = await response.json();
        const errorMessage = errorResponse?.message || 'Registration failed. Please try again.';
        throw new Error(errorMessage);
      }
  
      const data = await response.json();
      Swal.fire({
        icon: 'success',
        title: 'Registration Successful',
        text: data.message,
      }).then(() => {
        // Redirect to admin login page
        window.location.href = '/admin/login';
      });
      // Clear form fields
      setName('');
      setEmail('');
      setPassword('');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
      });
      setError(error.message); // Set error state if needed
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-center pb-5 pt-3">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h4 className="card-title text-center mb-4">Admin Sign Up</h4>
                  {error && <div className="alert alert-danger">{error}</div>} {/* Display error */}
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
                        disabled={loading} // Disable during loading
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
                        disabled={loading} // Disable during loading
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
                        disabled={loading} // Disable during loading
                      />
                    </div>
                    <div className="d-grid">
                      <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                        {loading ? 'Registering...' : 'Sign Up'}
                      </button>
                    </div>
                  </form>
                  <div className="text-center mt-3">
                    <p>Already have an account? <a href="/admin/login">Login here</a></p>
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

export default AdminRegister;
