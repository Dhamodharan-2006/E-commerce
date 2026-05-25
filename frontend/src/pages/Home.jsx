import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../features/products/productSlice';
import { addToCart } from '../features/cart/cartSlice';
import { useNavigate } from 'react-router-dom';
import { useDarkStyle } from '../app/useDarkStyle';
import axios from 'axios';

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading } = useSelector(state => state.products);
  const { darkMode, page, card, input, subText } = useDarkStyle();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('default');
  const [categories, setCategories] = useState([]);
  const [addedId, setAddedId] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts());
    axios.get('https://ecommerce-backend-hanm.onrender.com/api/categories/')
      .then(res => setCategories(res.data))
      .catch(() => {});
  }, [dispatch]);

  const filtered = products
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    .filter(p => category === 'All' || String(p.category) === String(categories.find(c => c.name === category)?.id))
    .sort((a, b) => {
      if (sort === 'low') return a.price - b.price;
      if (sort === 'high') return b.price - a.price;
      if (sort === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    dispatch(addToCart(product));
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  if (loading) return (
    <div style={{ ...page, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <p>Loading products...</p>
    </div>
  );

  return (
    <div style={page}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <h2 style={{ marginBottom: 20 }}>Our Products</h2>

        {/* Search and Filter */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: 12, marginBottom: 28,
        }}>
          <input
            type="text"
            placeholder="🔍 Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ ...input, gridColumn: 'span 2' }}
          />
          <select value={category} onChange={e => setCategory(e.target.value)}
            style={{ ...input }}>
            <option value="All">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
          <select value={sort} onChange={e => setSort(e.target.value)}
            style={{ ...input }}>
            <option value="default">Sort By</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <p style={{ fontSize: 40 }}>🔍</p>
            <p style={subText}>No products found for "{search}"</p>
          </div>
        )}

        {/* Product Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 20,
        }}>
          {filtered.map(product => (
            <div key={product.id}
              onClick={() => navigate(`/product/${product.id}`)}
              style={{
                ...card, borderRadius: 10, overflow: 'hidden', cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <img
                src={product.image || 'https://placehold.co/300x200?text=No+Image'}
                alt={product.name}
                onError={e => { e.target.src = 'https://placehold.co/300x200?text=No+Image'; }}
                style={{ width: '100%', height: 180, objectFit: 'cover' }}
              />
              <div style={{ padding: 14 }}>
                <h3 style={{ margin: '0 0 6px', fontSize: 15 }}>{product.name}</h3>
                <p style={{ ...subText, fontSize: 12, margin: '0 0 8px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                  {product.description}
                </p>
                <p style={{ fontWeight: 'bold', color: '#4f46e5', fontSize: 16, margin: '0 0 8px' }}>
                  ₹{product.price}
                </p>
                <p style={{ fontSize: 12, margin: '0 0 12px', color: product.stock > 0 ? '#16a34a' : '#dc2626' }}>
                  {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                </p>
                <button
                  onClick={e => handleAddToCart(e, product)}
                  disabled={product.stock === 0}
                  style={{
                    width: '100%', padding: 9, border: 'none', borderRadius: 6,
                    background: addedId === product.id ? '#16a34a' : product.stock > 0 ? '#4f46e5' : '#9ca3af',
                    color: 'white', cursor: product.stock > 0 ? 'pointer' : 'not-allowed',
                    fontSize: 13, fontWeight: 500, transition: 'background 0.3s',
                  }}>
                  {addedId === product.id ? '✅ Added!' : 'Add to Cart'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;