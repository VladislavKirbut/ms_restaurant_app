import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUserOrders } from '../redux/slices/ordersSlice';
import { RootState, AppDispatch } from '../redux/store';
import { Package, Clock, Eye } from 'lucide-react';
import { motion } from 'motion/react';
import { LoadingSpinner } from '../components/LoadingSpinner';

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-accent bg-opacity-20 text-accent',
  CONFIRMED: 'bg-blue-500 bg-opacity-20 text-blue-500',
  PREPARING: 'bg-yellow-500 bg-opacity-20 text-yellow-500',
  READY: 'bg-purple-500 bg-opacity-20 text-purple-500',
  DELIVERED: 'bg-success bg-opacity-20 text-success',
  CANCELLED: 'bg-error bg-opacity-20 text-error',
};

export const Orders = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { orders, loading } = useSelector((state: RootState) => state.orders);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserOrders(user.id));
    }
  }, [dispatch, user?.id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-dark border border-gray-medium rounded-full p-8 mx-auto w-32 h-32 flex items-center justify-center mb-6"
          >
            <Package className="w-16 h-16 text-gray-light" />
          </motion.div>
          <h2 className="text-3xl text-secondary mb-4">No orders yet</h2>
          <p className="text-gray-light mb-8">Start your premium dining experience</p>
          <button onClick={() => navigate('/restaurants')} className="btn-primary">
            Browse Restaurants
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary">
      <div className="container-custom py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl text-accent mb-8">My Orders</h1>

          <div className="space-y-6">
            {orders
              .slice()
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card p-6"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    {/* Order Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl text-secondary mb-2">Order #{order.id}</h3>
                          <div className="flex items-center gap-2 text-gray-light text-sm">
                            <Clock className="w-4 h-4" />
                            <span>
                              {new Date(order.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`px-4 py-2 rounded-full text-sm ${
                            STATUS_COLORS[order.status]
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>

                      <div className="space-y-2 mb-4">
                        <p className="text-gray-light text-sm">
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        </p>
                        <p className="text-gray-light text-sm">
                          Delivery: {order.deliveryAddress}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-light mb-1">Total Amount</p>
                          <p className="text-2xl text-accent">${order.total.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-light mb-1">Payment</p>
                          <span
                            className={`px-3 py-1 rounded-full text-sm ${
                              order.paymentStatus === 'PAID'
                                ? 'bg-success bg-opacity-20 text-success'
                                : order.paymentStatus === 'FAILED'
                                ? 'bg-error bg-opacity-20 text-error'
                                : 'bg-accent bg-opacity-20 text-accent'
                            }`}
                          >
                            {order.paymentStatus}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex md:flex-col gap-3">
                      <button
                        onClick={() => navigate(`/order-tracking/${order.id}`)}
                        className="btn-primary flex items-center gap-2"
                      >
                        <Eye className="w-5 h-5" />
                        Track Order
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
