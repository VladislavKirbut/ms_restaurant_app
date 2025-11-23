import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store, RootState, AppDispatch } from './src/redux/store';
import { loadUser } from './src/redux/slices/authSlice';
import { Toaster } from 'sonner';

// Components
import { Navbar } from './src/components/Navbar';
import { ProtectedRoute } from './src/components/ProtectedRoute';
import { LoadingSpinner } from './src/components/LoadingSpinner';

// Pages
import { Login } from './src/pages/Login';
import { Register } from './src/pages/Register';
import { Home } from './src/pages/Home';
import { RestaurantList } from './src/pages/RestaurantList';
import { Menu } from './src/pages/Menu';
import { Cart } from './src/pages/Cart';
import { Checkout } from './src/pages/Checkout';
import { Payment } from './src/pages/Payment';
import { OrderTracking } from './src/pages/OrderTracking';
import { Profile } from './src/pages/Profile';
import { Orders } from './src/pages/Orders';
import { Admin } from './src/pages/Admin';

const AppContent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(loadUser());
    }
  }, [dispatch]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-primary">
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/restaurants" /> : <Login />}
          />
          <Route
            path="/register"
            element={isAuthenticated ? <Navigate to="/restaurants" /> : <Register />}
          />

          {/* Protected Routes */}
          <Route
            path="/restaurants"
            element={
              <ProtectedRoute>
                <RestaurantList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/restaurant/:id"
            element={
              <ProtectedRoute>
                <Menu />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-tracking/:id"
            element={
              <ProtectedRoute>
                <OrderTracking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <Admin />
              </ProtectedRoute>
            }
          />

          {/* Default Route */}
          <Route
            path="/"
            element={
              isAuthenticated ? <Navigate to="/restaurants" /> : <Navigate to="/login" />
            }
          />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a1a1a',
            color: '#ffffff',
            border: '1px solid #333333',
          },
          className: 'sonner-toast',
        }}
      />
      <AppContent />
    </Provider>
  );
}