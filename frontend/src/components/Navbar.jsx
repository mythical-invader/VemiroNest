import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../redux/cartSlice';
import { Modal, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import '../styles/navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
            <div className="navbar-brand">              <Link                 to="/"                 style={{ fontSize: '32px', display: 'flex', alignItems: 'center' }}              >                <img                   src="/Logo2.png"                   alt="VemiroNest"                   style={{ height: '44px', width: '44px', borderRadius: '10px', objectFit: 'cover', filter: 'drop-shadow(0 2px 8px rgba(249, 115, 22, 0.35))', marginRight: '12px' }}                 />                VemiroNest              </Link>            </div>

            <div 
              className="mobile-menu-toggle right-icon" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={26} color="#fff" /> : <Menu size={26} color="#fff" />}
            </div>
          </div>
          <ul className={`navbar-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
            <li><Link to="/shop">Shop</Link></li>
            <li><Link to="/cart">Cart ({cartItems.length})</Link></li>
            <li><Link to="/wishlist">Wishlist</Link></li>
            {user ? (
              <>
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