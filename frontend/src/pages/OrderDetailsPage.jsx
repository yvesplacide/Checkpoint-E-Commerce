import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("PayPal");
  const userInfo = useSelector((state) => state.user?.userInfo);

  if (!userInfo) {
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        setOrder(data);
      } catch (error) {
        console.error("Erreur lors de la récupération de la commande :", error);
      }
    };

    fetchOrder();
  }, [id, userInfo]);

  const handlePayment = async () => {
    try {
      if (paymentMethod === "Carte de crédit") {
        // Rediriger vers la page de paiement Stripe
        navigate(`/payment/${order._id}`);
      } else {
        // Pour PayPal et virement bancaire, créer directement le paiement
        const { data } = await axios.post(
          "http://localhost:5000/api/payments",
          {
            orderId: order._id,
            paymentMethod,
            amount: order.totalPrice
          },
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );

        // Rediriger vers la page de confirmation
        navigate(`/payment-confirmation/${order._id}`);
      }
    } catch (error) {
      console.error("Erreur de paiement :", error);
      alert("Erreur lors du paiement. Veuillez réessayer.");
    }
  };

  if (!order) {
    return <p>Chargement de la commande...</p>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Commande #{order._id}</h2>
      <p><strong>Adresse :</strong> {order.shippingAddress?.address}</p>
      <p><strong>Ville :</strong> {order.shippingAddress?.city}</p>
      <p><strong>Code postal :</strong> {order.shippingAddress?.postalCode}</p>
      <p><strong>Pays :</strong> {order.shippingAddress?.country}</p>
      <h3>Détails des articles :</h3>
      <ul>
        {order.orderItems.map((item) => (
          <li key={item.product}>
            {item.name} x {item.qty} = {(item.price * item.qty).toFixed(2)} €
          </li>
        ))}
      </ul>
      <h3>Résumé :</h3>
      <p>Sous-total : {order.itemsPrice} €</p>
      <p>Livraison : {order.shippingPrice} €</p>
      <p>TVA : {order.taxPrice} €</p>
      <h3>Total : {order.totalPrice} €</h3>

      <div style={{ marginTop: 20 }}>
        <h3>Méthode de paiement :</h3>
        <select 
          value={paymentMethod} 
          onChange={(e) => setPaymentMethod(e.target.value)}
          style={{ padding: "8px", marginBottom: "10px" }}
        >
          <option value="PayPal">PayPal</option>
          <option value="Carte de crédit">Carte de crédit</option>
          <option value="Virement bancaire">Virement bancaire</option>
        </select>
        <br />
        <button 
          onClick={handlePayment} 
          style={{ 
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Procéder au paiement
        </button>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
