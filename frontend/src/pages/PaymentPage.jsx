import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import {
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

const PaymentPage = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
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
        setError("Impossible de charger les détails de la commande");
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId, userInfo]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
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

      // Créer le paiement
      const { data } = await axios.post(
        'http://localhost:5000/api/payments',
        {
          orderId: order._id,
          paymentMethod: 'Carte de crédit',
          amount: order.totalPrice,
          paymentDetails: {
            paymentMethodId: paymentMethod.id,
            paymentMethodType: paymentMethod.type,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      // Rediriger vers la page de confirmation
      navigate(`/payment-confirmation/${order._id}`);
    } catch (err) {
      setError("Une erreur s'est produite lors du traitement du paiement");
      setProcessing(false);
    }
  };

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
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Paiement</h2>
              
              <div className="mb-4">
                <h4>Résumé de la commande</h4>
                <p>Total à payer : {order.totalPrice} €</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label">Détails de la carte</label>
                  <div className="p-3 border rounded">
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
                    />
                  </div>
                </div>

                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={!stripe || processing}
                >
                  {processing ? 'Traitement en cours...' : 'Payer maintenant'}
                </button>
              </form>

              <div className="mt-4 text-center">
                <button
                  onClick={() => navigate(`/order/${order._id}`)}
                  className="btn btn-outline-secondary"
                >
                  Retour à la commande
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage; 