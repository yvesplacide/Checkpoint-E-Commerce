import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../slices/productSlice";
import ProductList from "../components/ProductList";
import "./HomePage.css";

export default function HomePage() {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.productList);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <div className="home-container">
      {/* Section Hero */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Bienvenue sur Mon E-commerce</h1>
          <p className="hero-subtitle">
            Découvrez notre sélection de produits de qualité à des prix compétitifs
          </p>
          <div className="hero-buttons">
            <a href="#products" className="hero-btn primary">Voir les produits</a>
          </div>
        </div>
      </section>

      {/* Section Produits */}
      <section id="products">
        <h2 className="section-title">Nos Produits</h2>
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Chargement des produits...</p>
          </div>
        )}

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <ProductList />
      </section>

      {/* Section Caractéristiques (Pourquoi nous choisir ?) */}
      <section className="features-section">
        <h2 className="section-title">Pourquoi nous choisir ?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🚚</div>
            <h3 className="feature-title">Livraison Rapide</h3>
            <p className="feature-description">
              Livraison gratuite pour toute commande supérieure à 50€
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3 className="feature-title">Paiement Sécurisé</h3>
            <p className="feature-description">
              Transactions 100% sécurisées avec cryptage SSL
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3 className="feature-title">Service Client</h3>
            <p className="feature-description">
              Support client disponible 7j/7 pour vous accompagner
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
