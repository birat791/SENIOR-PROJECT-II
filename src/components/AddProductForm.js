// src/components/AddProductForm.js
import React, { useState } from "react";

function AddProductForm({ onProductAdded }) {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [imageData, setImageData] = useState("");      // base64 (for preview)
  const [imagePreview, setImagePreview] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Convert file → base64 and show preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      const base64 = reader.result;
      setImageData(base64);
      setImagePreview(base64);
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    // Basic validation
    if (!title || !price || !description || !category || !imageData) {
      setErrorMessage("Please fill in all fields and select an image.");
      return;
    }

    if (Number(price) <= 0) {
      setErrorMessage("Price must be greater than 0.");
      return;
    }

    // What we send to the FakeStore API
    // (use a small image URL so the API always accepts it)
    const newProduct = {
      title,
      price: Number(price),
      description,
      image: "https://i.pravatar.cc/150?img=3",
      category,
    };

    try {
      setIsSubmitting(true);

      const res = await fetch("https://fakestoreapi.com/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      });

      const createdProduct = await res.json();

      if (!res.ok) {
        throw new Error("Failed to add product");
      }

      // For displaying in our table: use the uploaded image (base64)
      const productForTable = {
        ...createdProduct,
        image: imagePreview || createdProduct.image,
      };

      if (typeof onProductAdded === "function") {
        onProductAdded(productForTable);
      }

      setSuccessMessage("Product added successfully!");

      // Reset form
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
          Title
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
