import { Suspense, lazy } from 'react';
import { Outlet, RouteObject, createBrowserRouter, useLocation } from 'react-router';
import App from 'App';
import AuthLayout from 'layouts/auth-layout';
import MainLayout from 'layouts/main-layout';
import Page404 from 'pages/errors/Page404';
import PageLoader from 'components/loading/PageLoader';
import ProtectedRoute from 'components/common/ProtectedRoute';
import PublicRoute from 'components/common/PublicRoute';
import paths, { rootPaths } from './paths';

const Dashboard = lazy(() => import('pages/dashboard'));
const UserList = lazy(() => import('pages/users/UserList'));
const CreateUser = lazy(() => import('pages/users/CreateUser'));
const EditUser = lazy(() => import('pages/users/EditUser'));
const CreateAnamnese = lazy(() => import('pages/anamnese/CreateAnamnese'));
const EditAnamnese = lazy(() => import('pages/anamnese/EditAnamnese'));
const AnamneseDetails = lazy(() => import('pages/anamnese/DetailsAnamnese'));
const AnamneseList = lazy(() => import('pages/anamnese/ListAnemnese'));
const Starter = lazy(() => import('pages/others/Starter'));
const Account = lazy(() => import('pages/others/Account'));

const Login = lazy(() => import('pages/authentication/Login'));
const Signup = lazy(() => import('pages/authentication/Signup'));
const ForgotPassword = lazy(() => import('pages/authentication/ForgotPassword'));

export const SuspenseOutlet = () => {
  const location = useLocation();

  return (
    <Suspense key={location.pathname} fallback={<PageLoader />}>
      <Outlet />
    </Suspense>
  );
};

export const routes: RouteObject[] = [
  {
    element: <App />,
    children: [
      {
        path: '/',
        element: (
          <ProtectedRoute>
            <MainLayout>
              <SuspenseOutlet />
            </MainLayout>
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: paths.users,
            element: <UserList />,
          },
          {
            path: paths.createUser,
            element: <CreateUser />,
          },
          {
            path: paths.editUser,
            element: <EditUser />,
          },
          {
            path: paths.anamneseList,
            element: <AnamneseList />,
          },
          {
            path: paths.createAnamnese,
            element: <CreateAnamnese />,
          },
          {
            path: paths.editAnamnese,
            element: <EditAnamnese />,
          },
          {
            path: paths.anamneseDetails,
            element: <AnamneseDetails />,
          },
          {
            path: paths.account,
            element: <Account />,
          },
          {
            path: paths.starter,
            element: <Starter />,
          },
        ],
      },
      {
        path: rootPaths.authRoot,
        element: (
          <PublicRoute>
            <AuthLayout>
              <SuspenseOutlet />
            </AuthLayout>
          </PublicRoute>
        ),
        children: [
          {
            path: paths.login,
            element: <Login />,
          },
          {
            path: paths.signup,
            element: <Signup />,
          },
          {
            path: paths.forgotPassword,
            element: <ForgotPassword />,
          },
        ],
      },

      {
        path: paths['404'],
        element: <Page404 />,
      },
      {
        path: '*',
        element: <Page404 />,
      },
    ],
  },
];

const router = createBrowserRouter(routes, {
  basename: import.meta.env.MODE === 'production' ? import.meta.env.VITE_BASENAME : '/',
});

export default router;
