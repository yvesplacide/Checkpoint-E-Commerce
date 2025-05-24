import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* À propos */}
          <div className="footer-section">
            <h3>Mon E-commerce</h3>
            <p>
              Votre destination shopping en ligne pour des produits de qualité à des prix compétitifs.
            </p>
          </div>

          {/* Liens rapides */}
          <div className="footer-section">
            <h3>Liens rapides</h3>
            <ul className="footer-links">
              <li>
                <Link to="/">Accueil</Link>
              </li>
              <li>
                <Link to="/cart">Panier</Link>
              </li>
              <li>
                <Link to="/login">Connexion</Link>
              </li>
              <li>
                <Link to="/register">Inscription</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-section">
            <h3>Contact</h3>
            <ul className="contact-info">
              <li>📧 contact@monecommerce.com</li>
              <li>📞 +33 1 23 45 67 89</li>
              <li>📍 123 Rue du Commerce, Paris</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="footer-section">
            <h3>Newsletter</h3>
            <p>
              Inscrivez-vous pour recevoir nos dernières offres et nouveautés.
            </p>
            <form className="newsletter-form">
              <input
                type="email"
                placeholder="Votre email"
                className="newsletter-input"
              />
              <button
                type="submit"
                className="newsletter-button"
              >
                S'inscrire
              </button>
            </form>
          </div>
        </div>

        {/* Barre de séparation */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">
              © 2024 Mon E-commerce. Tous droits réservés.
            </p>
            <div className="legal-links">
              <a href="#">Conditions générales</a>
              <a href="#">Politique de confidentialité</a>
              <a href="#">Mentions légales</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 