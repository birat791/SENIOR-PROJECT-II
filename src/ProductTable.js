// src/ProductTable.js
import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "./config";

function ProductTable({ extraProducts = [] }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(`${API_BASE_URL}/products`);

        console.log("GET /products status:", response.status);

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log("Products from backend:", data);
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) return <p className="info">Loading products...</p>;
  if (error) return <p className="info error">Error: {error}</p>;

  const allProducts = [...products, ...extraProducts];

  if (allProducts.length === 0) {
    return <p className="info">No products found.</p>;
  }

  return (
    <table className="product-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Category</th>
          <th>Price</th>
          <th>Description</th>
          <th>Image</th>
        </tr>
      </thead>
      <tbody>
        {allProducts.map((product) => (
          <tr key={product.id ?? product.name}>
            <td>{product.id ?? "-"}</td>
            <td className="title-cell">{product.name}</td>
            <td>{product.category}</td>
            <td>${Number(product.price).toFixed(2)}</td>
            <td>{product.description}</td>
            <td>
              {product.image && (
                <img
                  src={
                    product.image.startsWith("data:")
                      ? product.image
                      : `data:image/jpeg;base64,${product.image}`
                  }
                  alt={product.name}
                  className="product-image"
                />
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ProductTable;
