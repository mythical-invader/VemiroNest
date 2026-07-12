import React, { useEffect, useState, useCallback } from 'react';
import ProductCard from '../components/ProductCard';
import '../styles/product.css';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('newest');

  const [availableCategories, setAvailableCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/products/categories');
        const data = await res.json();
        setAvailableCategories(data);
      } catch (err) {
        console.error("Error fetching categories", err);
      }
    };
    fetchCategories();
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.append('search', search);
      if (categories.length > 0) queryParams.append('category', categories.join(','));
      if (minPrice) queryParams.append('minPrice', minPrice);
      if (maxPrice) queryParams.append('maxPrice', maxPrice);
      if (sort) queryParams.append('sort', sort);

      const res = await fetch(`/api/products?${queryParams.toString()}`);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [search, categories, minPrice, maxPrice, sort]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleCategoryChange = (cat) => {
    setCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleClearFilters = () => {
    setSearch('');
    setCategories([]);
    setMinPrice('');
    setMaxPrice('');
    setSort('newest');
  };

  return (
    <div className="shop-container" style={{ display: 'flex', gap: '30px', margin: '-20px 0 0 0', boxSizing: 'border-box' }}>
      
      {/* Sidebar for Filters */}
      <div className="sidebar" style={{ width: '250px', flexShrink: 0, padding: '25px', background: '#18181b', borderRadius: '12px', color: '#fff', alignSelf: 'flex-start', position: 'sticky', top: '20px', border: '1px solid #27272a' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0 }}>Filters</h3>
            <button onClick={handleClearFilters} style={{ background: 'transparent', border: 'none', color: '#f97316', cursor: 'pointer', fontSize: '14px' }}>Clear All</button>
        </div>
        
        {/* Search */}
        <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Search</label>
            <input 
                type="text" 
                placeholder="Search products..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #3f3f46', background: '#27272a', color: '#fff' }}
            />
        </div>

        {/* Categories */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px' }}>Categories</label>
          {availableCategories.map(cat => (
            <div key={cat} style={{ marginBottom: '5px' }}>
              <label>
                <input 
                  type="checkbox" 
                  checked={categories.includes(cat)}
                  onChange={() => handleCategoryChange(cat)}
                  style={{ marginRight: '8px' }}
                />
                {cat}
              </label>
            </div>
          ))}
        </div>

        {/* Price Range */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px' }}>Price Range</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input 
              type="number" 
              placeholder="Min" 
              min="0"
              value={minPrice} 
              onChange={e => setMinPrice(e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))} 
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #3f3f46', background: '#27272a', color: '#fff' }}
            />
            <input 
              type="number" 
              placeholder="Max" 
              min="0"
              value={maxPrice} 
              onChange={e => setMaxPrice(e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))} 
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #3f3f46', background: '#27272a', color: '#fff' }}
            />
          </div>
        </div>

      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="shop-header">
            <h2 style={{ color: '#fff' }}>All Products</h2>
            
            {/* Sort Dropdown */}
            <div className="sort-section">
                <label style={{ color: '#fff', marginRight: '10px' }}>Sort By:</label>
                <select 
                    value={sort} 
                    onChange={e => setSort(e.target.value)}
                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #3f3f46', background: '#27272a', color: '#fff' }}
                >
                    <option value="newest">Newest</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="top_rated">Top Rated</option>
                </select>
            </div>
        </div>

        {loading ? (
          <div style={{ color: '#fff' }}>Loading...</div>
        ) : (
          <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
            {products.length === 0 ? (
                <p style={{ color: '#fff' }}>No products found.</p>
            ) : (
                products.map((product) => (
                <ProductCard key={product._id} product={product} />
                ))
            )}
          </div>
        )}
      </div>

    </div>
  );
};

export default Shop;