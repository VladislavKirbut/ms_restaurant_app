import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../redux/store';
import { createOrder } from '../redux/slices/ordersSlice';
import { clearCart } from '../redux/slices/cartSlice';
import { MapPin, CreditCard, Wallet, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

export const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { items, total, restaurantId } = useSelector((state: RootState) => state.cart);
  const { loading } = useSelector((state: RootState) => state.orders);

  const [step, setStep] = useState<'address' | 'payment'>('address');
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: user?.street || '',
    city: user?.city || '',
    state: user?.state || '',
    zip: user?.zip || '',
    country: user?.country || '',
  });
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePayment = async () => {
    if (!user || !restaurantId) return;

    const addressString = `${deliveryAddress.street}, ${deliveryAddress.city}, ${deliveryAddress.state} ${deliveryAddress.zip}, ${deliveryAddress.country}`;

    const orderData = {
      userId: user.id,
      restaurantId,
      items: items.map((item) => ({
        dishId: item.dishId,
        quantity: item.quantity,
      })),
      deliveryAddress: addressString,
    };

    const result = await dispatch(createOrder(orderData));
    
    if (result.meta.requestStatus === 'fulfilled') {
      // Navigate to payment processing
      navigate('/payment', { state: { orderId: (result.payload as any).id, paymentMethod } });
    }
  };

  const deliveryFee = 5.0;
  const serviceFee = 2.0;
  const grandTotal = total + deliveryFee + serviceFee;

  return (
    <div className="min-h-screen bg-primary">
      <div className="container-custom py-12">
        <button
          onClick={() => step === 'address' ? navigate('/cart') : setStep('address')}
          className="flex items-center gap-2 text-gray-light hover:text-accent transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Progress Steps */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step === 'address' ? 'bg-accent text-primary' : 'bg-gray-medium text-secondary'
                  }`}
                >
                  1
                </div>
                <span className={step === 'address' ? 'text-accent' : 'text-gray-light'}>
                  Delivery Address
                </span>
              </div>
              <div className="flex-1 h-px bg-gray-medium"></div>
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step === 'payment' ? 'bg-accent text-primary' : 'bg-gray-medium text-secondary'
                  }`}
                >
                  2
                </div>
                <span className={step === 'payment' ? 'text-accent' : 'text-gray-light'}>
                  Payment
                </span>
              </div>
            </div>

            {/* Address Form */}
            {step === 'address' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="card p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="w-6 h-6 text-accent" />
                  <h2 className="text-2xl text-secondary">Delivery Address</h2>
                </div>

                <form onSubmit={handleAddressSubmit} className="space-y-6">
                  <div>
                    <label className="block text-secondary mb-2">Street Address</label>
                    <input
                      type="text"
                      value={deliveryAddress.street}
                      onChange={(e) => setDeliveryAddress({ ...deliveryAddress, street: e.target.value })}
                      required
                      className="input-field"
                      placeholder="123 Main Street"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-secondary mb-2">City</label>
                      <input
                        type="text"
                        value={deliveryAddress.city}
                        onChange={(e) => setDeliveryAddress({ ...deliveryAddress, city: e.target.value })}
                        required
                        className="input-field"
                        placeholder="New York"
                      />
                    </div>
                    <div>
                      <label className="block text-secondary mb-2">State</label>
                      <input
                        type="text"
                        value={deliveryAddress.state}
                        onChange={(e) => setDeliveryAddress({ ...deliveryAddress, state: e.target.value })}
                        required
                        className="input-field"
                        placeholder="NY"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-secondary mb-2">ZIP Code</label>
                      <input
                        type="text"
                        value={deliveryAddress.zip}
                        onChange={(e) => setDeliveryAddress({ ...deliveryAddress, zip: e.target.value })}
                        required
                        className="input-field"
                        placeholder="10001"
                      />
                    </div>
                    <div>
                      <label className="block text-secondary mb-2">Country</label>
                      <input
                        type="text"
                        value={deliveryAddress.country}
                        onChange={(e) => setDeliveryAddress({ ...deliveryAddress, country: e.target.value })}
                        required
                        className="input-field"
                        placeholder="USA"
                      />
                    </div>
                  </div>

                  <button type="submit" className="w-full btn-primary">
                    Continue to Payment
                  </button>
                </form>
              </motion.div>
            )}

            {/* Payment Method */}
            {step === 'payment' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="card p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <CreditCard className="w-6 h-6 text-accent" />
                  <h2 className="text-2xl text-secondary">Payment Method</h2>
                </div>

                <div className="space-y-4 mb-8">
                  <div
                    onClick={() => setPaymentMethod('card')}
                    className={`p-6 border-2 rounded-lg transition-all cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'border-accent bg-accent bg-opacity-10'
                        : 'border-gray-medium hover:border-accent'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <CreditCard className="w-6 h-6 text-accent" />
                      <div>
                        <h3 className="text-secondary text-lg">Credit/Debit Card</h3>
                        <p className="text-gray-light text-sm">Pay securely with your card</p>
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-6 border-2 rounded-lg transition-all cursor-pointer ${
                      paymentMethod === 'cash'
                        ? 'border-accent bg-accent bg-opacity-10'
                        : 'border-gray-medium hover:border-accent'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <Wallet className="w-6 h-6 text-accent" />
                      <div>
                        <h3 className="text-secondary text-lg">Cash on Delivery</h3>
                        <p className="text-gray-light text-sm">Pay when you receive your order</p>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full btn-primary disabled:opacity-50"
                >
                  {loading ? 'Processing...' : `Place Order - $${grandTotal.toFixed(2)}`}
                </button>
              </motion.div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="text-2xl text-secondary mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.dishId} className="flex justify-between text-gray-light">
                    <span>
                      {item.quantity}x {item.name}
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="h-px bg-gray-medium"></div>
                <div className="flex justify-between text-gray-light">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-light">
                  <span>Delivery Fee</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-light">
                  <span>Service Fee</span>
                  <span>${serviceFee.toFixed(2)}</span>
                </div>
                <div className="h-px bg-gray-medium"></div>
                <div className="flex justify-between text-secondary text-xl">
                  <span>Total</span>
                  <span className="text-accent">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {step === 'payment' && (
                <div className="bg-gray-medium bg-opacity-30 p-4 rounded-lg">
                  <p className="text-xs text-gray-light mb-1">Delivering to:</p>
                  <p className="text-sm text-secondary">
                    {deliveryAddress.street}, {deliveryAddress.city}, {deliveryAddress.state} {deliveryAddress.zip}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
