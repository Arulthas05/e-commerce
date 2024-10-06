import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const API_BASE_URL = 'http://localhost:8000/api/auth'; // Base URL for API calls

function User() {
  const [user, setUser] = useState({
    id: null,
    username: '',
    email: '',
    password: '',
    role: 'user'
  });

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios({
        headers: {
        Authorization: `Bearer ${token}`,
      },
        method: isEditing ? 'put' : 'post',
        url: `${API_BASE_URL}/register${isEditing ? `/${user.id}` : ''}`,
        data: user,
      });

      Swal.fire({
        icon: 'success',
        title: isEditing ? 'User updated' : 'User added',
        text: response.data.message,
      });

      resetForm();
      fetchUsers();

      const modalElement = document.getElementById('addUserModal');
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal.hide();
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data.error || 'Network error, please try again',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setFetching(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/users`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users. Please try again.');
    } finally {
      setFetching(false);
    }
  };

  const editUser = (user) => {
    setUser(user);
    setIsEditing(true);

    const modalElement = document.getElementById('addUserModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  };

  const deleteUser = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_BASE_URL}/users/${id}`);
          Swal.fire('Deleted!', 'User has been deleted.', 'success');
          fetchUsers();
        } catch (error) {
          console.error('Error deleting user:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to delete the user.',
          });
        }
      }
    });
  };

  const resetForm = () => {
    setUser({
      id: null,
      username: '',
      email: '',
      password: '',
      role: 'user'
    });
    setIsEditing(false);
    setError('');
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <div style={{ paddingTop: '100px', paddingLeft: '50px', paddingRight: '50px' }} className="main-content">
        <h2>Users</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="mb-3">
          <button
            type="button"
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#addUserModal"
            onClick={resetForm}
          >
            Add New User
          </button>
        </div>
        {fetching ? (
          <div>Loading users...</div>
        ) : (
          <table className="table table-striped align-baseline">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`badge bg-${user.role === 'user' ? 'success' : 'secondary'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => editUser(user)} className="btn btn-sm btn-info">
                      Edit
                    </button>
                    <button onClick={() => deleteUser(user.id)} className="btn btn-sm btn-danger">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add User Modal */}
      <div className="modal fade" id="addUserModal" tabIndex="-1" aria-labelledby="addUserModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addUserModalLabel">{isEditing ? 'Edit User' : 'Add New User'}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={resetForm}></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="userName" className="form-label">User Title</label>
                  <input
                    type="text"
                    className="form-control"
                    id="userName"
                    name="username"
                    value={user.username}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="userEmail" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="userEmail"
                    name="email"
                    value={user.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="userPassword" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="userPassword"
                    name="password"
                    value={user.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="userStatus" className="form-label">Status</label>
                  <select
                    className="form-control"
                    id="userStatus"
                    name="role"
                    value={user.role}
                    onChange={handleChange}
                    required
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={resetForm}>Close</button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Loading...' : 'Save User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default User;
