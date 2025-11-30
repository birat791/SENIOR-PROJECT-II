// src/ProductTable.js
import React, { useEffect, useState } from "react";

function ProductTable() {
  const [products, setProducts] = useState([]);   // where we store the products
  const [loading, setLoading] = useState(true);   // true while we are waiting
  const [error, setError] = useState(null);       // store any error message

  useEffect(() => {
    // this runs once when the component loads
    async function fetchProducts() {
      try {
        const response = await fetch("https://fakestoreapi.com/products");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setProducts(data);       // save the products in state
      } catch (err) {
        setError(err.message);   // if something went wrong
      } finally {
        setLoading(false);       // done loading (success or error)
      }
    }

    fetchProducts();
  }, []); // empty array = run only once

  // Show messages while loading or if there's an error
  if (loading) {
    return <p className="info">Loading products...</p>;
  }

  if (error) {
    return <p className="info error">Error: {error}</p>;
  }

  // When data is ready, show the table
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
        {products.map((product) => (
          <tr key={product.id}>
            <td>{product.id}</td>

            <td className="title-cell">{product.title}</td>

            <td>{product.category}</td>

            <td>${product.price.toFixed(2)}</td>

            {/* product.rating has { rate, count } */}
            <td>{product.rating?.rate ?? "N/A"}</td>

            {/* We use rating.count as "Stock" */}
            <td>{product.rating?.count ?? 0}</td>

            <td>
              <img
                src={product.image}
                alt={product.title}
                className="product-image"
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ProductTable;
