import { documentationPath } from 'lib/constants';

export const rootPaths = {
  root: '/',
  authRoot: 'auth',
};

const paths = {
  root: rootPaths.root,
  starter: `/starter`,
  users: `/pacientes`,
  createUser: `/paciente/create`,
  editUser: `/paciente/edit/:id`,
  createAnamnese: `/anamnese/create`,
  editAnamnese: `/anamnese/edit/:id`,
  anamneseDetails: `/anamnese/details/:id`,
  anamneseList: `/anamnese`,
  account: `/account`,
  login: `/${rootPaths.authRoot}/login`,
  signup: `/${rootPaths.authRoot}/sign-up`,
  forgotPassword: `/${rootPaths.authRoot}/forgot-password`,
  notifications: `/notifications`,
  documentation: documentationPath,

  404: `/404`,
};

export default paths;
