import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../features/cart/cartSlice';
import axios from 'axios';

function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/products/${id}/`)
      .then(res => { setProduct(res.data); setLoading(false); })
      .catch(() => { setLoading(false); });
  }, [id]);

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return <p style={{ textAlign: 'center', marginTop: 80 }}>Loading...</p>;
  if (!product) return <p style={{ textAlign: 'center', marginTop: 80 }}>Product not found.</p>;

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', padding: 24 }}>
      <button onClick={() => navigate(-1)}
        style={{ background: 'none', border: 'none', color: '#4f46e5', fontSize: 15, cursor: 'pointer', marginBottom: 20 }}>
        ← Back
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
        {/* Left - Image */}
        <div>
          <img
            src={
              product.image_url
                ? product.image_url
                : product.image
                ? `${product.image}`
                : 'https://placehold.co/400x400?text=No+Image'
            }
            alt={product.name}
            onError={e => { e.target.src = 'https://placehold.co/400x400?text=No+Image'; }}
            style={{ width: '100%', borderRadius: 12, objectFit: 'cover', maxHeight: 400 }}
          />
        </div>

        {/* Right - Details */}
        <div>
          <h1 style={{ fontSize: 26, marginBottom: 8 }}>{product.name}</h1>

          <p style={{ fontSize: 28, fontWeight: 'bold', color: '#4f46e5', margin: '12px 0' }}>
            ₹{product.price}
          </p>

          <p style={{
            display: 'inline-block', padding: '4px 12px', borderRadius: 20, fontSize: 13,
            background: product.stock > 0 ? '#dcfce7' : '#fee2e2',
            color: product.stock > 0 ? '#166534' : '#991b1b',
            marginBottom: 16
          }}>
            {product.stock > 0 ? `✅ In Stock (${product.stock} available)` : '❌ Out of Stock'}
          </p>

          <p style={{ color: '#4b5563', lineHeight: 1.7, marginBottom: 24 }}>
            {product.description}
          </p>

          {product.category && (
            <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 20 }}>
              Category: <strong>{product.category}</strong>
            </p>
          )}

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            style={{
              width: '100%', padding: 14, fontSize: 16, fontWeight: 'bold',
              background: added ? '#16a34a' : product.stock > 0 ? '#4f46e5' : '#9ca3af',
              color: 'white', border: 'none', borderRadius: 8, cursor: product.stock > 0 ? 'pointer' : 'not-allowed',
              transition: 'background 0.3s'
            }}>
            {added ? '✅ Added to Cart!' : product.stock > 0 ? '🛒 Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;