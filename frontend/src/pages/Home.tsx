import { useNavigate } from 'react-router-dom';
import { ChefHat, Truck, Star, Clock } from 'lucide-react';
import { motion } from 'motion/react';

export const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-primary">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-accent/10 via-transparent to-transparent"></div>
        
        <div className="container-custom text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-accent p-6 rounded-full mx-auto w-32 h-32 flex items-center justify-center mb-8">
              <ChefHat className="w-20 h-20 text-primary" />
            </div>
            
            <h1 className="text-7xl text-accent mb-6">Premium Delivery</h1>
            <p className="text-2xl text-secondary mb-12 max-w-2xl mx-auto">
              Experience luxury dining at your doorstep. Curated restaurants, exquisite cuisine, impeccable service.
            </p>
            
            <div className="flex gap-6 justify-center">
              <button
                onClick={() => navigate('/register')}
                className="btn-primary text-xl px-10 py-4"
              >
                Get Started
              </button>
              <button
                onClick={() => navigate('/login')}
                className="btn-secondary text-xl px-10 py-4"
              >
                Sign In
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container-custom py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center"
          >
            <div className="bg-accent p-6 rounded-full mx-auto w-24 h-24 flex items-center justify-center mb-6">
              <Star className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-2xl text-accent mb-4">Premium Selection</h3>
            <p className="text-gray-light">
              Hand-picked restaurants offering the finest culinary experiences
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <div className="bg-accent p-6 rounded-full mx-auto w-24 h-24 flex items-center justify-center mb-6">
              <Clock className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-2xl text-accent mb-4">Swift Delivery</h3>
            <p className="text-gray-light">
              Your gourmet meals delivered fresh and fast to your location
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <div className="bg-accent p-6 rounded-full mx-auto w-24 h-24 flex items-center justify-center mb-6">
              <Truck className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-2xl text-accent mb-4">Live Tracking</h3>
            <p className="text-gray-light">
              Track your order in real-time from kitchen to your doorstep
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
