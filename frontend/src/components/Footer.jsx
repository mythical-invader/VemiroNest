import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/footer.css';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-brand">
          <h3>VemiroNest</h3>
          <p>Premium E-Commerce Platform.</p>
        </div>
        
        <div className="footer-links">
          <Link to="/about">About Us</Link>
          <Link to="/return">Return Policy</Link>
          <Link to="/disclaimer">Disclaimer</Link>
          <Link to="/contact">Contact Us</Link>
        </div>
        
        <div className="footer-copyright">
          &copy; {new Date().getFullYear()} VemiroNest. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;