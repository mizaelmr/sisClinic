import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import paths from 'routes/paths';
import UserListContainer from 'components/sections/user-table';
import PageHeader from 'components/sections/user-table/PageHeader';

// PÁGINA DE LISTAGEM DE PACIENTES
const UserList = () => {
  return (
    <Stack direction="column" height={1}>
      <PageHeader
        title="Lista de Pacientes"
        breadcrumb={[
          { label: 'Início', url: paths.root },
          { label: 'Pacientes', active: true },
        ]}
      />
      <Paper sx={{ flex: 1, p: { xs: 3, md: 5 } }}>
        <UserListContainer />
      </Paper>
    </Stack>
  );
};

export default UserList;
