import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import {
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import './PaymentPage.css';

const PaymentPage = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    phone: ''
  });
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

    if (orderId) {
      fetchOrder();
    }
  }, [orderId, userInfo]);

  const handleShippingChange = (e) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);
    setError(null);

    if (!stripe || !elements) {
      setError("Stripe n'est pas initialisé");
      setProcessing(false);
      return;
    }

    const requiredFields = ['fullName', 'address', 'city', 'postalCode', 'country', 'phone'];
    const missingFields = requiredFields.filter(field => !shippingInfo[field]);
    
    if (missingFields.length > 0) {
      setError("Veuillez remplir tous les champs de livraison");
      setProcessing(false);
      return;
    }

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      });

      if (error) {
        setError(error.message);
        setProcessing(false);
        return;
      }

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/payments`,
        {
          orderId: order._id,
          paymentMethod: 'Carte de crédit',
          amount: order.totalPrice,
          paymentDetails: {
            paymentMethodId: paymentMethod.id,
            paymentMethodType: paymentMethod.type,
          },
          shippingInfo: shippingInfo
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      setPaymentSuccess(true);
      setTimeout(() => {
        navigate(`/payment-confirmation/${order._id}`);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Une erreur s'est produite lors du traitement du paiement");
      setProcessing(false);
    }
  };

  const handleCardChange = (event) => {
    setCardComplete(event.complete);
    if (event.error) {
      setError(event.error.message);
    } else {
      setError(null);
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="payment-container">
        <div className="payment-card">
          <div className="payment-content">
            <div className="error-message">Commande non trouvée</div>
          </div>
        </div>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="payment-container">
        <div className="payment-card">
          <div className="payment-content success-container">
            <div className="success-icon">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="success-title">Paiement réussi !</h2>
            <p className="success-message">Votre commande a été confirmée.</p>
            <p className="success-message">Redirection en cours...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-container">
      <div className="payment-card">
        <div className="payment-content">
          <h2 className="payment-title">Paiement et Livraison</h2>
          
          <div className="order-summary">
            <h3 className="order-summary-title">Résumé de la commande</h3>
            <div className="order-summary-box">
              <p className="order-number">Commande #{order._id}</p>
              <p className="order-total">
                Total à payer : {order.totalPrice.toFixed(2)} €
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h3 className="form-section-title">Informations de livraison</h3>
              
              <div className="form-group">
                <label className="form-label">Nom complet</label>
                <input
                  type="text"
                  name="fullName"
                  value={shippingInfo.fullName}
                  onChange={handleShippingChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Adresse</label>
                <input
                  type="text"
                  name="address"
                  value={shippingInfo.address}
                  onChange={handleShippingChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Ville</label>
                  <input
                    type="text"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleShippingChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Code postal</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={shippingInfo.postalCode}
                    onChange={handleShippingChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Pays</label>
                <input
                  type="text"
                  name="country"
                  value={shippingInfo.country}
                  onChange={handleShippingChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Téléphone</label>
                <input
                  type="tel"
                  name="phone"
                  value={shippingInfo.phone}
                  onChange={handleShippingChange}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-section">
              <h3 className="form-section-title">Informations de paiement</h3>
              
              <div className="form-group">
                <label className="form-label">Détails de la carte</label>
                <div className="card-element-container">
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: '16px',
                          color: '#424770',
                          '::placeholder': {
                            color: '#aab7c4',
                          },
                        },
                        invalid: {
                          color: '#9e2146',
                        },
                      },
                    }}
                    onChange={handleCardChange}
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <div className="button-group">
              <button
                type="submit"
                disabled={!stripe || processing || !cardComplete}
                className="submit-button"
              >
                {processing ? (
                  <div className="loading-spinner">
                    <div className="spinner"></div>
                    Traitement en cours...
                  </div>
                ) : (
                  'Payer maintenant'
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate("/placeorder")}
                className="back-button"
              >
                Retour à la commande
              </button>
            </div>
          </form>

          <div className="test-info">
            <p>Testez avec la carte : 4242 4242 4242 4242</p>
            <p>Date d'expiration : N'importe quelle date future</p>
            <p>CVC : N'importe quel code à 3 chiffres</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage; 