import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useSelector } from 'react-redux';
import { Menu, X } from 'lucide-react';
import '../styles/navbar.css';

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
              </>
            ) : (
              <li><Link to="/login">Login</Link></li>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
};
export default Navbar;