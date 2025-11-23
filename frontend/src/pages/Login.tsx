import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login, clearError } from '../redux/slices/authSlice';
import { RootState, AppDispatch } from '../redux/store';
import { ChefHat, Mail, Lock, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

export const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    // Prevent scrolling on this page
    document.body.style.overflow = 'hidden';
    
    if (isAuthenticated) {
      navigate('/restaurants');
    }
    return () => {
      dispatch(clearError());
      // Restore scrolling when leaving the page
      document.body.style.overflow = 'auto';
    };
  }, [isAuthenticated, navigate, dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  return (
    <div className="fixed inset-0 bg-primary flex items-center justify-center overflow-hidden">
      <div className="w-full max-w-md px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-dark border border-gray-medium rounded-2xl p-8 shadow-2xl"
        >
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="bg-accent p-4 rounded-full mb-4">
              <ChefHat className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-3xl text-accent mb-2">Premium Delivery</h1>
            <p className="text-gray-light reg-text-handwriting login">Hungry? Log in and feast!</p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-error bg-opacity-10 border border-error text-error rounded-lg p-4 mb-6 flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-secondary mb-2">Email</label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="input-field pl-12"
                  placeholder="your@email.com"
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-light pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-secondary mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-light" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="input-field pl-12"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-medium"></div>
            <span className="text-gray-light text-sm">OR</span>
            <div className="flex-1 h-px bg-gray-medium"></div>
          </div>

          {/* Register Link */}
          <p className="text-center text-gray-light">
            Don't have an account?{' '}
            <Link to="/register" className="text-accent hover:text-accent-light transition-colors duration-200">
              Create one
            </Link>
          </p>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gray-medium bg-opacity-30 rounded-lg">
            <p className="text-xs text-gray-light mb-2">Demo Credentials:</p>
            <p className="text-xs text-secondary">User: user@example.com / any password</p>
            <p className="text-xs text-secondary">Admin: admin@premium.com / any password</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};