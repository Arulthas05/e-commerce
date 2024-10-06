import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import car1 from "../assets/slider/car1.jpg";
import car2 from "../assets/slider/car2.jpg";
import car3 from "../assets/slider/car3.jpg";
import axios from 'axios';
import Swal from 'sweetalert2';

import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

function Home() {

    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [review, setReview] = useState({
        id: null,
        review_text: '',
        user_id: '', // Initially empty
        rating: '',
        status: 'active',
    });
    
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToCart } = useContext(CartContext);

    const [posts, setPosts] = useState([]);
    const [fetching, setFetching] = useState(false);

    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user && user.id) {
            setReview(prevReview => ({
                ...prevReview,
                user_id: user.id
            }));
        }
    }, [user]);

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setReview((prevReview) => ({
          ...prevReview,
          [name]: value,
        }));
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Check if the user is logged in
        // if (!user || !user.id) {
        //     Swal.fire({
        //         icon: 'error',
        //         title: 'Error',
        //         text: 'Please login to submit a review.',
        //     });
        //     return; // Stop the function from continuing
        // }

        if (!user || !user.id) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please login to submit a review.',
            }).then(() => {
                navigate('/user/login'); 
            });
            return;
        }
    
        setLoading(true);
        setError('');
    
        try {
            const response = await axios({
                method: 'post',
                url: `http://localhost:8000/api/reviews`,
                data: review,
            });
    
            Swal.fire({
                icon: 'success',
                title: 'Review added',
                text: response.data.message,
            });
    
            resetForm();
            fetchReviews();
    
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

      const resetForm = () => {
        setReview({
          id: null,
          review_text: '',
          user_id: user?.id || '',
          rating: '',
          status: 'active',
        });
      };

    // Fetch products from the backend using Axios
    useEffect(() => {
        axios.get('http://localhost:8000/api/products')
            .then((response) => {
                setProducts(response.data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching products:', error);
                setError(error);
                setIsLoading(false);
            });

        fetchPosts();

        fetchReviews();
    }, []);

    // useEffect(() => {
    //     // Fetch reviews from the backend
    //     axios.get('http://localhost:8000/api/reviews')
    //       .then(response => {
    //         console.log(response.data); // Log the data to ensure it's being fetched
    //         setReviews(response.data);
    //       })
    //       .catch(error => {
    //         console.error('Error fetching reviews:', error);
    //       });
    //   }, []);


    return (
        <div>

            {/* Image Slider */}
            <div id="homeCarousel" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-indicators">
                    <button type="button" data-bs-target="#homeCarousel" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                    <button type="button" data-bs-target="#homeCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
                    <button type="button" data-bs-target="#homeCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
                </div>
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <img src={car1} className="d-block w-100" alt="Slide 1" />
                    </div>
                    <div className="carousel-item">
                        <img src={car2} className="d-block w-100" alt="Slide 2" />
                    </div>
                    <div className="carousel-item">
                        <img src={car3} className="d-block w-100" alt="Slide 3" />
                    </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#homeCarousel" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#homeCarousel" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>

            {/* Featured Products Section */}
            <section className="py-5">
                <div className="container">
                    <h2 className="text-center mb-5">Featured Products</h2>
                    <div className="row">
                        {isLoading && <p>Loading products...</p>}
                        {error && <p>Error fetching products: {error.message}</p>}
                        {!isLoading && !error && (
                            products.slice(0, 4).map((product) => (
                                <div className="col-md-3" key={product.id}>
                                    <div className="card">
                                        <img src={product.image_url} className="card-img-top" alt={product.name} />
                                        <div className="card-body">
                                            <h5 className="card-title">{product.name}</h5>
                                            <p className="card-text">LKR {product.price}</p>
                                            <button onClick={() => addToCart(product)} className="btn btn-primary">Add to Cart</button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* Latest Blog Section */}
            <section className="py-5 bg-light">
                <div className="container">
                    <h2 className="text-center mb-5">Latest Blog</h2>
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

            {/* Customer Reviews Section */}
            <section className="py-5">
                <div className="container">
                    <h2 className="text-center mb-5">Customer Reviews</h2>
                    <div className="row">
                        {reviews.length === 0 ? (
                            <p className="text-center">No reviews yet. Be the first to leave a review!</p>
                        ) : (
                            reviews.map((review) => (
                                <div className="col-md-4 mb-4" key={review.id}>
                                    <div className="card">
                                        <div className="card-body">
                                            {/* Display the reviewer's name dynamically */}
                                            <h5 className="card-title">{review.user_name || 'Anonymous'}</h5>
                                            
                                            {/* Review text */}
                                            <p className="card-text">{review.review_text}</p>

                                            {/* Display dynamic rating */}
                                            <div className="text-warning">
                                                {[...Array(5)].map((_, i) => (
                                                    <i
                                                        key={i}
                                                        className={`bi ${i < review.rating ? 'bi-star-fill' : 'bi-star'}`}
                                                    ></i>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>



            {/* Customer Review Form */}
            <section className="py-5 bg-light">

                <div className="d-flex align-items-center justify-content-center">
                    <div className="container">
                        <div className="row justify-content-center">
                            <h2 className="card-title text-center mb-4">Submit Your Review</h2>
                            <div className="col-md-6">
                                <div className="card shadow-sm">
                                    <div className="card-body">

                                        <form onSubmit={handleSubmit}>

                                            <div className="mb-3">
                                                <label htmlFor="reviewText" className="form-label">Your Review</label>
                                                <textarea className="form-control" name="review_text" value={review.review_text} onChange={handleChange} rows="4" required></textarea>
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
                                            <button type="submit" className="btn btn-primary" disabled={loading || !review.rating}>{loading ? 'Processing...' : 'Submit Review'}</button>
                                            </form>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </section>


        </div>
    )
}

export default Home
