// src/App.js
import React, { useState } from "react";
import ProductTable from "./ProductTable";
import AddProductForm from "./components/AddProductForm";
import "./App.css";

function App() {
  const [extraProducts, setExtraProducts] = useState([]);

  const handleProductAdded = (product) => {
    // append to end of list
    setExtraProducts((prev) => [...prev, product]);
  };

  return (
    <div className="app">
      <h1>Product Table</h1>
      <p className="subtitle">Data from products</p>

      {/* form */}
      <AddProductForm onProductAdded={handleProductAdded} />

      {/* table */}
      <ProductTable extraProducts={extraProducts} />
    </div>
  );
}

export default App;
