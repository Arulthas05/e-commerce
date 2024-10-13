import { CartContext } from '../context/CartContext';
import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';

function Shop() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState(''); // Search term state
    const { addToCart } = useContext(CartContext);

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

    // Filter products based on search term
    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            {/* Breadcrumb Section */}
            <nav aria-label="breadcrumb">
                <div className="container">
                    <ol className="breadcrumb py-5">
                        <li className="breadcrumb-item"><a href="/">Blog</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Shop</li>
                    </ol>
                </div>
            </nav>

            {/* Search Section */}
            <div className="container my-2">
                <form className="d-flex" onSubmit={(e) => e.preventDefault()}>
                    <input
                        className="form-control me-2"
                        type="search"
                        placeholder="Search for products..."
                        aria-label="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="btn btn-outline-primary" type="submit">Search</button>
                </form>
            </div>

            {/* Related Products Section */}
            <section style={{ padding: '0rem 0' }} className='pt-1 pb-5'>
                <div className="container">
                    <h2 className="text-center mb-5">Products</h2>
                    <div className="row">
                        {isLoading && <p>Loading products...</p>}
                        {error && <p>Error fetching products: {error.message}</p>}
                        {!isLoading && !error && filteredProducts.length === 0 && (
                            <p>No products found.</p>
                        )}
                        {!isLoading && !error && (
                            filteredProducts.map((product) => (
                                <div className="col-md-3 pb-2" key={product.id}>
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
        </div>
    );
}

export default Shop;
