import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../redux/store';
import { removeFromCart, updateQuantity } from '../redux/slices/cartSlice';
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, total } = useSelector((state: RootState) => state.cart);

  const handleQuantityChange = (dishId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      dispatch(removeFromCart(dishId));
    } else {
      dispatch(updateQuantity({ dishId, quantity: newQuantity }));
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-dark border border-gray-medium rounded-full p-8 mx-auto w-32 h-32 flex items-center justify-center mb-6"
          >
            <ShoppingCart className="w-16 h-16 text-gray-light" />
          </motion.div>
          <h2 className="text-3xl text-secondary mb-4">Your cart is empty</h2>
          <p className="text-gray-light mb-8">Add some delicious items to get started</p>
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
          <h1 className="text-4xl text-accent mb-2">Your Cart</h1>
          <p className="text-gray-light mb-8">
            Order from: <span className="text-accent">{items[0]?.restaurantName}</span>
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, index) => (
                <motion.div
                  key={item.dishId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card p-6"
                >
                  <div className="flex gap-6">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-32 h-32 object-cover rounded-lg"
                    />

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl text-secondary mb-2">{item.name}</h3>
                          <p className="text-accent text-lg">${item.price.toFixed(2)}</p>
                        </div>
                        <button
                          onClick={() => dispatch(removeFromCart(item.dishId))}
                          className="text-error hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleQuantityChange(item.dishId, item.quantity - 1)}
                          className="w-10 h-10 bg-gray-medium rounded-full flex items-center justify-center hover:bg-accent hover:text-primary transition-colors"
                        >
                          <Minus className="w-5 h-5" />
                        </button>
                        <span className="text-xl text-secondary w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.dishId, item.quantity + 1)}
                          className="w-10 h-10 bg-gray-medium rounded-full flex items-center justify-center hover:bg-accent hover:text-primary transition-colors"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                        <div className="ml-auto">
                          <p className="text-secondary">
                            Subtotal:{' '}
                            <span className="text-accent text-xl">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="card p-6 sticky top-24"
              >
                <h2 className="text-2xl text-secondary mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-light">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-light">
                    <span>Delivery Fee</span>
                    <span>$5.00</span>
                  </div>
                  <div className="flex justify-between text-gray-light">
                    <span>Service Fee</span>
                    <span>$2.00</span>
                  </div>
                  <div className="h-px bg-gray-medium"></div>
                  <div className="flex justify-between text-secondary text-xl">
                    <span>Total</span>
                    <span className="text-accent">${(total + 7).toFixed(2)}</span>
                  </div>
                </div>

                <button onClick={handleCheckout} className="w-full btn-primary flex items-center justify-center gap-2">
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <button
                  onClick={() => navigate('/restaurants')}
                  className="w-full mt-4 btn-secondary"
                >
                  Add More Items
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
