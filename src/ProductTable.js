// src/ProductTable.js
import React, { useEffect, useState } from "react";

function ProductTable({ extraProducts = [] }) {
  const [products, setProducts] = useState([]);   // products from API
  const [loading, setLoading] = useState(true);   // true while loading
  const [error, setError] = useState(null);       // error message

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("https://fakestoreapi.com/products");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) {
    return <p className="info">Loading products...</p>;
  }

  if (error) {
    return <p className="info error">Error: {error}</p>;
  }

  // combine API products + manually added ones (extra at the end)
  const allProducts = [...products, ...extraProducts];

  return (
    <table className="product-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Category</th>
          <th>Price</th>
          <th>Rating</th>
          <th>Stock</th>
          <th>Image</th>
        </tr>
      </thead>
      <tbody>
        {allProducts.map((product) => (
          <tr key={product.id ?? product.title}>
            <td>{product.id ?? "-"}</td>

            <td className="title-cell">{product.title}</td>

            <td>{product.category}</td>

            <td>${Number(product.price).toFixed(2)}</td>

            {/* product.rating has { rate, count } – may not exist for new ones */}
            <td>{product.rating?.rate ?? "N/A"}</td>

            {/* Use rating.count as "Stock" if available */}
            <td>{product.rating?.count ?? 0}</td>

            <td>
              {product.image && (
                <img
                  src={product.image}
                  alt={product.title}
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
