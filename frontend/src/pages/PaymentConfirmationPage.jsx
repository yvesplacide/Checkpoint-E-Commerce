import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

const PaymentConfirmationPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const userInfo = useSelector((state) => state.user?.userInfo);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        setOrder(data);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération de la commande :", error);
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId, userInfo]);

  if (loading) {
    return <div className="text-center p-5">Chargement...</div>;
  }

  if (!order) {
    return <div className="text-center p-5">Commande non trouvée</div>;
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-body text-center">
              <div className="mb-4">
                <i className="fas fa-check-circle text-success" style={{ fontSize: "4rem" }}></i>
              </div>
              <h2 className="card-title mb-4">Paiement Confirmé !</h2>
              <p className="lead">Merci pour votre commande</p>
              <p>Votre numéro de commande est : #{order._id}</p>
              
              <div className="mt-4">
                <h4>Détails de la commande :</h4>
                <div className="text-start">
                  <p><strong>Adresse de livraison :</strong></p>
                  <p>{order.shippingAddress.address}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                  <p>{order.shippingAddress.country}</p>
                </div>

                <div className="mt-4">
                  <h4>Articles commandés :</h4>
                  <ul className="list-unstyled">
                    {order.orderItems.map((item) => (
                      <li key={item.product} className="mb-2">
                        {item.name} x {item.qty} = {(item.price * item.qty).toFixed(2)} €
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4">
                  <h4>Résumé :</h4>
                  <p>Sous-total : {order.itemsPrice} €</p>
                  <p>Livraison : {order.shippingPrice} €</p>
                  <p>TVA : {order.taxPrice} €</p>
                  <p className="fw-bold">Total : {order.totalPrice} €</p>
                </div>
              </div>

              <div className="mt-5">
                <button
                  onClick={() => navigate('/')}
                  className="btn btn-primary me-2"
                >
                  Retour à l'accueil
                </button>
                <button
                  onClick={() => navigate(`/order/${order._id}`)}
                  className="btn btn-outline-primary"
                >
                  Voir les détails de la commande
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmationPage; 