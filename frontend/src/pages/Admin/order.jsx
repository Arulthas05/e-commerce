import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';


function Order() {
  const [orders, setOrders] = useState([]); // State to store orders

  // Fetch orders from the backend when component loads
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/orders'); // Update with your API endpoint
        setOrders(response.data); // Assuming the API returns the orders in `data`
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  // Function to delete an order
//   const handleDelete = async (orderId) => {
//     try {
//       await axios.delete(`http://localhost:8000/api/orders/${orderId}`); // Update with your API endpoint
//       setOrders(orders.filter(order => order.orderId !== orderId)); // Remove the deleted order from state
//     } catch (error) {
//       console.error('Error deleting order:', error);
//     }
//   };

const handleDelete = async (orderId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will delete the order permanently!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });
  
    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:8000/api/orders/${orderId}`);
        setOrders(orders.filter(order => order.orderId !== orderId)); // Remove the deleted order from state
  
        Swal.fire(
          'Deleted!',
          'Your order has been deleted.',
          'success'
        );
      } catch (error) {
        console.error('Error deleting order:', error);
        Swal.fire(
          'Error!',
          'There was a problem deleting your order.',
          'error'
        );
      }
    }
  };

  return (
    <div>
      {/* Main Content */}
      <div className="main-content py-5">
        <h2>Order List</h2>

        <table className="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Order Id</th>
              <th>Product Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total Price</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="9">No orders found.</td>
              </tr>
            ) : (
              orders.map((order, index) => (
                order.items.map((item, itemIndex) => (
                  <tr key={`${order.orderId}-${item.productId}`}>
                    {/* Display the order info only for the first product of each order */}
                    {itemIndex === 0 && (
                      <>
                        <td rowSpan={order.items.length}>{index + 1}</td>
                        <td rowSpan={order.items.length}>{order.orderId}</td>
                      </>
                    )}
                    <td>{item.productName}</td>
                    <td>LKR {item.price}</td>
                    <td>{item.quantity}</td>
                    <td>LKR {item.price * item.quantity}</td>
                    {itemIndex === 0 && (
                      <>
                        <td rowSpan={order.items.length}>{order.phone}</td>
                        <td rowSpan={order.items.length}>{order.address}</td>
                        <td rowSpan={order.items.length}>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(order.orderId)}
                          >
                            Delete
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Order;
