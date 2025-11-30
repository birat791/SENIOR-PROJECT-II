// src/App.js
import React from "react";
import ProductTable from "./ProductTable";
import "./App.css";

function App() {
  return (
    <div className="app">
      <h1>Product Table</h1>
      <p className="subtitle">
        Data from products
      </p>
      <ProductTable />
    </div>
  );
}

export default App;
