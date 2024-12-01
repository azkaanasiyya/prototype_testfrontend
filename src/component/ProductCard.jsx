import React from "react";

const ProductCard = ({ product, onAddToCart }) => (
  <div className="product-card">
    <img src={product.thumbnail} alt={product.title} />
    <h3>{product.title}</h3>
    <p>{product.description}</p>
    <div className="product-details">
      <span>Rp {product.price}</span>
      <button onClick={() => onAddToCart(product)}>Add to Cart</button>
    </div>
  </div>
);

export default ProductCard;
