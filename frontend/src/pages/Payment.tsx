import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { updateOrderPaymentStatus } from '../redux/slices/ordersSlice';
import { clearCart } from '../redux/slices/cartSlice';
import { CreditCard, CheckCircle, Loader } from 'lucide-react';
import { motion } from 'motion/react';

export const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  
  const { orderId, paymentMethod } = location.state || {};
  const [processing, setProcessing] = useState(true);
  const [success, setSuccess] = useState(false);

  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  useEffect(() => {
    if (!orderId) {
      navigate('/cart');
      return;
    }

    // Simulate payment processing for cash on delivery
    if (paymentMethod === 'cash') {
      setTimeout(() => {
        setProcessing(false);
        setSuccess(true);
        dispatch(updateOrderPaymentStatus({ id: orderId, paymentStatus: 'PENDING' }));
        dispatch(clearCart());
      }, 2000);
    }
  }, [orderId, paymentMethod, navigate, dispatch]);

  const handleCardPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      dispatch(updateOrderPaymentStatus({ id: orderId, paymentStatus: 'PAID' }));
      dispatch(clearCart());
    }, 2000);
  };

  const handleContinue = () => {
    navigate(`/order-tracking/${orderId}`);
  };

  if (processing) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="bg-accent p-8 rounded-full mx-auto w-32 h-32 flex items-center justify-center mb-6">
            <Loader className="w-16 h-16 text-primary animate-spin" />
          </div>
          <h2 className="text-3xl text-secondary mb-4">Processing Payment</h2>
          <p className="text-gray-light">Please wait while we process your payment...</p>
        </motion.div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="bg-success bg-opacity-20 p-8 rounded-full mx-auto w-32 h-32 flex items-center justify-center mb-6 border-4 border-success"
          >
            <CheckCircle className="w-16 h-16 text-success" />
          </motion.div>
          <h2 className="text-3xl text-accent mb-4">Payment Successful!</h2>
          <p className="text-gray-light mb-2">Your order has been placed successfully</p>
          <p className="text-secondary mb-8">Order ID: #{orderId}</p>
          <button onClick={handleContinue} className="btn-primary">
            Track Your Order
          </button>
        </motion.div>
      </div>
    );
  }

  // Card payment form (only shown for card payment method)
  if (paymentMethod === 'card') {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="w-full max-w-md px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-accent p-3 rounded-full">
                <CreditCard className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl text-secondary">Card Payment</h2>
            </div>

            <form onSubmit={handleCardPayment} className="space-y-6">
              <div>
                <label className="block text-secondary mb-2">Card Number</label>
                <input
                  type="text"
                  value={cardDetails.cardNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
                    if (value.replace(/\s/g, '').length <= 16) {
                      setCardDetails({ ...cardDetails, cardNumber: value });
                    }
                  }}
                  required
                  className="input-field"
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                />
              </div>

              <div>
                <label className="block text-secondary mb-2">Cardholder Name</label>
                <input
                  type="text"
                  value={cardDetails.cardName}
                  onChange={(e) => setCardDetails({ ...cardDetails, cardName: e.target.value })}
                  required
                  className="input-field"
                  placeholder="John Doe"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-secondary mb-2">Expiry Date</label>
                  <input
                    type="text"
                    value={cardDetails.expiryDate}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, '');
                      if (value.length >= 2) {
                        value = value.slice(0, 2) + '/' + value.slice(2, 4);
                      }
                      setCardDetails({ ...cardDetails, expiryDate: value });
                    }}
                    required
                    className="input-field"
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                </div>
                <div>
                  <label className="block text-secondary mb-2">CVV</label>
                  <input
                    type="text"
                    value={cardDetails.cvv}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 3) {
                        setCardDetails({ ...cardDetails, cvv: value });
                      }
                    }}
                    required
                    className="input-field"
                    placeholder="123"
                    maxLength={3}
                  />
                </div>
              </div>

              <div className="bg-gray-medium bg-opacity-30 p-4 rounded-lg">
                <p className="text-xs text-gray-light">
                  Your payment information is encrypted and secure
                </p>
              </div>

              <button type="submit" className="w-full btn-primary">
                Pay Now
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    );
  }

  return null;
};
