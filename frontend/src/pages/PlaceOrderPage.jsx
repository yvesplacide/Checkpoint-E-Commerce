import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

const PlaceOrderPage = () => {
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);
  const userInfo = useSelector((state) => state.user?.userInfo);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    <div style={{ padding: 20 }}>
      <h2>Valider la commande</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      
      <div>
        <h3>Récapitulatif de votre commande</h3>
        {cartItems.map((item) => (
          <div key={item._id} style={{ marginBottom: "10px" }}>
            {item.title} x {item.qty} = {item.price * item.qty} €
          </div>
        ))}
        <hr />
        <p>Sous-total : {itemsPrice} €</p>
        <p>Livraison : {shippingPrice} €</p>
        <p>TVA : {taxPrice} €</p>
        <h3>Total : {totalPrice} €</h3>
        <button 
          onClick={placeOrderHandler} 
          disabled={loading}
          style={{ 
            padding: "10px 20px", 
            fontSize: "1.1em",
            backgroundColor: loading ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Traitement en cours..." : "Passer la commande"}
        </button>
      </div>
    </div>
  );
};

export default PlaceOrderPage;
