import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import './PaymentConfirmationPage.css';

const PaymentConfirmationPage = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userInfo = useSelector((state) => state.user?.userInfo);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        setOrder(data);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération de la commande :", error);
        setError("Impossible de charger les détails de la commande");
        setLoading(false);
      }
    };

    if (orderId && userInfo) {
      fetchOrder();
    } else {
      setError("Vous devez être connecté pour voir les détails de la commande");
      setLoading(false);
    }
  }, [orderId, userInfo]);

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="confirmation-container">
        <div className="confirmation-card">
          <div className="confirmation-content">
            <div className="error-message">{error}</div>
            <div className="button-group">
              <Link to="/orders" className="primary-button">
                Voir mes commandes
              </Link>
              <button
                onClick={() => navigate('/')}
                className="secondary-button"
              >
                Retour à l'accueil
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="confirmation-container">
      <div className="confirmation-card">
        <div className="confirmation-content">
          <div className="success-icon">✓</div>
          <h1 className="confirmation-title">Paiement confirmé !</h1>
          <p className="confirmation-message">
            Votre commande #{order._id} a été confirmée avec succès.
          </p>
          
          <div className="order-summary">
            <h2>Récapitulatif de la commande</h2>
            <div className="order-details">
              <p><strong>Date :</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
              <p><strong>Total :</strong> {order.totalPrice} €</p>
              <p><strong>Statut :</strong> {order.isPaid ? "Payée" : "En attente de paiement"}</p>
            </div>
          </div>

          <div className="button-group">
            <Link to="/orders" className="primary-button">
              Voir toutes mes commandes
            </Link>
            <button
              onClick={() => navigate('/')}
              className="secondary-button"
            >
              Continuer mes achats
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmationPage; 