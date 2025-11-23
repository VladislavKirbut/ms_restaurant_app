import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { RootState } from '../redux/store';
import { logout } from '../redux/slices/authSlice';
import { ShoppingCart, User, LogOut, ChefHat, Package } from 'lucide-react';
import { decodeToken } from '../api/mockApi';

export const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, token } = useSelector((state: RootState) => state.auth);
  const { items } = useSelector((state: RootState) => state.cart);

  const isAdmin = token ? decodeToken(token)?.role === 'ADMIN' : false;
  
  // Hide navbar on login and register pages
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-gray-dark border-b border-gray-medium sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-accent p-2 rounded-lg transition-transform duration-300 group-hover:scale-110">
              <ChefHat className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl text-accent">Premium Delivery</h1>
              <p className="text-xs text-gray-light">Luxury at your doorstep</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <Link
                  to="/restaurants"
                  className="text-secondary hover:text-accent transition-colors duration-200"
                >
                  Restaurants
                </Link>
                
                <Link
                  to="/orders"
                  className="flex items-center gap-2 text-secondary hover:text-accent transition-colors duration-200"
                >
                  <Package className="w-5 h-5" />
                  <span>Orders</span>
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin"
                    className="text-accent hover:text-accent-light transition-colors duration-200"
                  >
                    Admin Panel
                  </Link>
                )}

                <Link
                  to="/cart"
                  className="relative flex items-center gap-2 text-secondary hover:text-accent transition-colors duration-200"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {items.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-accent text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {items.length}
                    </span>
                  )}
                </Link>

                <Link
                  to="/profile"
                  className="flex items-center gap-2 text-secondary hover:text-accent transition-colors duration-200"
                >
                  <User className="w-5 h-5" />
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-secondary hover:text-accent transition-colors duration-200"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};