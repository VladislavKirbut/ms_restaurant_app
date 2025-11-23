import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurant } from '../redux/slices/restaurantsSlice';
import { fetchDishesByRestaurant } from '../redux/slices/dishesSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { RootState, AppDispatch } from '../redux/store';
import { Star, Clock, MapPin, Plus, Minus, ShoppingCart } from 'lucide-react';
import { motion } from 'motion/react';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { toast } from 'sonner';

export const Menu = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { currentRestaurant } = useSelector((state: RootState) => state.restaurants);
  const { dishes, loading } = useSelector((state: RootState) => state.dishes);

  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    if (id) {
      dispatch(fetchRestaurant(id));
      dispatch(fetchDishesByRestaurant(id));
    }
  }, [dispatch, id]);

  const handleQuantityChange = (dishId: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [dishId]: Math.max(0, (prev[dishId] || 0) + delta),
    }));
  };

  const handleAddToCart = (dish: any) => {
    const quantity = quantities[dish.id] || 1;
    dispatch(
      addToCart({
        dishId: dish.id,
        name: dish.name,
        price: dish.price,
        quantity,
        imageUrl: dish.imageUrl,
        restaurantId: dish.restaurantId,
        restaurantName: currentRestaurant?.name || '',
      })
    );
    toast.success(`Added ${quantity}x ${dish.name} to cart`);
    setQuantities((prev) => ({ ...prev, [dish.id]: 0 }));
  };

  if (loading || !currentRestaurant) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-primary">
      {/* Restaurant Header */}
      <div className="relative h-96">
        <img
          src={currentRestaurant.imageUrl}
          alt={currentRestaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 right-0">
          <div className="container-custom pb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-5xl text-accent mb-4">{currentRestaurant.name}</h1>
              <p className="text-xl text-secondary mb-4">{currentRestaurant.cuisine} Cuisine</p>
              
              <div className="flex items-center gap-6 text-secondary">
                <div className="flex items-center gap-2 bg-accent text-primary px-4 py-2 rounded-full">
                  <Star className="w-5 h-5 fill-current" />
                  <span>{currentRestaurant.rating}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{currentRestaurant.deliveryTime} min delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>{currentRestaurant.address}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div className="container-custom py-12">
        <h2 className="text-3xl text-secondary mb-8">Our Menu</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dishes.map((dish, index) => {
            const quantity = quantities[dish.id] || 1;

            return (
              <motion.div
                key={dish.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={dish.imageUrl}
                    alt={dish.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent opacity-60"></div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl text-secondary mb-2">{dish.name}</h3>
                  <p className="text-gray-light text-sm mb-4 line-clamp-2">{dish.description}</p>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl text-accent">${dish.price.toFixed(2)}</span>
                  </div>

                  {/* Quantity Selector */}
                  <div className="flex items-center gap-4 mb-4">
                    <button
                      onClick={() => handleQuantityChange(dish.id, -1)}
                      className="w-10 h-10 bg-gray-medium rounded-full flex items-center justify-center hover:bg-accent hover:text-primary transition-colors"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="text-xl text-secondary w-8 text-center">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(dish.id, 1)}
                      className="w-10 h-10 bg-gray-medium rounded-full flex items-center justify-center hover:bg-accent hover:text-primary transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>

                  <button
                    onClick={() => handleAddToCart(dish)}
                    className="w-full btn-primary flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {dishes.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-light text-xl">No dishes available at this restaurant</p>
          </div>
        )}
      </div>
    </div>
  );
};
