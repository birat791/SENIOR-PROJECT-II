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

  const getImageSrc = (image) => {
    if (!image) return null;

    // Case 1: already a data URL string from the frontend preview
    if (typeof image === "string") {
      if (image.startsWith("data:")) {
        return image;
      }
      // Case 2: plain base64 string from DB
      return `data:image/jpeg;base64,${image}`;
    }

    // Case 3: MySQL Buffer object sent via JSON: { type: "Buffer", data: [...] }
    if (typeof image === "object" && image !== null) {
      if (image.type === "Buffer" && Array.isArray(image.data)) {
        const uint8 = Uint8Array.from(image.data);
        // Decode the bytes back into the original base64 string
        let base64String = "";
        uint8.forEach((b) => {
          base64String += String.fromCharCode(b);
        });
        // Now base64String is the same as the original base64 we stored
        return `data:image/jpeg;base64,${base64String}`;
      }
    }

    return null;
  };

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
        {allProducts.map((product) => {
          const imgSrc = getImageSrc(product.image);

          return (
            <tr key={product.id ?? product.name}>
              <td>{product.id ?? "-"}</td>
              <td className="title-cell">{product.name}</td>
              <td>{product.category}</td>
              <td>${Number(product.price).toFixed(2)}</td>
              <td>{product.description}</td>
              <td>
                {imgSrc && (
                  <img
                    src={imgSrc}
                    alt={product.name}
                    className="product-image"
                  />
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default ProductTable;
