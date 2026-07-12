import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { removeFromCart, addToCart } from '../redux/cartSlice';
import { Modal, Button } from 'react-bootstrap';
import '../styles/cart.css';

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);

  const handleShowModal = (id) => {
    setItemToRemove(id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setItemToRemove(null);
  };

  const confirmRemove = () => {
    if (itemToRemove) {
      dispatch(removeFromCart(itemToRemove));
      handleCloseModal();
    }
  };

  const handleUpdateQty = (item, qty) => {
    if (qty > 0) {
      dispatch(addToCart({ ...item, qty }));
    }
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <div className="cart-container">
      <h2>Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <div className="empty-state-card">
          <div style={{ fontSize: '4rem', marginBottom: '20px', animation: 'fadeIn 0.8s ease-in-out' }}>🛒</div>
          <h3 style={{ color: '#fff', marginBottom: '20px', fontSize: '1.8rem' }}>Your Cart is Empty</h3>
          <p style={{ color: '#a1a1aa', marginBottom: '30px', fontSize: '1.1rem' }}>Looks like you haven't added anything to your cart yet.</p>
          <Link to="/shop" className="btn" style={{ padding: '15px 30px', fontSize: '1.1rem' }}>Start Shopping</Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.productId} className="cart-item">
                <img src={item.imageUrl} alt={item.name} className="cart-item-image" />
                <div className="cart-item-details">
                  <h4>{item.name}</h4>
                  <p>Rs. {item.price}</p>
                  <div className="qty-controls">
                    <button onClick={() => handleUpdateQty(item, item.qty - 1)}>-</button>
                    <span>{item.qty}</span>
                    <button onClick={() => handleUpdateQty(item, item.qty + 1)}>+</button>
                  </div>
                </div>
                <button onClick={() => handleShowModal(item.productId)} className="btn-remove-icon" aria-label="Remove item">
                  ✕
                </button>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h3>Total: Rs. {totalPrice.toFixed(2)}</h3>
            <button onClick={() => navigate('/checkout')} className="btn btn-checkout">Proceed to Checkout</button>
          </div>
        </div>
      )}

      {/* Remove Confirmation Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton style={{ background: '#18181b', borderBottom: '1px solid #27272a', color: '#fff' }}>
          <Modal.Title>Confirm Removal</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ background: '#18181b', color: '#a1a1aa' }}>
          Are you sure you want to remove this item from your shopping cart?
        </Modal.Body>
        <Modal.Footer style={{ background: '#18181b', borderTop: '1px solid #27272a' }}>
          <Button variant="secondary" onClick={handleCloseModal} style={{ background: '#27272a', border: 'none' }}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmRemove} style={{ background: '#ef4444', border: 'none' }}>
            Yes, Remove
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default Cart;