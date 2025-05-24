import Payment from '../models/Payment.js';
import Order from '../models/Order.js';
import Stripe from 'stripe';
import asyncHandler from '../middleware/asyncHandler.js';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @desc    Créer un paiement
// @route   POST /api/payments
// @access  Private
export const createPayment = asyncHandler(async (req, res) => {
  const { orderId, paymentMethod, amount } = req.body;

  // Vérifier si la commande existe
  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404);
    throw new Error('Commande non trouvée');
  }

  // Créer le paiement
  const payment = new Payment({
    order: orderId,
    user: req.user._id,
    paymentMethod,
    amount,
    status: 'pending'
  });

  const createdPayment = await payment.save();

  // Mettre à jour le statut de la commande
  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = {
    id: createdPayment._id,
    status: createdPayment.status,
    update_time: Date.now(),
    email_address: req.user.email
  };

  await order.save();

  res.status(201).json(createdPayment);
});

// @desc    Obtenir les détails d'un paiement
// @route   GET /api/payments/:id
// @access  Private
export const getPaymentById = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id)
    .populate('user', 'name email')
    .populate('order');

  if (!payment) {
    res.status(404);
    throw new Error('Paiement non trouvé');
  }

  res.json(payment);
});

// @desc    Mettre à jour le statut d'un paiement
// @route   PUT /api/payments/:id
// @access  Private/Admin
export const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const payment = await Payment.findById(req.params.id);

  if (!payment) {
    res.status(404);
    throw new Error('Paiement non trouvé');
  }

  payment.status = status;
  const updatedPayment = await payment.save();

  // Si le paiement est confirmé, mettre à jour le statut de la commande
  if (status === 'completed') {
    const order = await Order.findById(payment.order);
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      await order.save();
    }
  }

  res.json(updatedPayment);
});

// @desc    Obtenir tous les paiements d'un utilisateur
// @route   GET /api/payments/user
// @access  Private
export const getUserPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find({ user: req.user._id })
    .populate('order')
    .sort({ createdAt: -1 });

  res.json(payments);
});

// @desc    Create Stripe checkout session
// @route   POST /api/payment/create-checkout-session
// @access  Private
export const createCheckoutSession = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404);
    throw new Error('Commande non trouvée');
  }

  const lineItems = order.orderItems.map(item => ({
    price_data: {
      currency: 'eur',
      product_data: {
        name: item.name,
        images: [item.image],
      },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.qty,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: `${process.env.FRONTEND_URL}/order/${order._id}?success=true`,
    cancel_url: `${process.env.FRONTEND_URL}/order/${order._id}?cancelled=true`,
    customer_email: req.user.email,
    metadata: {
      order_id: order._id.toString(),
    },
  });

  res.status(200).json({ sessionId: session.id });
}); 