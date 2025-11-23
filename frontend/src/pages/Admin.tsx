import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import {
  fetchRestaurants,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
} from '../redux/slices/restaurantsSlice';
import {
  fetchAllDishes,
  createDish,
  updateDish,
  deleteDish,
} from '../redux/slices/dishesSlice';
import {
  fetchAllOrders,
  updateOrderStatus,
} from '../redux/slices/ordersSlice';
import { Store, Utensils, Package, Plus, Edit2, Trash2, X } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

type Tab = 'restaurants' | 'dishes' | 'orders';

export const Admin = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [activeTab, setActiveTab] = useState<Tab>('restaurants');

  useEffect(() => {
    dispatch(fetchRestaurants());
    dispatch(fetchAllDishes());
    dispatch(fetchAllOrders());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-primary">
      <div className="bg-gray-dark border-b border-gray-medium">
        <div className="container-custom py-8">
          <h1 className="text-4xl text-accent mb-2">Admin Panel</h1>
          <p className="text-gray-light">Manage your platform</p>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-medium">
          <button
            onClick={() => setActiveTab('restaurants')}
            className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
              activeTab === 'restaurants'
                ? 'border-accent text-accent'
                : 'border-transparent text-gray-light hover:text-secondary'
            }`}
          >
            <Store className="w-5 h-5" />
            <span>Restaurants</span>
          </button>
          <button
            onClick={() => setActiveTab('dishes')}
            className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
              activeTab === 'dishes'
                ? 'border-accent text-accent'
                : 'border-transparent text-gray-light hover:text-secondary'
            }`}
          >
            <Utensils className="w-5 h-5" />
            <span>Dishes</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
              activeTab === 'orders'
                ? 'border-accent text-accent'
                : 'border-transparent text-gray-light hover:text-secondary'
            }`}
          >
            <Package className="w-5 h-5" />
            <span>Orders</span>
          </button>
        </div>

        {/* Content */}
        {activeTab === 'restaurants' && <RestaurantManager />}
        {activeTab === 'dishes' && <DishManager />}
        {activeTab === 'orders' && <OrderManager />}
      </div>
    </div>
  );
};

// Restaurant Manager Component
const RestaurantManager = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { restaurants } = useSelector((state: RootState) => state.restaurants);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    cuisine: '',
    address: '',
    imageUrl: '',
    rating: 4.5,
    deliveryTime: 30,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      await dispatch(updateRestaurant({ id: editingId, updates: formData }));
      toast.success('Restaurant updated successfully');
    } else {
      await dispatch(createRestaurant(formData));
      toast.success('Restaurant created successfully');
    }
    
    resetForm();
  };

  const handleEdit = (restaurant: any) => {
    setFormData({
      name: restaurant.name,
      cuisine: restaurant.cuisine,
      address: restaurant.address,
      imageUrl: restaurant.imageUrl,
      rating: restaurant.rating,
      deliveryTime: restaurant.deliveryTime,
    });
    setEditingId(restaurant.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this restaurant?')) {
      await dispatch(deleteRestaurant(id));
      toast.success('Restaurant deleted successfully');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      cuisine: '',
      address: '',
      imageUrl: '',
      rating: 4.5,
      deliveryTime: 30,
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl text-secondary">Manage Restaurants</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-2"
        >
          {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          {showForm ? 'Cancel' : 'Add Restaurant'}
        </button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="card p-6 mb-6"
        >
          <h3 className="text-xl text-secondary mb-4">
            {editingId ? 'Edit Restaurant' : 'Add New Restaurant'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-secondary mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-secondary mb-2">Cuisine</label>
                <input
                  type="text"
                  value={formData.cuisine}
                  onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
                  required
                  className="input-field"
                />
              </div>
            </div>
            <div>
              <label className="block text-secondary mb-2">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-secondary mb-2">Image URL</label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                required
                className="input-field"
                placeholder="https://..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-secondary mb-2">Rating</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                  required
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-secondary mb-2">Delivery Time (min)</label>
                <input
                  type="number"
                  value={formData.deliveryTime}
                  onChange={(e) => setFormData({ ...formData, deliveryTime: parseInt(e.target.value) })}
                  required
                  className="input-field"
                />
              </div>
            </div>
            <button type="submit" className="btn-primary">
              {editingId ? 'Update Restaurant' : 'Create Restaurant'}
            </button>
          </form>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {restaurants.map((restaurant) => (
          <motion.div
            key={restaurant.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card p-6"
          >
            <div className="flex gap-4">
              <img
                src={restaurant.imageUrl}
                alt={restaurant.name}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="text-xl text-secondary mb-1">{restaurant.name}</h3>
                <p className="text-accent mb-2">{restaurant.cuisine}</p>
                <p className="text-sm text-gray-light mb-2">{restaurant.address}</p>
                <p className="text-sm text-gray-light">
                  Rating: {restaurant.rating} • {restaurant.deliveryTime} min
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleEdit(restaurant)}
                  className="p-2 bg-accent text-primary rounded hover:bg-accent-light transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(restaurant.id)}
                  className="p-2 bg-error text-secondary rounded hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Dish Manager Component
const DishManager = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { dishes } = useSelector((state: RootState) => state.dishes);
  const { restaurants } = useSelector((state: RootState) => state.restaurants);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    restaurantId: '',
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      await dispatch(updateDish({ id: editingId, updates: formData }));
      toast.success('Dish updated successfully');
    } else {
      await dispatch(createDish(formData));
      toast.success('Dish created successfully');
    }
    
    resetForm();
  };

  const handleEdit = (dish: any) => {
    setFormData({
      restaurantId: dish.restaurantId,
      name: dish.name,
      description: dish.description,
      price: dish.price,
      imageUrl: dish.imageUrl,
    });
    setEditingId(dish.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this dish?')) {
      await dispatch(deleteDish(id));
      toast.success('Dish deleted successfully');
    }
  };

  const resetForm = () => {
    setFormData({
      restaurantId: '',
      name: '',
      description: '',
      price: 0,
      imageUrl: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl text-secondary">Manage Dishes</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-2"
        >
          {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          {showForm ? 'Cancel' : 'Add Dish'}
        </button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="card p-6 mb-6"
        >
          <h3 className="text-xl text-secondary mb-4">
            {editingId ? 'Edit Dish' : 'Add New Dish'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-secondary mb-2">Restaurant</label>
              <select
                value={formData.restaurantId}
                onChange={(e) => setFormData({ ...formData, restaurantId: e.target.value })}
                required
                className="input-field"
              >
                <option value="">Select Restaurant</option>
                {restaurants.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-secondary mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-secondary mb-2">Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  required
                  className="input-field"
                />
              </div>
            </div>
            <div>
              <label className="block text-secondary mb-2">Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-secondary mb-2">Image URL</label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                required
                className="input-field"
                placeholder="https://..."
              />
            </div>
            <button type="submit" className="btn-primary">
              {editingId ? 'Update Dish' : 'Create Dish'}
            </button>
          </form>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dishes.map((dish) => {
          const restaurant = restaurants.find((r) => r.id === dish.restaurantId);
          return (
            <motion.div
              key={dish.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card overflow-hidden"
            >
              <img
                src={dish.imageUrl}
                alt={dish.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <p className="text-xs text-accent mb-2">{restaurant?.name}</p>
                <h3 className="text-lg text-secondary mb-1">{dish.name}</h3>
                <p className="text-sm text-gray-light mb-3 line-clamp-2">{dish.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl text-accent">${dish.price.toFixed(2)}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(dish)}
                      className="p-2 bg-accent text-primary rounded hover:bg-accent-light transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(dish.id)}
                      className="p-2 bg-error text-secondary rounded hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// Order Manager Component
const OrderManager = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { orders } = useSelector((state: RootState) => state.orders);
  const { restaurants } = useSelector((state: RootState) => state.restaurants);

  const [filterStatus, setFilterStatus] = useState<string>('all');

  const handleStatusChange = async (orderId: string, newStatus: any) => {
    await dispatch(updateOrderStatus({ id: orderId, status: newStatus }));
    toast.success('Order status updated');
  };

  const filteredOrders =
    filterStatus === 'all'
      ? orders
      : orders.filter((o) => o.status === filterStatus);

  const sortedOrders = filteredOrders
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl text-secondary">Manage Orders</h2>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="input-field w-auto"
        >
          <option value="all">All Orders</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="PREPARING">Preparing</option>
          <option value="READY">Ready</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      <div className="space-y-4">
        {sortedOrders.map((order) => {
          const restaurant = restaurants.find((r) => r.id === order.restaurantId);
          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card p-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-light mb-1">Order ID</p>
                  <p className="text-secondary">#{order.id}</p>
                  <p className="text-xs text-gray-light mt-2">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-light mb-1">Restaurant</p>
                  <p className="text-secondary">{restaurant?.name || 'N/A'}</p>
                  <p className="text-xs text-gray-light mt-2">
                    {order.items.length} items • ${order.total.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-light mb-1">Delivery Address</p>
                  <p className="text-secondary text-sm line-clamp-2">{order.deliveryAddress}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-light mb-1">Status</p>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="input-field w-full"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="PREPARING">Preparing</option>
                    <option value="READY">Ready</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {sortedOrders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-light">No orders found</p>
        </div>
      )}
    </div>
  );
};
