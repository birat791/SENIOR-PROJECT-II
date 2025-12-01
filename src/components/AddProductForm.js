// src/components/AddProductForm.js
import React, { useState } from "react";
import { API_BASE_URL } from "../config";

function AddProductForm({ onProductAdded }) {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [imageData, setImageData] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      const fullDataUrl = reader.result;        // data:image/jpeg;base64,...
      const pureBase64 = fullDataUrl.split(",")[1]; // strip header for DB
      setImageData(pureBase64);
      setImagePreview(fullDataUrl);
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    if (!title || !price || !description || !category) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    if (Number(price) <= 0) {
      setErrorMessage("Price must be greater than 0.");
      return;
    }

    const newProduct = {
      name: title,
      price: Number(price),
      description,
      category,
      image: imageData || null,
    };

    console.log("Submitting product:", newProduct);

    try {
      setIsSubmitting(true);

      const res = await fetch(`${API_BASE_URL}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });

      const body = await res.json().catch(() => null);
      console.log("POST /products status:", res.status);
      console.log("POST /products response:", body);

      if (!res.ok) {
        throw new Error("Failed to add product");
      }

      const createdProduct = body || newProduct;

      const productForTable = {
        ...createdProduct,
        image: imagePreview || createdProduct.image,
      };

      if (typeof onProductAdded === "function") {
        onProductAdded(productForTable);
      }

      setSuccessMessage("Product added successfully!");
      setTitle("");
      setPrice("");
      setDescription("");
      setCategory("");
      setImageData("");
      setImagePreview(null);
    } catch (err) {
      console.error("Error adding product:", err);
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-product-container">
      <h2>Add New Product</h2>

      <form className="add-product-form" onSubmit={handleSubmit}>
        <label>
          Product Name
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>

        <label>
          Price
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </label>

        <label>
          Description
          <textarea
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>

        <label>
          Category
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </label>

        <label>
          Image
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </label>

        {imagePreview && (
          <div className="image-preview">
            <p>Preview:</p>
            <img src={imagePreview} alt="Preview" />
          </div>
        )}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Product"}
        </button>
      </form>

      {successMessage && (
        <p className="success-message">{successMessage}</p>
      )}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
}

export default AddProductForm;
