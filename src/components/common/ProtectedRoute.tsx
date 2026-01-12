import { Navigate } from 'react-router';
import { useAuth } from 'providers/AuthProvider';
import PageLoader from 'components/loading/PageLoader';
import paths from 'routes/paths';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <PageLoader />;
  }

  if (!user) {
    return <Navigate to={paths.login} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
