import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateCartItemQuantity } from "../slices/cartSlice";
// import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./CartPage.css";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const { cartItems } = useSelector((state) => state.cart);
  // Temporairement commenté jusqu'à ce que l'authentification soit implémentée
   const { userInfo } = useSelector((state) => state.user);

  const removeItem = (id) => {
    dispatch(removeFromCart(id));
  };

  const updateQuantity = (id, qty) => {
    if (qty < 1) return;
    dispatch(updateCartItemQuantity({ id, qty }));
  };

  const getTotal = () =>
    cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2);

  const handleOrder = async () => {
    try {
      // Temporairement commenté jusqu'à ce que l'authentification soit implémentée
      /*
      if (!userInfo) {
        setError("Veuillez vous connecter pour passer une commande");
        setTimeout(() => navigate("/login"), 2000);
        return;
      }
      */

      if (cartItems.length === 0) {
        setError("Votre panier est vide");
        return;
      }

      // Temporairement commenté jusqu'à ce que le backend soit prêt
      /*
      const order = {
        orderItems: cartItems,
        shippingAddress: {
          address: "123 rue de Paris",
          city: "Paris",
          postalCode: "75000",
          country: "France"
        },
        paymentMethod: "PayPal",
        itemsPrice: getTotal(),
        shippingPrice: 5,
        taxPrice: 2,
        totalPrice: parseFloat(getTotal()) + 5 + 2
      };

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`
        }
      };

      const { data } = await axios.post("/api/orders", order, config);
      navigate(`/order/${data._id}`);
      */

      // Redirection temporaire vers la page de commande
      navigate("/placeorder");
      
    } catch (error) {
      setError(
        error.response?.data?.message || 
        "Une erreur est survenue lors de la création de la commande"
      );
    }
  };

  return (
    <div className="container mt-4">
      <div className="cart-page" style={{
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        padding: "2rem"
      }}>
        <h2 style={{
          color: "var(--primary-color)",
          marginBottom: "2rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem"
        }}>
          <span>🛒</span> Mon Panier
        </h2>

        {error && (
          <div className="alert alert-error mb-3">
            {error}
          </div>
        )}

        {cartItems.length === 0 ? (
          <div className="empty-cart" style={{
            textAlign: "center",
            padding: "3rem 0"
          }}>
            <p style={{ fontSize: "1.2rem", color: "#666" }}>Votre panier est vide.</p>
            <button 
              className="btn btn-primary mt-3"
              onClick={() => navigate("/")}
            >
              Continuer mes achats
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item._id} className="cart-item" style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "1rem",
                  backgroundColor: "white",
                  marginBottom: "1rem",
                  borderRadius: "8px",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                  transition: "transform 0.2s ease"
                }}>
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "4px"
                    }} 
                  />
                  <div style={{ marginLeft: "1.5rem", flex: 1 }}>
                    <h4 style={{ margin: "0 0 0.5rem 0" }}>{item.title}</h4>
                    <p style={{ color: "#666", margin: "0.25rem 0" }}>
                      Prix: <span style={{ color: "var(--primary-color)", fontWeight: "bold" }}>{item.price} €</span>
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <button 
                          className="btn btn-secondary"
                          style={{ padding: "0.25rem 0.5rem" }}
                          onClick={() => updateQuantity(item._id, item.qty - 1)}
                        >
                          -
                        </button>
                        <span style={{ fontWeight: "bold" }}>{item.qty}</span>
                        <button 
                          className="btn btn-secondary"
                          style={{ padding: "0.25rem 0.5rem" }}
                          onClick={() => updateQuantity(item._id, item.qty + 1)}
                        >
                          +
                        </button>
                      </div>
                      <button 
                        onClick={() => removeItem(item._id)}
                        className="btn btn-secondary"
                        style={{ padding: "0.25rem 0.75rem", fontSize: "0.9rem" }}
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary" style={{
              marginTop: "2rem",
              padding: "1.5rem",
              backgroundColor: "var(--light-gray)",
              borderRadius: "8px"
            }}>
              <h3 style={{ marginBottom: "1rem" }}>Récapitulatif de la commande</h3>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span>Sous-total</span>
                <span>{getTotal()} €</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span>Frais de livraison</span>
                <span>5.00 €</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span>TVA</span>
                <span>2.00 €</span>
              </div>
              <hr style={{ margin: "1rem 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
                <span>Total</span>
                <span style={{ color: "var(--primary-color)" }}>
                  {(parseFloat(getTotal()) + 7).toFixed(2)} €
                </span>
              </div>
            </div>

            <div style={{ marginTop: "2rem", display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
              <button 
                className="btn btn-secondary"
                onClick={() => navigate("/")}
              >
                Continuer mes achats
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleOrder}
              >
                Passer la commande
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;
