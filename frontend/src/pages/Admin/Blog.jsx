import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function Blog() {
  const [post, setPost] = useState({
    id: null,
    title: '',
    content: '',
    image_url: '',
    status: 'active'
  });

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost((prevPost) => ({
      ...prevPost,
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
        url: `http://localhost:8000/api/posts${isEditing ? `/${post.id}` : ''}`,
        data: post,
      });

      Swal.fire({
        icon: 'success',
        title: isEditing ? 'Post updated' : 'Post added',
        text: response.data.message,
      });

      resetForm();
      fetchPosts();

      const modalElement = document.getElementById('addPostModal');
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

  const fetchPosts = async () => {
    setFetching(true); // Start loading
    try {
      const response = await axios.get('http://localhost:8000/api/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to fetch posts. Please try again.'); // Set error message
    } finally {
      setFetching(false); // End loading
    }
  };

  const editPost = (post) => {
    setPost(post);
    setIsEditing(true);

    const modalElement = document.getElementById('addPostModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  };

  const deletePost = async (id) => {
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
          await axios.delete(`http://localhost:8000/api/posts/${id}`);
          Swal.fire('Deleted!', 'Post has been deleted.', 'success');
          fetchPosts();
        } catch (error) {
          console.error('Error deleting post:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to delete the post.',
          });
        }
      }
    });
  };

  const resetForm = () => {
    setPost({
      id: null,
      title: '',
      content: '',
      image_url: '',
      status: 'active'
    });
    setIsEditing(false);
    setError(''); // Clear error on reset
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div>
      <div style={{ paddingTop: '70px', paddingLeft: '50px', paddingRight: '50px' }} className="main-content">
        <h2>Posts</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="mb-3">
          <button
            type="button"
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#addPostModal"
            onClick={resetForm}
          >
            Add New Post
          </button>
        </div>
        {fetching ? ( // Show loading state while fetching
          <div>Loading posts...</div>
        ) : (
          <table className="table table-striped align-baseline">
            <thead>
              <tr>
                <th>ID</th>
                <th>Image</th>
                <th>Post Title</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((prod) => (
                <tr key={prod.id}>
                  <td>{prod.id}</td>
                  <td><img style={{ height: '50px', width: '50px' }} className="rounded" src={prod.image_url || 'https://via.placeholder.com/50'} alt="Post" /></td>
                  <td>{prod.title}</td>
                  <td>{prod.content}</td>
                  <td><span className={`badge bg-${prod.status === 'active' ? 'success' : 'secondary'}`}>{prod.status}</span></td>
                  <td>
                    <button onClick={() => editPost(prod)} className="btn btn-sm btn-info">Edit</button>
                    <button onClick={() => deletePost(prod.id)} className="btn btn-sm btn-danger">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Post Modal */}
      <div className="modal fade" id="addPostModal" tabIndex="-1" aria-labelledby="addPostModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addPostModalLabel">{isEditing ? 'Edit Post' : 'Add New Post'}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={resetForm}></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="postName" className="form-label">Post Title</label>
                  <input
                    type="text"
                    className="form-control"
                    id="postName"
                    name="title"
                    value={post.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="postDescription" className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    id="postDescription"
                    name="content"
                    rows="3"
                    value={post.content}
                    onChange={handleChange}
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label htmlFor="postImage" className="form-label">Image URL</label>
                  <input
                    type="text"
                    className="form-control"
                    id="postImage"
                    name="image_url"
                    value={post.image_url}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="postStatus" className="form-label">Status</label>
                  <select
                    className="form-control"
                    id="postStatus"
                    name="status"
                    value={post.status}
                    onChange={handleChange}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Processing...' : (isEditing ? 'Update Post' : 'Add Post')}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Blog;
