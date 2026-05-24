import { useState, useEffect } from "react";
import API from "../../app/axiosConfig";

const initialForm = { name: "", description: "", price: "", stock: "" };

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState("success");

  const loadProducts = () => {
    API.get("products/")
      .then((res) => setProducts(res.data))
      .catch((err) => console.log("Load error:", err.response?.data));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await API.put(`products/${editId}/`, form);
        setMessage("✅ Product updated successfully!");
      } else {
        await API.post("products/", form);
        setMessage("✅ Product added successfully!");
      }
      setMsgType("success");
      setForm(initialForm);
      setEditId(null);
      loadProducts();
    } catch (err) {
      console.log("Submit error:", err.response?.data);
      setMsgType("error");
      setMessage("❌ Error: Make sure you are logged in as admin");
    }
  };

  const handleEdit = (p) => {
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
      stock: p.stock,
    });
    setEditId(p.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await API.delete(`products/${id}/`);
        setMsgType("success");
        setMessage("✅ Product deleted successfully!");
        loadProducts();
      } catch (err) {
        setMsgType("error");
        setMessage("❌ Failed to delete product");
      }
    }
  };

  const handleCancel = () => {
    setForm(initialForm);
    setEditId(null);
    setMessage("");
  };

  return (
    <div style={{ maxWidth: 850, margin: "40px auto", padding: 24 }}>

      <h2 style={{ marginBottom: 24 }}>⚙️ Admin — Manage Products</h2>

      {/* Message */}
      {message && (
        <p style={{
          padding: 12, borderRadius: 6, marginBottom: 20,
          background: msgType === "success" ? "#f0fdf4" : "#fef2f2",
          color: msgType === "success" ? "#166534" : "#991b1b",
          border: `1px solid ${msgType === "success" ? "#bbf7d0" : "#fecaca"}`,
        }}>
          {message}
        </p>
      )}

      {/* Add / Edit Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 10,
          padding: 24,
          marginBottom: 36,
          background: "#fafafa",
        }}
      >
        <h3 style={{ marginBottom: 20 }}>
          {editId ? "✏️ Edit Product" : "➕ Add New Product"}
        </h3>

        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 13, color: "#6b7280" }}>Product Name</label>
          <input
            placeholder="Enter product name"
            value={form.name}
            required
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={{
              display: "block", width: "100%", padding: 10, marginTop: 4,
              border: "1px solid #d1d5db", borderRadius: 6,
            }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 13, color: "#6b7280" }}>Description</label>
          <textarea
            placeholder="Enter product description"
            value={form.description}
            rows={3}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            style={{
              display: "block", width: "100%", padding: 10, marginTop: 4,
              border: "1px solid #d1d5db", borderRadius: 6,
            }}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
          <div>
            <label style={{ fontSize: 13, color: "#6b7280" }}>Price (₹)</label>
            <input
              type="number"
              placeholder="Enter price"
              value={form.price}
              required
              min="0"
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              style={{
                display: "block", width: "100%", padding: 10, marginTop: 4,
                border: "1px solid #d1d5db", borderRadius: 6,
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: 13, color: "#6b7280" }}>Stock Quantity</label>
            <input
              type="number"
              placeholder="Enter stock"
              value={form.stock}
              required
              min="0"
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              style={{
                display: "block", width: "100%", padding: 10, marginTop: 4,
                border: "1px solid #d1d5db", borderRadius: 6,
              }}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            type="submit"
            style={{
              padding: "10px 28px",
              background: editId ? "#10b981" : "#4f46e5",
              color: "white", border: "none", borderRadius: 6, cursor: "pointer",
              fontWeight: 600, fontSize: 14,
            }}
          >
            {editId ? "Update Product" : "Add Product"}
          </button>
          {editId && (
            <button
              type="button"
              onClick={handleCancel}
              style={{
                padding: "10px 24px", background: "#6b7280",
                color: "white", border: "none", borderRadius: 6, cursor: "pointer",
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Products Table */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h3 style={{ margin: 0 }}>All Products ({products.length})</h3>
        <button
          onClick={loadProducts}
          style={{
            padding: "7px 16px", background: "#4f46e5", color: "white",
            border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13,
          }}
        >
          🔄 Refresh
        </button>
      </div>

      {products.length === 0 ? (
        <div style={{ textAlign: "center", padding: 50, color: "#6b7280" }}>
          <p style={{ fontSize: 40 }}>📦</p>
          <p>No products yet. Add your first product above.</p>
        </div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ background: "#f9fafb" }}>
              <th style={{ padding: "12px 14px", textAlign: "left", borderBottom: "2px solid #e5e7eb" }}>Name</th>
              <th style={{ padding: "12px 14px", textAlign: "left", borderBottom: "2px solid #e5e7eb" }}>Description</th>
              <th style={{ padding: "12px 14px", textAlign: "center", borderBottom: "2px solid #e5e7eb" }}>Price</th>
              <th style={{ padding: "12px 14px", textAlign: "center", borderBottom: "2px solid #e5e7eb" }}>Stock</th>
              <th style={{ padding: "12px 14px", textAlign: "center", borderBottom: "2px solid #e5e7eb" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                <td style={{ padding: "12px 14px", fontWeight: 500 }}>{p.name}</td>
                <td style={{ padding: "12px 14px", color: "#6b7280", fontSize: 13,
                  maxWidth: 200, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                  {p.description}
                </td>
                <td style={{ padding: "12px 14px", textAlign: "center", fontWeight: "bold", color: "#4f46e5" }}>
                  ₹{p.price}
                </td>
                <td style={{ padding: "12px 14px", textAlign: "center" }}>
                  <span style={{
                    padding: "3px 10px", borderRadius: 10, fontSize: 12, fontWeight: 500,
                    background: p.stock > 5 ? "#dcfce7" : p.stock > 0 ? "#fef9c3" : "#fee2e2",
                    color: p.stock > 5 ? "#166534" : p.stock > 0 ? "#854d0e" : "#991b1b",
                  }}>
                    {p.stock > 0 ? p.stock : "Out of Stock"}
                  </span>
                </td>
                <td style={{ padding: "12px 14px", textAlign: "center" }}>
                  <button
                    onClick={() => handleEdit(p)}
                    style={{
                      marginRight: 8, padding: "5px 14px", background: "#f59e0b",
                      color: "white", border: "none", borderRadius: 4, cursor: "pointer",
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    style={{
                      padding: "5px 14px", background: "#ef4444",
                      color: "white", border: "none", borderRadius: 4, cursor: "pointer",
                    }}
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminProducts;