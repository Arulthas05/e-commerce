import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function AddProduct() {
  const [product, setProduct] = useState({
    id: null,
    name: '',
    description: '',
    price: 0,
    image_url: '',
    brand: '',
    stock: 0,
    status: 'active'
  });

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if ((name === 'price' || name === 'stock') && value < 0) {
      return; // Prevent negative values
    }
    setProduct((prevProduct) => ({
      ...prevProduct,
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
        url: `http://localhost:8000/api/products${isEditing ? `/${product.id}` : ''}`,
        data: product,
      });

      Swal.fire({
        icon: 'success',
        title: isEditing ? 'Product updated' : 'Product added',
        text: response.data.message,
      });

      // Reset form fields
      resetForm();
      fetchProducts();

      // Close the modal
      const modalElement = document.getElementById('addProductModal');
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

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const editProduct = (product) => {
    setProduct(product);
    setIsEditing(true);

    // Open the modal
    const modalElement = document.getElementById('addProductModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  };

const deleteProduct = async (id) => {
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
          await axios.delete(`http://localhost:8000/api/products/${id}`);
          Swal.fire(
            'Deleted!',
            'Product has been deleted.',
            'success'
          );
          fetchProducts(); // Refresh product list after deletion
        } catch (error) {
          console.error('Error deleting product:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to delete the product.',
          });
        }
      }
    });
  };
  

  const resetForm = () => {
    setProduct({
      id: null,
      name: '',
      description: '',
      price: 0,
      image_url: '',
      brand: '',
      stock: 0,
      status: 'active'
    });
    setIsEditing(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <div style={{ paddingTop: '70px', paddingLeft: '50px',paddingRight: '50px' }} className="main-content">
        <h2>Products</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="mb-3">
          <button
            type="button"
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#addProductModal"
            onClick={resetForm}
          >
            Add New Product
          </button>
        </div>
        <table className="table table-striped align-baseline">
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Product Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Brand</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((prod) => (
              <tr key={prod.id}>
                <td>{prod.id}</td>
                <td><img style={{ height: '50px', width: '50px' }} className="rounded" src={prod.image_url || 'https://via.placeholder.com/50'} alt="Product" /></td>

                <td>{prod.name}</td>
                <td>{prod.description}</td>
                <td>${prod.price.toFixed(2)}</td>
                <td>{prod.brand}</td>
                <td>{prod.stock}</td>
                <td><span className={`badge bg-${prod.status === 'active' ? 'success' : 'secondary'}`}>{prod.status}</span></td>
                <td>
                  <button onClick={() => editProduct(prod)} className="btn btn-sm btn-info">Edit</button>
                  <button onClick={() => deleteProduct(prod.id)} className="btn btn-sm btn-danger">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      <div className="modal fade" id="addProductModal" tabIndex="-1" aria-labelledby="addProductModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addProductModalLabel">{isEditing ? 'Edit Product' : 'Add New Product'}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={resetForm}></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="productName" className="form-label">Product Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="productName"
                    name="name"
                    value={product.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="productDescription" className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    id="productDescription"
                    name="description"
                    rows="3"
                    value={product.description}
                    onChange={handleChange}
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label htmlFor="productPrice" className="form-label">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    id="productPrice"
                    name="price"
                    value={product.price}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="productImage" className="form-label">Image URL</label>
                  <input
                    type="text"
                    className="form-control"
                    id="productImage"
                    name="image_url"
                    value={product.image_url}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="productBrand" className="form-label">Brand</label>
                  <input
                    type="text"
                    className="form-control"
                    id="productBrand"
                    name="brand"
                    value={product.brand}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="productStock" className="form-label">Stock</label>
                  <input
                    type="number"
                    className="form-control"
                    id="productStock"
                    name="stock"
                    value={product.stock}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="productStatus" className="form-label">Status</label>
                  <select
                    className="form-control"
                    id="productStatus"
                    name="status"
                    value={product.status}
                    onChange={handleChange}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Processing...' : (isEditing ? 'Update Product' : 'Add Product')}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;
