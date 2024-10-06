import React from 'react';
import './Notfound.css';

function Notfound() {
    return (
        <div>
            {/* Breadcrumb Section */}
            <nav aria-label="breadcrumb">
                <div className="container">
                    <ol className="breadcrumb py-5">
                        <li className="breadcrumb-item"><a href="/">Home</a></li>
                        <li className="breadcrumb-item active" aria-current="page">404</li>
                    </ol>
                </div>
            </nav>
            <div className="container error-container">
                <div className="error-code">404</div>
                <p className="error-message">Oops! The page you’re looking for can’t be found.</p>
                <a href="/" className="btn btn-primary mt-4">Go Back Home</a>
            </div>
        </div>

    );
}

export default Notfound;
