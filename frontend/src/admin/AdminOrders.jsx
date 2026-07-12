import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../styles/admin.css';

const AdminOrders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await fetch('/api/orders', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    };
    fetchOrders();
  }, [user]);

  const updateStatus = async (id, status) => {
    setUpdatingOrderId(id);
    try {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setOrders(orders.map(order => order._id === id ? { ...order, status } : order));
      }
    } catch (error) {
      console.error("Failed to update status", error);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const filteredOrders = orders.filter(order => 
    order._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>Manage Orders</h2>
        <input 
          type="text" 
          placeholder="Search Order ID..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ORDER ID</th>
              <th>USER</th>
              <th>DELIVERY DETAILS</th>
              <th>TOTAL</th>
              <th>DATE</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order._id}>
                <td>{order._id.substring(0, 8)}...</td>
                <td>{order.user?.name || 'Deleted User'}</td>
                <td>
                  {order.address ? (
                    <div style={{ fontSize: '0.85rem', color: '#a1a1aa', lineHeight: '1.4' }}>
                      <strong style={{ color: '#fff' }}>{order.address.fullName}</strong><br/>
                      {order.address.street}<br/>
                      {order.address.city}, {order.address.postalCode}<br/>
                      {order.address.country}
                    </div>
                  ) : 'N/A'}
                </td>
                <td>Rs. {order.totalAmount.toFixed(2)}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <select 
                    value={order.status} 
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    disabled={updatingOrderId === order._id}
                    style={{ 
                      background: order.status === 'delivered' ? 'rgba(16,185,129,0.1)' : order.status === 'shipped' ? 'rgba(59,130,246,0.1)' : 'rgba(245,158,11,0.1)', 
                      color: order.status === 'delivered' ? '#10b981' : order.status === 'shipped' ? '#3b82f6' : '#f59e0b',
                      padding: '8px 12px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', outline: 'none',
                      fontWeight: 'bold', textTransform: 'capitalize', cursor: updatingOrderId === order._id ? 'wait' : 'pointer'
                    }}
                  >
                    <option value="pending" style={{ color: '#000' }}>Pending</option>
                    <option value="shipped" style={{ color: '#000' }}>Shipped</option>
                    <option value="delivered" style={{ color: '#000' }}>Delivered</option>
                  </select>
                  {updatingOrderId === order._id && (
                    <span style={{ color: '#f97316', fontSize: '0.85rem' }}>Updating...</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;