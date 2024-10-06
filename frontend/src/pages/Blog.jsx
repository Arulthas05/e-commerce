import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Blog() {
    const [posts, setPosts] = useState([]);
    const [fetching, setFetching] = useState(false);
    const [error, setError] = useState('');

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

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <div>
            {/* Breadcrumb Section */}
            <nav aria-label="breadcrumb">
                <div className="container"> 
                    <ol className="breadcrumb py-5">
                        <li className="breadcrumb-item"><a href="/">Home</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Blog</li>
                    </ol>
                </div>
            </nav>

            {/* Latest Blog Section */}
            <section className="py-5">
                <div className="container">
                    <h2 className="text-center mb-5">Blogs</h2>
                    {fetching && <div>Loading posts...</div>}
                    {error && <div className="alert alert-danger">{error}</div>}
                    <div className="row">
                        {posts.map((prod) => (
                            <div key={prod.id} className="col-md-4 mb-4">
                                <div className="card">
                                    <img src={prod.image_url || 'https://via.placeholder.com/300x200'} className="card-img-top" alt="Blog Post" />
                                    <div className="card-body">
                                        <h5 className="card-title">{prod.title}</h5>
                                        <p className="card-text">{prod.content}</p>
                                        <a href={`/blog/${prod.id}`} className="btn btn-primary">Read More</a> {/* Navigate to blog post detail */}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Blog;
