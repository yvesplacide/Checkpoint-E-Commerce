import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import "./PlaceOrderPage.css";
import { useDispatch } from "react-redux";
import { clearCart } from "../slices/cartSlice"; // adapte ce chemin si besoin




const PlaceOrderPage = () => {
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);
  const userInfo = useSelector((state) => state.user?.userInfo);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

const cancelOrderHandler = () => {
  if (window.confirm("Êtes-vous sûr de vouloir annuler cette commande ?")) {
    dispatch(clearCart());
    navigate("/");
  }
};

  if (!userInfo) {
    return <Navigate to="/login" state={{ from: "/placeorder" }} />;
  }

  if (cartItems.length === 0) {
    return <Navigate to="/" />;
  }

  const shippingAddress = {
    address: "10 rue du code",
    city: "Paris",
    postalCode: "75000",
    country: "France",
  };

  const paymentMethod = "PayPal";

  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxPrice = Number((0.2 * itemsPrice).toFixed(2));
  const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2);

  const placeOrderHandler = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await axios.post(
        "http://localhost:5000/api/orders",
        {
          orderItems: cartItems.map((item) => ({
            name: item.title,
            image: item.image,
            qty: item.qty,
            price: item.price,
            product: item._id,
          })),
          shippingAddress,
          paymentMethod,
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      navigate(`/order/${data._id}`);
    } catch (error) {
      setError(error.response?.data?.message || "Erreur lors de la création de la commande");
      setLoading(false);
    }
  };

  return (
    <div className="place-order-container">
      <div className="place-order-header">
        <h1 className="place-order-title">Valider la commande</h1>
        <p className="place-order-subtitle">Vérifiez les détails de votre commande avant de la confirmer</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="place-order-grid">
        <div className="order-details-card">
          <div className="order-details-header">
            <h2 className="order-details-title">Détails de la commande</h2>
          </div>
          <div className="order-details-section">
            <h3 className="section-title">Articles</h3>
            <div className="section-content">
              {cartItems.map((item) => (
                <div key={item._id} className="order-item">
                  <img src={item.image} alt={item.name} className="item-image" />
                  <div className="item-details">
                    <span className="item-name">{item.title}</span>
                    <span className="item-quantity">Quantité: {item.qty}</span>
                  </div>
                  <span className="item-price">{(item.price * item.qty).toFixed(2)} €</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="order-summary-card">
          <div className="order-summary-header">
            <h2 className="order-summary-title">Récapitulatif</h2>
          </div>
          <div className="order-total">
            <div className="total-row">
              <span>Sous-total</span>
              <span>{itemsPrice.toFixed(2)} €</span>
            </div>
            <div className="total-row">
              <span>Livraison</span>
              <span>{shippingPrice.toFixed(2)} €</span>
            </div>
            <div className="total-row">
              <span>TVA</span>
              <span>{taxPrice.toFixed(2)} €</span>
            </div>
            <div className="total-row">
              <span>Total</span>
              <span>{totalPrice} €</span>
            </div>
          </div>
          <button 
            onClick={placeOrderHandler} 
            disabled={loading}
            className="place-order-btn"
          >
            {loading ? "Traitement en cours..." : "Passer la commande"}
          </button>
          <button 
           onClick={cancelOrderHandler}
            className="cancel-order-btn"
           > 
          Annuler la commande
          </button>

        </div>
      </div>
    </div>
  );
};

export default PlaceOrderPage;
