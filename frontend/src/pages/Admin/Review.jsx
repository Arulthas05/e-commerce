import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AuthContext } from '../../context/AuthContext';

function Review() {
  const { user } = useContext(AuthContext); // Fetch the logged-in user data from AuthContext
  const [review, setReview] = useState({
    id: null,
    review_text: '',
    user_id: user?.id || '', // Ensure user_id is from the AuthContext
    rating: '',
    status: 'active'
  });

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReview((prevReview) => ({
      ...prevReview,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios({
        method: isEditing ? 'put' : 'post',
        url: `http://localhost:8000/api/reviews${isEditing ? `/${review.id}` : ''}`,
        data: review,
      });

      Swal.fire({
        icon: 'success',
        title: isEditing ? 'Review updated' : 'Review added',
        text: response.data.message,
      });

      resetForm();
      fetchReviews();

      // Close the modal
      const modalElement = document.getElementById('addReviewModal');
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

  const fetchReviews = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/reviews');
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const editReview = (review) => {
    setReview(review);
    setIsEditing(true);

    // Open the modal
    const modalElement = document.getElementById('addReviewModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  };

  const deleteReview = async (id) => {
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
          await axios.delete(`http://localhost:8000/api/reviews/${id}`);
          Swal.fire('Deleted!', 'Review has been deleted.', 'success');
          fetchReviews(); // Refresh review list after deletion
        } catch (error) {
          console.error('Error deleting review:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to delete the review.',
          });
        }
      }
    });
  };

  const resetForm = () => {
    setReview({
      id: null,
      review_text: '',
      user_id: user?.id || '',
      rating: '',
      status: 'active',
    });
    setIsEditing(false);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div>
      <div style={{ paddingTop: '70px', paddingLeft: '50px', paddingRight: '50px' }} className="main-content">
        <h2>Reviews</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        {/* <div className="mb-3">
          <button
            type="button"
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#addReviewModal"
            onClick={resetForm}
          >
            Add New Review
          </button>
        </div> */}
        <table className="table table-striped align-baseline">
          <thead>
            <tr>
              <th>ID</th>
              <th>Review</th>
              <th>User</th>
              <th>Rating</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review.id}>
                <td>{review.id}</td>
                <td>{review.review_text}</td>
                <td>{review.user_name}</td>
                <td>{review.rating}</td>
                <td>
                  <span className={`badge bg-${review.status === 'active' ? 'success' : 'secondary'}`}>
                    {review.status}
                  </span>
                </td>
                <td>
                  <button onClick={() => editReview(review)} className="btn btn-sm btn-info">Edit</button>
                  <button onClick={() => deleteReview(review.id)} className="btn btn-sm btn-danger">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Review Modal */}
      <div className="modal fade" id="addReviewModal" tabIndex="-1" aria-labelledby="addReviewModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addReviewModalLabel">{isEditing ? 'Edit Review' : 'Add New Review'}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={resetForm}></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="review_text" className="form-label">Review Text</label>
                  <input
                    type="text"
                    className="form-control"
                    id="review_text"
                    name="review_text"
                    value={review.review_text}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="rating" className="form-label">Rating</label>
                  <select
                    className="form-control"
                    id="rating"
                    name="rating"
                    value={review.rating}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>Select a rating</option>
                    <option value="1">1 Star</option>
                    <option value="2">2 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="5">5 Stars</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="status" className="form-label">Status</label>
                  <select
                    className="form-control"
                    id="status"
                    name="status"
                    value={review.status}
                    onChange={handleChange}
                    required
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Processing...' : (isEditing ? 'Update Review' : 'Add Review')}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Review;
