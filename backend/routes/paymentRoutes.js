import express from 'express';
import { 
  createCheckoutSession, 
  createPayment, 
  getPaymentById, 
  updatePaymentStatus, 
  getUserPayments 
} from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route pour créer une session de paiement Stripe
router.post('/create-checkout-session', protect, createCheckoutSession);

// Route pour créer un paiement
router.post('/', protect, createPayment);

// Route pour obtenir un paiement par ID
router.get('/:id', protect, getPaymentById);

// Route pour mettre à jour le statut d'un paiement
router.put('/:id', protect, updatePaymentStatus);

// Route pour obtenir tous les paiements d'un utilisateur
router.get('/user', protect, getUserPayments);

export default router;
