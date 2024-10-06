import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function BlogDetails() {
  const { id } = useParams(); // Get the blog ID from the URL
  const [post, setPost] = useState(null);
  const [error, setError] = useState('');

  const fetchPost = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/posts/${id}`);
      setPost(response.data);
    } catch (error) {
      console.error('Error fetching post:', error);
      setError('Failed to fetch post. Please try again.'); // Set error message
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!post) {
    return <div>Loading...</div>;
  }

  // Format the date if needed
  const publishedDate = new Date(post.created_at).toLocaleDateString();

  return (
    <div>
        {/* Breadcrumb Section */}
        <nav aria-label="breadcrumb">
                <div className="container"> 
                    <ol className="breadcrumb py-5">
                        <li className="breadcrumb-item"><a href="/">Home</a></li>
                        <li className="breadcrumb-item active" aria-current="page">{post.title}</li>
                    </ol>
                </div>
            </nav>
        <div className="container my-5">
        <div className="row">
            <div className="col-lg-8 mx-auto">
            {/* Blog Title */}
            <h1 className="mb-3">{post.title}</h1>
            
            {/* Blog Meta Information */}
            <div className="d-flex align-items-center mb-3">
                <div>
                <small className="text-muted">Published on {publishedDate}</small>
                </div>
            </div>
            
            {/* Blog Image */}
            <div className="mb-4">
                <img src={post.image_url || 'https://via.placeholder.com/800x400'} className="img-fluid rounded" alt="Blog Post" />
            </div>
            
            {/* Blog Content */}
            <div className="blog-content">
                <p>{post.content}</p>
            </div>
            </div>
        </div>
        </div> 
    </div>
    
  );
}

export default BlogDetails;
