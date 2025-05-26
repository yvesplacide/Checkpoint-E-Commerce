import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";
import "./OrderPage.css";

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const userInfo = useSelector((state) => state.user?.userInfo);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      
      if (!userInfo?.token) {
        throw new Error("Vous devez être connecté pour voir vos commandes");
      }

      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders/myorders`, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      // Trier les commandes par date (les plus récentes en premier)
      const sortedOrders = data
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        // Ne garder que les 5 commandes les plus récentes
        .slice(0, 5);

      setOrders(sortedOrders);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error.response?.data || error);
      setError(error.response?.data?.message || error.message || "Erreur lors du chargement des commandes");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [userInfo]);

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-container">
        <div className="error-message">
          {error}
          <button 
            onClick={fetchOrders} 
            className="primary-button"
            style={{ marginTop: "1rem" }}
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="orders-container">
        <div className="empty-state">
          <h2 className="empty-state-title">Aucune commande trouvée</h2>
          <p className="empty-state-message">Vous n'avez pas encore passé de commande.</p>
          <Link to="/" className="primary-button">
            Continuer vos achats
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h1 className="orders-title">Mes commandes</h1>
        <p className="orders-subtitle">Vos 5 commandes les plus récentes</p>
      </div>
      <div className="orders-grid">
        {orders.map((order) => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <div className="order-id">Commande #{order._id}</div>
              <div className="order-date">
                {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
            <div className="order-content">
              <div className="order-info">
                <div className="info-row">
                  <span className="info-label">Statut</span>
                  <span className={`order-status status-${order.isPaid ? "paid" : "pending"}`}>
                    {order.isPaid ? "Payée" : "En attente de paiement"}
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">Total</span>
                  <span className="info-value">{order.totalPrice.toFixed(2)} €</span>
                </div>
              </div>
              <div className="order-items">
                <h3 className="items-title">Articles</h3>
                <div className="item-list">
                  {order.orderItems.map((item) => (
                    <div key={item._id} className="order-item">
                      <img src={item.image} alt={item.name} className="item-image" />
                      <div className="item-details">
                        <span className="item-name">{item.name}</span>
                        <span className="item-quantity">Quantité: {item.qty}</span>
                      </div>
                      <span className="item-price">{(item.price * item.qty).toFixed(2)} €</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="order-total">
                <div className="total-row">
                  <span className="total-label">Total</span>
                  <span className="total-value">{order.totalPrice.toFixed(2)} €</span>
                </div>
              </div>
              <Link to={`/order/${order._id}`} className="primary-button">
                Voir les détails
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderPage; 