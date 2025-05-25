import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">À propos</h3>
            <p className="footer-text">
              Votre destination shopping en ligne pour tous vos besoins.
            </p>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-title">Liens rapides</h3>
            <ul className="footer-links">
              <li><Link to="/">Accueil</Link></li>
              <li><Link to="/products">Produits</Link></li>
              <li><Link to="/cart">Panier</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Contact</h3>
            <ul className="footer-links">
              <li>Email: leboulevard@gmail.com</li>
              <li>Tél: 0779545834</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">
            © {new Date().getFullYear()} Le BOULEVARD, ta boutique en ligne. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 