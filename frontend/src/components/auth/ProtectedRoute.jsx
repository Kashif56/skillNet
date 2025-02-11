import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

// AuthRoute: Redirects to dashboard if user is already authenticated
export const AuthRoute = ({ children }) => {
  const { isAuthenticated, token, username } = useSelector((state) => state.auth);

  if (isAuthenticated && token && username) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// PrivateRoute: Redirects to login if user is not authenticated
export const PrivateRoute = ({ children }) => {
  const { isAuthenticated, token, username } = useSelector((state) => state.auth);

  if (!isAuthenticated || !token || !username) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
