import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../slices/cartSlice";

const ProductList = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.productList);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur: {error}</p>;

  if (!Array.isArray(products)) {
    return <p>Erreur : les produits ne sont pas dans un format valide.</p>;
  }

  return (
    <div className="product-grid">
      {products.map(product => (
        <div key={product._id} className="product-card">
          <div className="product-image-container" style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: "8px 8px 0 0"
          }}>
            <img 
              src={product.image} 
              alt={product.name} 
              className="product-image"
            />
            {product.discount && (
              <div style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "var(--error-color)",
                color: "white",
                padding: "0.25rem 0.5rem",
                borderRadius: "4px",
                fontSize: "0.875rem"
              }}>
                -{product.discount}%
              </div>
            )}
          </div>
          
          <div className="product-info">
            <h3 className="product-title">{product.title}</h3>
            <p style={{
              color: "#666",
              fontSize: "0.9rem",
              marginBottom: "1rem",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden"
            }}>{product.description}</p>
            
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "auto"
            }}>
              <div>
                {product.oldPrice && (
                  <span style={{
                    textDecoration: "line-through",
                    color: "#999",
                    marginRight: "0.5rem",
                    fontSize: "0.9rem"
                  }}>
                    {product.oldPrice} €
                  </span>
                )}
                <span className="product-price">{product.price} €</span>
              </div>
              
              <button 
                onClick={() => handleAddToCart(product)}
                className="btn btn-primary"
                style={{
                  padding: "0.5rem 1rem",
                  fontSize: "0.9rem"
                }}
              >
                <span style={{ marginRight: "0.5rem" }}>🛒</span>
                Ajouter
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
