import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlistItem, fetchWishlist } from '../redux/wishlistSlice';
import { AuthContext } from '../context/AuthContext';
import '../styles/product.css'; 

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();
    const { user } = useContext(AuthContext);
    const wishlistItems = useSelector(state => state.wishlist.items);
    const isWishlisted = wishlistItems.some(item => item === product._id || item._id === product._id);
    const [animate, setAnimate] = useState(false);

    const handleWishlistToggle = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setAnimate(true);
        setTimeout(() => setAnimate(false), 300);
        await dispatch(toggleWishlistItem({ product, token: user?.token }));
        dispatch(fetchWishlist(user?.token));
    };

    return (
        <div className="product-card">
            <Link to={`/product/${product._id}`} style={{ position: 'relative', display: 'block' }}>
                <button 
                    onClick={handleWishlistToggle}
                    className={animate ? 'heart-anim' : ''}
                    style={{ 
                        position: 'absolute', top: '10px', right: '10px', 
                        background: 'rgba(24, 24, 27, 0.7)', border: 'none', cursor: 'pointer', 
                        zIndex: 10, fontSize: '20px', 
                        color: isWishlisted ? '#f97316' : '#fff',
                        width: '36px', height: '36px', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        backdropFilter: 'blur(4px)', transition: 'transform 0.2s ease',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.3)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    {isWishlisted ? '♥' : '♡'}
                </button>
                <div className="product-image-container">
                    <img 
                        src={product.imageUrl || 'https://via.placeholder.com/200'} 
                        alt={product.name} 
                        className="product-image" 
                    />
                </div>
                <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="price">Rs. {product.price}</p>
                </div>
            </Link>            <div className="product-actions">                <Link to={`/product/${product._id}`} className="view-details-btn">                    View Details                </Link>            </div>        </div>    );};export default ProductCard;