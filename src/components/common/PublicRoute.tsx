import { Navigate } from 'react-router';
import { useAuth } from 'providers/AuthProvider';
import PageLoader from 'components/loading/PageLoader';
import paths from 'routes/paths';

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <PageLoader />;
  }

  if (user) {
    return <Navigate to={paths.root} replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
