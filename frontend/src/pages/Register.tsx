import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { register, clearError } from '../redux/slices/authSlice';
import { RootState, AppDispatch } from '../redux/store';
import { ChefHat, Mail, Lock, User, Phone, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

export const Register = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });

  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/restaurants');
    }
    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, navigate, dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setValidationError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setValidationError('Password must be at least 6 characters');
      return;
    }

    const { confirmPassword, ...registerData } = formData;
    dispatch(register(registerData));
  };

  const displayError = validationError || error;

  return (
    <div className="fixed inset-0 bg-primary flex items-center justify-center overflow-hidden">
      <div className="w-full max-w-md px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-dark border border-gray-medium rounded-2xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#d4af37 #1a1a1a',
          }}
        >
          {/* Logo */}
          <div className="flex flex-col items-center mb-6">
            <div className="bg-accent p-4 rounded-full mb-4">
              <ChefHat className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-3xl text-accent mb-2">Premium Delivery</h1>
            <p className="text-gray-light reg-text-handwriting register">Hungry? Let’s get you started!</p>
          </div>

          {/* Error Message */}
          {displayError && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-error bg-opacity-10 border border-error text-error rounded-lg p-4 mb-6 flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{displayError}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-secondary mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-light" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="input-field pl-12"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-secondary mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-light" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="input-field pl-12"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-secondary mb-2">Phone</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-light" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="input-field pl-12"
                  placeholder="+1 234 567 8900"
                />
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

            <div>
              <label className="block text-secondary mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-light" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
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
                  <span>Creating account...</span>
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-medium"></div>
            <span className="text-gray-light text-sm">OR</span>
            <div className="flex-1 h-px bg-gray-medium"></div>
          </div>

          {/* Login Link */}
          <p className="text-center text-gray-light">
            Already have an account?{' '}
            <Link to="/login" className="text-accent hover:text-accent-light transition-colors duration-200">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};
