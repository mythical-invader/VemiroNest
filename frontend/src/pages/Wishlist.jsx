import React, { useEffect, useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchWishlist } from '../redux/wishlistSlice';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { AuthContext } from '../context/AuthContext';

const Wishlist = () => {
  const dispatch = useDispatch();
  const { user } = useContext(AuthContext);
  const { items } = useSelector(state => state.wishlist);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.token) {
        setLoading(false);
        return;
    }
    dispatch(fetchWishlist(user.token)).then(() => setLoading(false));
  }, [dispatch, user]);

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center', color: '#fff' }}>Loading Wishlist...</div>;
  }

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
      <h2 style={{ color: '#fff' }}>My Wishlist</h2>
      {items.length === 0 ? (
        <div className="empty-state-card">
          <div style={{ fontSize: '4rem', marginBottom: '20px', animation: 'fadeIn 0.8s ease-in-out' }}>🤍</div>
          <h3 style={{ color: '#fff', marginBottom: '20px', fontSize: '1.8rem' }}>Your Wishlist is Empty</h3>
          <p style={{ color: '#a1a1aa', marginBottom: '30px', fontSize: '1.1rem' }}>Save items you love to your wishlist to easily find them later.</p>
          <Link to="/shop" className="btn" style={{ padding: '15px 30px', fontSize: '1.1rem' }}>Explore Products</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
          {items.map(product => (
            <ProductCard key={product._id} product={product} isWishlisted={true} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
