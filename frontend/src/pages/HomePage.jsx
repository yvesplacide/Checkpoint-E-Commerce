import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../slices/productSlice";
import ProductList from "../components/ProductList";

export default function HomePage() {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.productList);
  
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <div>
      {/* Section Hero */}
      <div className="hero-section" style={{
        background: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "white",
        padding: "4rem 0",
        marginBottom: "2rem",
        textAlign: "center"
      }}>
        <div className="container">
          <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Bienvenue sur Mon E-commerce</h1>
          <p style={{ fontSize: "1.2rem", maxWidth: "600px", margin: "0 auto" }}>
            Découvrez notre sélection de produits de qualité à des prix compétitifs
          </p>
        </div>
      </div>

      {/* Section Produits */}
      <div className="container">
        <div className="section-header" style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem"
        }}>
          <h2 style={{ 
            color: "var(--primary-color)",
            fontSize: "1.8rem",
            margin: 0
          }}>Nos produits</h2>
          
          <div className="filters" style={{
            display: "flex",
            gap: "1rem"
          }}>
            <select className="form-input" style={{ width: "auto" }}>
              <option value="">Trier par</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="name">Nom</option>
            </select>
          </div>
        </div>

        {loading && (
          <div className="loading-container" style={{
            textAlign: "center",
            padding: "2rem"
          }}>
            <div className="loading-spinner" style={{
              border: "4px solid var(--light-gray)",
              borderTop: "4px solid var(--primary-color)",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              animation: "spin 1s linear infinite",
              margin: "0 auto"
            }}></div>
            <p style={{ marginTop: "1rem" }}>Chargement des produits...</p>
          </div>
        )}

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <ProductList />
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}
