import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import HomePage from "./pages/HomePage";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import RegisterPage from "./pages/RegisterPage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import PlaceOrderPage from "./pages/PlaceOrderPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import PaymentPage from './pages/PaymentPage';
import PaymentConfirmationPage from './pages/PaymentConfirmationPage';
import OrderPage from './pages/OrderPage';
import { useDispatch } from "react-redux";
import { setUserInfo } from "./slices/userSlice";
import { useEffect } from "react";

// Initialiser Stripe avec votre clé publique
const stripePromise = loadStripe('pk_test_51RQv2IQxnVkPi1wYE8ABztp6T4R8Ypab4kKDb56Vz3Za17zeOlFMyNYZhETqz7sKXqJ8cmY6MvmaQDH9g3dlObVr008wt3Tj7A');

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      dispatch(setUserInfo(JSON.parse(storedUser)));
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <main className="flex-grow">
          <Elements stripe={stripePromise}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/placeorder" element={<PlaceOrderPage />} />
              <Route path="/order/:id" element={<OrderDetailsPage />} />
              <Route path="/orders" element={<OrderPage />} />
              <Route path="/payment/:orderId" element={<PaymentPage />} />
              <Route path="/payment-confirmation/:orderId" element={<PaymentConfirmationPage />} />
            </Routes>
          </Elements>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
