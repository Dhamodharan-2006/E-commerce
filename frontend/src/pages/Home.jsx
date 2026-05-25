import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../features/products/productSlice';
import { addToCart } from '../features/cart/cartSlice';
import { useNavigate } from 'react-router-dom';
import { useDarkStyle } from '../app/useDarkStyle';
import axios from 'axios';

function Home() {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const { products, loading } = useSelector(s => s.products);
  const { darkMode, page, card, input, subText } = useDarkStyle();
  const [search,   setSearch]   = useState('');
  const [category, setCategory] = useState('All');
  const [sort,     setSort]     = useState('default');
  const [categories, setCategories] = useState([]);
  const [addedId,  setAddedId]  = useState(null);

  useEffect(() => {
    dispatch(fetchProducts());
    axios.get('https://ecommerce-backend-hanm.onrender.com/api/categories/')
      .then(r => setCategories(r.data)).catch(() => {});
  }, [dispatch]);

  const filtered = products
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    .filter(p => category === 'All' || String(p.category) === String(categories.find(c => c.name === category)?.id))
    .sort((a, b) => {
      if (sort === 'low')  return a.price - b.price;
      if (sort === 'high') return b.price - a.price;
      if (sort === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  const handleAdd = (e, product) => {
    e.stopPropagation();
    dispatch(addToCart(product));
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  if (loading) return <div style={{ ...page, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}><p>Loading products...</p></div>;

  return (
    <div style={{ ...page, padding: '16px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Search + Filter — stacks on mobile */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: 20 }}>
          <input
            type="text"
            placeholder="🔍 Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ ...input, gridColumn: 'span 2' }}
          />
          <select value={category} onChange={e => setCategory(e.target.value)} style={{ ...input, minWidth: 0 }}>
            <option value="All">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
          <select value={sort} onChange={e => setSort(e.target.value)} style={{ ...input, minWidth: 0 }}>
            <option value="default">Sort By</option>
            <option value="low">Price ↑</option>
            <option value="high">Price ↓</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>

        <h2 style={{ marginBottom: 16, fontSize: 20 }}>Our Products ({filtered.length})</h2>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6b7280' }}>
            <p style={{ fontSize: 40 }}>🔍</p>
            <p>No products found</p>
          </div>
        )}

        {/* Responsive grid: 1 col on mobile, 2 on tablet, 3-4 on desktop */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14 }}>
          {filtered.map(product => (
            <div
              key={product.id}
              onClick={() => navigate(`/product/${product.id}`)}
              style={{ ...card, borderRadius: 10, overflow: 'hidden', cursor: 'pointer', transition: 'transform .2s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <img
                src={product.image || 'https://placehold.co/300x200?text=No+Image'}
                alt={product.name}
                onError={e => { e.target.src = 'https://placehold.co/300x200?text=No+Image'; }}
                style={{ width: '100%', height: 150, objectFit: 'cover', display: 'block' }}
              />
              <div style={{ padding: '10px 12px' }}>
                <p style={{ fontWeight: 700, margin: '0 0 4px', fontSize: 14, lineHeight: 1.3, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {product.name}
                </p>
                <p style={{ ...subText, fontSize: 12, margin: '0 0 6px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                  {product.description}
                </p>
                <p style={{ fontWeight: 800, color: '#4f46e5', fontSize: 16, margin: '0 0 8px' }}>
                  ₹{product.price}
                </p>
                <p style={{ fontSize: 11, margin: '0 0 10px', color: product.stock > 0 ? '#16a34a' : '#dc2626', fontWeight: 600 }}>
                  {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                </p>
                <button
                  onClick={e => handleAdd(e, product)}
                  disabled={product.stock === 0}
                  style={{ width: '100%', padding: '8px 0', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: product.stock > 0 ? 'pointer' : 'not-allowed', background: addedId === product.id ? '#16a34a' : product.stock > 0 ? '#4f46e5' : '#9ca3af', color: 'white', transition: 'background .3s' }}>
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