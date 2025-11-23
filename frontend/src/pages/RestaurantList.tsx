import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchRestaurants } from '../redux/slices/restaurantsSlice';
import { RootState, AppDispatch } from '../redux/store';
import { Star, Clock, MapPin, Filter, Search } from 'lucide-react';
import { motion } from 'motion/react';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const RestaurantList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { restaurants, loading } = useSelector((state: RootState) => state.restaurants);

  const [filters, setFilters] = useState({
    cuisine: '',
    minRating: 0,
    maxDeliveryTime: 100,
    search: '',
  });

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const { search, ...apiFilters } = filters;
    const params: any = {};
    
    if (apiFilters.cuisine) params.cuisine = apiFilters.cuisine;
    if (apiFilters.minRating > 0) params.minRating = apiFilters.minRating;
    if (apiFilters.maxDeliveryTime < 100) params.maxDeliveryTime = apiFilters.maxDeliveryTime;
    
    dispatch(fetchRestaurants(params));
  }, [dispatch, filters.cuisine, filters.minRating, filters.maxDeliveryTime]);

  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(filters.search.toLowerCase()) ||
    restaurant.cuisine.toLowerCase().includes(filters.search.toLowerCase())
  );

  const cuisines = Array.from(new Set(restaurants.map((r) => r.cuisine)));

  if (loading && restaurants.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-primary">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-gray-dark to-primary border-b border-gray-medium">
        <div className="container-custom py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl text-accent mb-4">Discover Premium Dining</h1>
            <p className="text-xl text-gray-light mb-8">
              Curated selection of finest restaurants delivered to your door
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-light" />
              <input
                type="text"
                placeholder="Search restaurants or cuisines..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="input-field pl-16 pr-6 py-4 text-lg"
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container-custom py-12">
        {/* Filter Toggle */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl text-secondary">
            {filteredRestaurants.length} Restaurant{filteredRestaurants.length !== 1 ? 's' : ''} Available
          </h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary flex items-center gap-2"
          >
            <Filter className="w-5 h-5" />
            Filters
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="card p-6 mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-secondary mb-2">Cuisine</label>
                <select
                  value={filters.cuisine}
                  onChange={(e) => setFilters({ ...filters, cuisine: e.target.value })}
                  className="input-field"
                >
                  <option value="">All Cuisines</option>
                  {cuisines.map((cuisine) => (
                    <option key={cuisine} value={cuisine}>
                      {cuisine}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-secondary mb-2">
                  Minimum Rating: {filters.minRating > 0 ? filters.minRating.toFixed(1) : 'Any'}
                </label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={filters.minRating}
                  onChange={(e) => setFilters({ ...filters, minRating: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-gray-medium rounded-lg appearance-none cursor-pointer accent-accent"
                />
              </div>

              <div>
                <label className="block text-secondary mb-2">
                  Max Delivery Time: {filters.maxDeliveryTime < 100 ? `${filters.maxDeliveryTime} min` : 'Any'}
                </label>
                <input
                  type="range"
                  min="15"
                  max="100"
                  step="5"
                  value={filters.maxDeliveryTime}
                  onChange={(e) => setFilters({ ...filters, maxDeliveryTime: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-medium rounded-lg appearance-none cursor-pointer accent-accent"
                />
              </div>
            </div>

            <button
              onClick={() => setFilters({ cuisine: '', minRating: 0, maxDeliveryTime: 100, search: '' })}
              className="mt-4 text-accent hover:text-accent-light transition-colors"
            >
              Clear All Filters
            </button>
          </motion.div>
        )}

        {/* Restaurant Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRestaurants.map((restaurant, index) => (
            <motion.div
              key={restaurant.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card group overflow-hidden"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={restaurant.imageUrl}
                  alt={restaurant.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent opacity-60"></div>
                <div className="absolute top-4 right-4 bg-accent text-primary px-3 py-1 rounded-full flex items-center gap-1">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{restaurant.rating}</span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl text-secondary mb-2">{restaurant.name}</h3>
                <p className="text-accent mb-4">{restaurant.cuisine}</p>

                <div className="flex items-center gap-4 text-sm text-gray-light mb-6">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{restaurant.deliveryTime} min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">{restaurant.address.split(',')[0]}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                  className="w-full btn-primary"
                >
                  View Menu
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredRestaurants.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-light text-xl">No restaurants found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};
