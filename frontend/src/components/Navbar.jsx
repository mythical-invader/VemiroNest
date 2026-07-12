import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../redux/cartSlice';
import { Modal, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { Sparkles, Zap } from 'lucide-react';
import '../styles/navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    logout();
    dispatch(clearCart());
    setShowLogoutModal(false);
    navigate('/login');
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-brand-wrapper">
            <motion.div 
              className="mobile-fun-icon left-icon"
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
              <Sparkles size={22} color="#f97316" />
            </motion.div>

            <div className="navbar-brand">
              <Link to="/">
                <img src="/Logo2.png" alt="VemiroNest" style={{ height: '36px', width: '36px', borderRadius: '8px', objectFit: 'cover', filter: 'drop-shadow(0 2px 8px rgba(249, 115, 22, 0.35))', marginRight: '10px' }} />
                VemiroNest
              </Link>
            </div>

            <motion.div 
              className="mobile-fun-icon right-icon"
              animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <Zap size={22} color="#f97316" strokeWidth={2.5} opacity={0.9} />
            </motion.div>
          </div>
          <ul className="navbar-links">
            <li><Link to="/shop">Shop</Link></li>
            <li><Link to="/cart">Cart ({cartItems.length})</Link></li>
            {user ? (
              <>
                <li><Link to="/wishlist">Wishlist</Link></li>
                <li><Link to="/profile">Hi, {user.name}</Link></li>
                {user.role === 'admin' && <li><Link to="/admin">Admin</Link></li>}
                {user.role !== 'admin' && <li><button onClick={handleLogoutClick} className="btn-logout" style={{ marginLeft: '15px' }}>Logout</button></li>}
              </>
            ) : (
              <li><Link to="/login">Login</Link></li>
            )}
          </ul>
        </div>
      </nav>
      {}
      <Modal show={showLogoutModal} onHide={() => setShowLogoutModal(false)} centered contentClassName="bg-dark text-white border-secondary">
        <Modal.Header closeButton closeVariant="white" className="border-secondary">
          <Modal.Title>Confirm Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to logout?
        </Modal.Body>
        <Modal.Footer className="border-secondary">
          <Button variant="secondary" onClick={() => setShowLogoutModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmLogout}>
            Logout
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default Navbar;