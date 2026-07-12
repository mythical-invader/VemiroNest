import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/admin.css';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/analytics', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setStats(data);
        } else {
          if (res.status === 401) {
            navigate('/login');
          }
          setStats({ totalOrders: 0, totalProducts: 0, totalUsers: 0, totalRevenue: 0 });
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchStats();
  }, [user, navigate]);

  return (
    <div className="admin-container">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginBottom: '20px' }}>
        <img src="/Logo2.png" alt="Logo" style={{ height: '40px', width: '40px', borderRadius: '8px', objectFit: 'cover', filter: 'drop-shadow(0 0px 10px rgba(249, 115, 22, 0.3))' }} />
        <h2 style={{ margin: 0 }}>Admin Dashboard</h2>
      </div>
      <p style={{ color: '#a1a1aa', marginBottom: '30px', fontSize: '1.1rem', textAlign: 'center' }}>Welcome back, <span style={{color: '#fff'}}>{user?.name}</span></p>
      {stats ? (
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <h4>Total Orders</h4>
            <div className="stat-value">{stats.totalOrders}</div>
          </div>
          <div className="admin-stat-card">
            <h4>Total Products</h4>
            <div className="stat-value">{stats.totalProducts}</div>
          </div>
          <div className="admin-stat-card">
            <h4>Total Users</h4>
            <div className="stat-value">{stats.totalUsers}</div>
          </div>
          <div className="admin-stat-card">
            <h4>Total Revenue</h4>
            <div className="stat-value">Rs. {stats.totalRevenue.toFixed(2)}</div>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', margin: '50px 0', color: '#f97316' }}>Loading metrics...</div>
      )}
      <div className="admin-controls-box">
        <h3>Administrative Controls</h3>
        <div className="admin-controls-grid">
          <button className="btn" onClick={() => navigate('/admin/add-product')}>+ Add Product</button>
          <button className="btn" onClick={() => navigate('/admin/products')} style={{ background: '#3f3f46' }}>📦 Manage Products</button>
          <button className="btn" onClick={() => navigate('/admin/orders')} style={{ background: '#3f3f46' }}>🚚 Manage Orders</button>
          <button className="btn" onClick={() => navigate('/admin/users')} style={{ background: '#3f3f46' }}>👥 Users Directory</button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;