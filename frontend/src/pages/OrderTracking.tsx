import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrder } from '../redux/slices/ordersSlice';
import { RootState, AppDispatch } from '../redux/store';
import { CheckCircle, Clock, ChefHat, Truck, Package, Home } from 'lucide-react';
import { motion } from 'motion/react';
import { LoadingSpinner } from '../components/LoadingSpinner';

const ORDER_STATUSES = [
  { key: 'PENDING', label: 'Order Placed', icon: Package },
  { key: 'CONFIRMED', label: 'Confirmed', icon: CheckCircle },
  { key: 'PREPARING', label: 'Preparing', icon: ChefHat },
  { key: 'READY', label: 'Out for Delivery', icon: Truck },
  { key: 'DELIVERED', label: 'Delivered', icon: Home },
];

export const OrderTracking = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { currentOrder } = useSelector((state: RootState) => state.orders);
  const [isPolling, setIsPolling] = useState(true);

  useEffect(() => {
    if (!id) {
      navigate('/orders');
      return;
    }

    // Initial fetch
    dispatch(fetchOrder(id));

    // Poll for updates every 5 seconds
    const interval = setInterval(() => {
      if (isPolling) {
        dispatch(fetchOrder(id));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [id, dispatch, navigate, isPolling]);

  useEffect(() => {
    // Stop polling if order is delivered or cancelled
    if (currentOrder?.status === 'DELIVERED' || currentOrder?.status === 'CANCELLED') {
      setIsPolling(false);
    }
  }, [currentOrder?.status]);

  if (!currentOrder) {
    return <LoadingSpinner />;
  }

  const currentStatusIndex = ORDER_STATUSES.findIndex((s) => s.key === currentOrder.status);
  const isCancelled = currentOrder.status === 'CANCELLED';

  return (
    <div className="min-h-screen bg-primary">
      <div className="container-custom py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl text-accent mb-4">Track Your Order</h1>
              <p className="text-gray-light">Order ID: #{currentOrder.id}</p>
              <p className="text-secondary mt-2">
                {new Date(currentOrder.createdAt).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            {/* Order Status Timeline */}
            {!isCancelled ? (
              <div className="card p-8 mb-8">
                <div className="relative">
                  {ORDER_STATUSES.map((status, index) => {
                    const Icon = status.icon;
                    const isCompleted = index <= currentStatusIndex;
                    const isCurrent = index === currentStatusIndex;

                    return (
                      <div key={status.key} className="relative">
                        <div className="flex items-center gap-6 mb-8 last:mb-0">
                          {/* Icon */}
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className={`w-16 h-16 rounded-full flex items-center justify-center relative z-10 ${
                              isCompleted
                                ? 'bg-accent text-primary'
                                : 'bg-gray-medium text-gray-light'
                            } ${isCurrent ? 'ring-4 ring-accent ring-opacity-30' : ''}`}
                          >
                            <Icon className="w-8 h-8" />
                          </motion.div>

                          {/* Label */}
                          <div className="flex-1">
                            <h3
                              className={`text-xl ${
                                isCompleted ? 'text-accent' : 'text-gray-light'
                              }`}
                            >
                              {status.label}
                            </h3>
                            {isCurrent && (
                              <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-sm text-gray-light mt-1"
                              >
                                In progress...
                              </motion.p>
                            )}
                          </div>

                          {/* Time indicator */}
                          {isCurrent && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="flex items-center gap-2 text-accent"
                            >
                              <Clock className="w-5 h-5 animate-pulse" />
                              <span>Now</span>
                            </motion.div>
                          )}
                        </div>

                        {/* Connecting line */}
                        {index < ORDER_STATUSES.length - 1 && (
                          <div
                            className={`absolute left-8 top-16 w-0.5 h-8 -translate-x-1/2 ${
                              index < currentStatusIndex ? 'bg-accent' : 'bg-gray-medium'
                            }`}
                          ></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="card p-8 mb-8 text-center">
                <div className="bg-error bg-opacity-20 p-8 rounded-full mx-auto w-32 h-32 flex items-center justify-center mb-6 border-4 border-error">
                  <span className="text-6xl">✕</span>
                </div>
                <h2 className="text-3xl text-error mb-4">Order Cancelled</h2>
                <p className="text-gray-light">This order has been cancelled</p>
              </div>
            )}

            {/* Order Details */}
            <div className="card p-8">
              <h2 className="text-2xl text-secondary mb-6">Order Details</h2>

              <div className="space-y-4 mb-6">
                {currentOrder.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-secondary">
                    <span>
                      {item.quantity}x Item
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="h-px bg-gray-medium"></div>
                <div className="flex justify-between text-secondary text-xl">
                  <span>Total</span>
                  <span className="text-accent">${currentOrder.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-gray-medium bg-opacity-30 p-4 rounded-lg mb-6">
                <p className="text-xs text-gray-light mb-1">Delivery Address:</p>
                <p className="text-sm text-secondary">{currentOrder.deliveryAddress}</p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-light mb-1">Payment Status:</p>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      currentOrder.paymentStatus === 'PAID'
                        ? 'bg-success bg-opacity-20 text-success'
                        : currentOrder.paymentStatus === 'FAILED'
                        ? 'bg-error bg-opacity-20 text-error'
                        : 'bg-accent bg-opacity-20 text-accent'
                    }`}
                  >
                    {currentOrder.paymentStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex gap-4">
              <button onClick={() => navigate('/orders')} className="flex-1 btn-secondary">
                View All Orders
              </button>
              <button onClick={() => navigate('/restaurants')} className="flex-1 btn-primary">
                Order Again
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
