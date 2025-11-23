import { ReactNode, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../redux/store';
import { decodeToken } from '../api/mockApi';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { isAuthenticated, token } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !token) {
      navigate('/login');
      return;
    }

    if (requireAdmin) {
      const decoded = decodeToken(token);
      if (decoded?.role !== 'ADMIN') {
        navigate('/');
      }
    }
  }, [isAuthenticated, token, requireAdmin, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  if (requireAdmin) {
    const decoded = decodeToken(token);
    if (decoded?.role !== 'ADMIN') {
      return null;
    }
  }

  return <>{children}</>;
};
