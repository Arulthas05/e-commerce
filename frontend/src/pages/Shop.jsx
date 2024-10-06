import { CartContext } from '../context/CartContext';
import axios from 'axios';
import React, { useState, useEffect,useContext} from 'react'


function Shop() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const {addToCart } = useContext(CartContext);

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
    }, []);
  const showProductDetails = false;
  return (
    <div>
    {/*  */}

    {/* Breadcrumb Section */}
    <nav aria-label="breadcrumb">
        <div className="container"> 
            <ol className="breadcrumb py-5">
                <li className="breadcrumb-item"><a href="/">Blog</a></li>
                <li className="breadcrumb-item active" aria-current="page">Shop</li>
            </ol>
        </div>
    </nav>

{/* Product Details Section */}
    {showProductDetails && (
    <section className="py-5">
        <div className="container">
            <div className="row">
                {/* Product Image Gallery */}
                <div className="col-md-6">
                    <div id="productCarousel" className="carousel slide" data-bs-ride="carousel">
                        <div className="carousel-inner">
                            <div className="carousel-item active">
                                <img src="https://via.placeholder.com/500x500" className="d-block w-100" alt="Product Image 1"/>
                            </div>
                            <div className="carousel-item">
                                <img src="https://via.placeholder.com/500x500" className="d-block w-100" alt="Product Image 2"/>
                            </div>
                            <div className="carousel-item">
                                <img src="https://via.placeholder.com/500x500" className="d-block w-100" alt="Product Image 3"/>
                            </div>
                        </div>
                        <button className="carousel-control-prev" type="button" data-bs-target="#productCarousel" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#productCarousel" data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                        </button>
                    </div>
                </div>

                {/* Product Information */}
                <div className="col-md-6">
                    <h2>Product Name</h2>
                    <p className="text-muted">Category: Electronics</p>
                    <h4 className="text-danger">$199.99</h4>
                    <p>Availability: <span className="text-success">In Stock</span></p>
                    <p><strong>Short Description:</strong> This is a brief description of the product highlighting key features and benefits.</p>
                    <div className="mb-3">
                        <label for="quantity" className="form-label">Quantity:</label>
                        <input type="number" id="quantity" className="form-control w-25" value="1"/>
                    </div>
                    <button className="btn btn-primary btn-lg mb-3">Add to Cart</button>
                    <button className="btn btn-secondary btn-lg">Buy Now</button>
                </div>
            </div>

            {/* Product Description and Reviews Tabs */}
            <div className="row mt-5">
                <div className="col-md-12">
                    <ul className="nav nav-tabs" id="productTab" role="tablist">
                        <li className="nav-item" role="presentation">
                            <button className="nav-link active" id="description-tab" data-bs-toggle="tab" data-bs-target="#description" type="button" role="tab" aria-controls="description" aria-selected="true">Description</button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button className="nav-link" id="reviews-tab" data-bs-toggle="tab" data-bs-target="#reviews" type="button" role="tab" aria-controls="reviews" aria-selected="false">Reviews (3)</button>
                        </li>
                    </ul>
                    <div className="tab-content" id="productTabContent">
                        <div className="tab-pane fade show active" id="description" role="tabpanel" aria-labelledby="description-tab">
                            <p className="mt-3">This is a detailed description of the product. It includes information about the materials, design, functionality, and any special features. Customers can read more about the product specifications and usage here.</p>
                        </div>
                        <div className="tab-pane fade" id="reviews" role="tabpanel" aria-labelledby="reviews-tab">
                            <div className="mt-3">
                                <div className="d-flex align-items-center mb-3">
                                    <h6 className="mb-0">John Doe</h6>
                                    <span className="text-warning ms-2">
                                        <i className="bi bi-star-fill"></i>
                                        <i className="bi bi-star-fill"></i>
                                        <i className="bi bi-star-fill"></i>
                                        <i className="bi bi-star-fill"></i>
                                        <i className="bi bi-star"></i>
                                    </span>
                                </div>
                                <p>"Great product! Highly recommend. The build quality is excellent and it works as described."</p>
                            </div>
                            <div className="d-flex align-items-center mb-3">
                                <h6 className="mb-0">Jane Smith</h6>
                                <span className="text-warning ms-2">
                                    <i className="bi bi-star-fill"></i>
                                    <i className="bi bi-star-fill"></i>
                                    <i className="bi bi-star-fill"></i>
                                    <i className="bi bi-star"></i>
                                    <i className="bi bi-star"></i>
                                </span>
                            </div>
                            <p>"The product is good but the delivery took longer than expected."</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  )}
    {/* Related Products Section */}
    <section style={{ padding: '0rem 0' }} className='pt-1 pb-5' >
        <div className="container">
            <h2 className="text-center mb-5">Products</h2>
            <div className="row">
            {isLoading && <p>Loading products...</p>}
                        {error && <p>Error fetching products: {error.message}</p>}
                        {!isLoading && !error && (
                            products.map((product) => (
                <div className="col-md-3 pb-2" key={product.id}>
                    <div className="card">
                        <img src={product.image_url} className="card-img-top" alt="{product.name}"/>
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
      
    </div>
  )
}

export default Shop
