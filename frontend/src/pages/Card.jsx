import React, { useEffect, useState, useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import Swal from 'sweetalert2';

function Card() {
    const { removeFromCart, clearCart } = useContext(CartContext);
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [tax, setTax] = useState(0);
    // const [shipping] = useState(10);
    const { user } = useContext(AuthContext);

    const [formData, setFormData] = useState({ phone: '', address: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const storedItems = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(storedItems);

        const subtotal = storedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
        setTotal(subtotal);
        setTax(subtotal * 0.15);
    }, []);

    const handleRemove = (id) => {
        setCartItems(prevItems => {
            const updatedItems = prevItems.filter(item => item.id !== id);
            localStorage.setItem('cart', JSON.stringify(updatedItems));
            removeFromCart(id);
            updateTotals(updatedItems);
            return updatedItems;
        });
    };

    const updateTotals = (items) => {
        const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        setTotal(subtotal);
        setTax(subtotal * 0.15);
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevState => ({ ...prevState, [id]: value }));
    };

    const handleQuantityChange = (item, value) => {
        const newQuantity = Math.max(1, parseInt(value)); // Prevent negative or zero quantities
        const updatedItems = cartItems.map(cartItem =>
            cartItem.id === item.id ? { ...cartItem, quantity: newQuantity } : cartItem
        );
        setCartItems(updatedItems);
        localStorage.setItem('cart', JSON.stringify(updatedItems));
        updateTotals(updatedItems);
    };

    const handleCheckoutSubmit = async (e) => {
        e.preventDefault();
        if (!user || !user.id) {
            Swal.fire('Error', 'You must be logged in to place an order.', 'error');
            return;
        }

        const validItems = cartItems.filter(item => item.quantity > 0);
        if (validItems.length === 0) {
            Swal.fire('Error', 'Your cart is empty or all items have a quantity of 0.', 'error');
            return;
        }

        const orderData = {
            userId: user.id,
            items: validItems.map(item => ({ productId: item.id, quantity: item.quantity })),
            address: formData.address,
            phone: formData.phone,
        };

        setLoading(true);

        try {
            const response = await axios.post('http://localhost:8000/api/orders', orderData);
            Swal.fire('Success', 'Order placed successfully!', 'success');
            clearCart();
            setCartItems([]);
            setTotal(0);
            setTax(0);
            resetForm();
            closeCheckoutModal();
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to place order.';
            Swal.fire('Error', message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({ phone: '', address: '' });
    };

    const closeCheckoutModal = () => {
        const modalElement = document.getElementById('checkoutModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();
    };

    return (
        <div>
         {/* Breadcrumb Section */}
    <nav aria-label="breadcrumb">
        <div className="container"> 
            <ol className="breadcrumb py-5">
            <li className="breadcrumb-item"><a href="/">Home</a></li>
            <li className="breadcrumb-item active" aria-current="page">Cart</li>
        </ol>
    </div>
    </nav>
            {/* Cart Section */}
            <section className="pt-2 pb-5">
                <div className="container">
                    <h2 className="mb-4">Shopping Cart</h2>
                    <div className="row">
                        <div className="col-md-8">
                            {cartItems.length === 0 ? (
                                <p>Your cart is empty.</p>
                            ) : (
                                cartItems.map(item => (
                                    <div className="card mb-3" key={item.id}>
                                        <div className="row g-0">
                                            <div className="col-md-4">
                                                <img src={item.image_url} className="img-fluid rounded-start" alt={item.name} />
                                            </div>
                                            <div className="col-md-8">
                                                <div className="card-body">
                                                    <h5 className="card-title">{item.name}</h5>
                                                    <p className="card-text">Price: LKR {item.price}</p>
                                                    <div className="d-flex align-items-center">
                                                        <label htmlFor={`quantity-${item.id}`} className="me-2">Quantity:</label>
                                                        <input
                                                            type="number"
                                                            id={`quantity-${item.id}`}
                                                            className="form-control w-25"
                                                            value={item.quantity}
                                                            min="1"
                                                            onChange={(e) => handleQuantityChange(item, e.target.value)}
                                                        />
                                                    </div>
                                                    <button className="btn btn-danger btn-sm mt-2" onClick={() => handleRemove(item.id)}>Remove</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Cart Summary */}
                        <div className="col-md-4">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Order Summary</h5>
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item d-flex justify-content-between align-items-center">
                                            Subtotal
                                            <span>LKR {total.toFixed(2)}</span>
                                        </li>
                                        <li className="list-group-item d-flex justify-content-between align-items-center">
                                            Tax
                                            <span>LKR {tax.toFixed(2)}</span>
                                        </li>
                                        {/* <li className="list-group-item d-flex justify-content-between align-items-center">
                                            Shipping
                                            <span>LKR {shipping.toFixed(2)}</span>
                                        </li> */}
                                        <li className="list-group-item d-flex justify-content-between align-items-center">
                                            <strong>Total</strong>
                                            {/* <strong>LKR {(total + tax + shipping).toFixed(2)}</strong> */}
                                            <strong>LKR {(total + tax).toFixed(2)}</strong>
                                        </li>
                                    </ul>
                                    <button type="button" className="btn btn-primary btn-lg w-100 mt-3" data-bs-toggle="modal" data-bs-target="#checkoutModal">
                                        Proceed to Checkout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Checkout Modal */}
            <div className="modal fade" id="checkoutModal" tabIndex="-1" aria-labelledby="checkoutModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="checkoutModalLabel">Checkout Details</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form id="checkoutForm" onSubmit={handleCheckoutSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="phone" className="form-label">Phone Number</label>
                                    <input type="tel" className="form-control" id="phone" value={formData.phone} onChange={handleInputChange} required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="address" className="form-label">Address</label>
                                    <textarea className="form-control" id="address" rows="3" value={formData.address} onChange={handleInputChange} required></textarea>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="submit" form="checkoutForm" className="btn btn-primary" disabled={loading}>
                                {loading ? 'Submitting...' : 'Submit'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Card;
