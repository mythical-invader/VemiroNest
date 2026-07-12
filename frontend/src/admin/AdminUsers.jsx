import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../styles/admin.css';

const AdminUsers = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [passkey, setPasskey] = useState('');
  const [promoteError, setPromoteError] = useState(null);
  const [promoting, setPromoting] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch('/api/auth/users', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    };
    fetchUsers();
  }, [user]);

  const filteredUsers = users.filter(u => 
    u._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePromoteClick = (userId) => {
    setSelectedUserId(userId);
    setPasskey('');
    setPromoteError(null);
    setShowPromoteModal(true);
  };

  const handlePromoteSubmit = async () => {
    if (!passkey) {
      setPromoteError('Please enter the promotion passkey');
      return;
    }
    
    setPromoting(true);
    setPromoteError(null);
    
    try {
      const res = await fetch(`/api/auth/users/${selectedUserId}/role`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}` 
        },
        body: JSON.stringify({ passkey, role: 'admin' })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        // Update user locally
        setUsers(users.map(u => u._id === selectedUserId ? { ...u, role: 'admin' } : u));
        setShowPromoteModal(false);
      } else {
        setPromoteError(data.message || 'Failed to promote user');
      }
    } catch (err) {
      setPromoteError('Server error while promoting user');
    } finally {
      setPromoting(false);
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2 style={{ color: '#f97316', margin: 0 }}>User Directory</h2>
        <input 
          type="text" 
          placeholder="Search by ID, Name or Email..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ROLE</th>
              <th>JOINED</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(u => (
              <tr key={u._id}>
                <td>{u._id.substring(0, 8)}...</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <span style={{ background: u.role === 'admin' ? 'rgba(234,88,12,0.2)' : 'rgba(16,185,129,0.2)', color: u.role === 'admin' ? '#f97316' : '#10b981', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                    {u.role.toUpperCase()}
                  </span>
                </td>
                <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}</td>
                <td>
                  {u.role === 'user' && (
                    <button 
                      onClick={() => handlePromoteClick(u._id)}
                      style={{ background: 'transparent', border: '1px solid rgba(249,115,22,0.5)', color: '#f97316', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(249,115,22,0.1)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      Promote to Admin
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showPromoteModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#18181b', padding: '30px', borderRadius: '12px', width: '90%', maxWidth: '400px', border: '1px solid rgba(249,115,22,0.3)' }}>
            <h3 style={{ color: '#fff', marginBottom: '15px', marginTop: 0 }}>Promote User to Admin</h3>
            <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '20px' }}>This is a highly sensitive action. Please enter the secure Promotion Passkey to authorize this role upgrade.</p>
            
            {promoteError && (
              <div style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '10px', borderRadius: '6px', marginBottom: '15px', fontSize: '0.9rem', border: '1px solid rgba(239,68,68,0.3)' }}>
                {promoteError}
              </div>
            )}
            
            <input 
              type="password" 
              placeholder="Enter Promotion Passkey" 
              value={passkey}
              onChange={(e) => setPasskey(e.target.value)}
              style={{ width: '100%', padding: '10px 15px', background: '#09090b', border: '1px solid #27272a', borderRadius: '6px', color: '#fff', marginBottom: '20px', boxSizing: 'border-box' }}
            />
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                onClick={() => setShowPromoteModal(false)}
                style={{ background: 'transparent', border: '1px solid #3f3f46', color: '#a1a1aa', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Cancel
              </button>
              <button 
                onClick={handlePromoteSubmit}
                disabled={promoting}
                style={{ background: '#f97316', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', opacity: promoting ? 0.7 : 1 }}
              >
                {promoting ? 'Promoting...' : 'Authorize Promotion'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;