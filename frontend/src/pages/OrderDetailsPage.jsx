import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import "./OrderDetailsPage.css";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingPayment, setProcessingPayment] = useState(false);
  const userInfo = useSelector((state) => state.user?.userInfo);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        setOrder(data);
        setLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || "Erreur lors du chargement de la commande");
        setLoading(false);
      }
    };

    if (userInfo) {
      fetchOrder();
    }
  }, [id, userInfo]);

  const handlePayment = async () => {
    try {
      setProcessingPayment(true);
      setError("");

      // Créer d'abord le paiement
      const { data: paymentData } = await axios.post(
        "http://localhost:5000/api/payments",
        {
          orderId: order._id,
          amount: order.totalPrice,
          paymentMethod: "Carte de crédit"
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      // Mettre à jour le statut de la commande
      const { data: updatedOrder } = await axios.put(
        `http://localhost:5000/api/orders/${id}/pay`,
        {
          paymentId: paymentData._id,
          status: "pending"
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      setOrder(updatedOrder);
      navigate(`/payment/${id}`, { 
        state: { 
          paymentId: paymentData._id,
          amount: order.totalPrice
        }
      });
    } catch (error) {
      setError(error.response?.data?.message || "Erreur lors du traitement du paiement");
      setProcessingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-details-container">
        <div className="error-message">
          {error}
          <button 
            onClick={() => setError("")} 
            className="primary-button"
            style={{ marginTop: "1rem" }}
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return <div className="error-message">Commande non trouvée</div>;
  }

  return (
    <div className="order-details-container">
      <div className="order-details-header">
        <h1 className="order-details-title">Détails de la commande</h1>
        <button onClick={() => navigate(-1)} className="back-button">
          Retour
        </button>
      </div>
      <div className="order-details-grid">
        <div className="order-details-card">
          <div className="order-details-header">
            <div className="order-id">Commande #{order._id}</div>
            <div className="order-date">
              {new Date(order.createdAt).toLocaleDateString()}
            </div>
          </div>
          <div className="order-details-content">
            <div className="order-info">
              <div className="info-row">
                <span className="info-label">Statut</span>
                <span className={`order-status status-${order.isPaid ? "paid" : "pending"}`}>
                  {order.isPaid ? "Payée" : "En attente de paiement"}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Méthode de paiement</span>
                <span className="info-value">{order.paymentMethod}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Adresse de livraison</span>
                <span className="info-value">
                  {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                  {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                </span>
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
                    <span className="item-price">{item.price} €</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-total">
              <div className="total-row">
                <span className="total-label">Sous-total</span>
                <span className="total-value">{order.itemsPrice} €</span>
              </div>
              <div className="total-row">
                <span className="total-label">Frais de livraison</span>
                <span className="total-value">{order.shippingPrice} €</span>
              </div>
              <div className="total-row">
                <span className="total-label">TVA</span>
                <span className="total-value">{order.taxPrice} €</span>
              </div>
              <div className="total-row">
                <span className="total-label">Total</span>
                <span className="total-value">{order.totalPrice} €</span>
              </div>
            </div>
            {!order.isPaid && (
              <div className="payment-section">
                <h3 className="payment-title">Paiement</h3>
                <div className="payment-info">
                  <div className="payment-row">
                    <span className="payment-label">Statut du paiement</span>
                    <span className="payment-value">En attente</span>
                  </div>
                </div>
                <button 
                  onClick={handlePayment} 
                  className="payment-button"
                  disabled={processingPayment}
                >
                  {processingPayment ? "Traitement en cours..." : "Procéder au paiement"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
