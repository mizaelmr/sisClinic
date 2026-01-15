import { Typography, paperClasses } from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useSettingsContext } from 'providers/SettingsProvider';
import ProfileMenu from '../common/ProfileMenu';
import { useAuth } from 'providers/AuthProvider';
import dayjs from 'dayjs';

// HEADER DO SISTEMA
const AppBar = () => {
  const { user } = useAuth();
  const {
    config: { drawerWidth },
  } = useSettingsContext();

  return (
    <MuiAppBar
      position="fixed"
      sx={{
        width: { md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
        borderBottom: `1px solid`,
        borderColor: 'divider',
        [`&.${paperClasses.root}`]: {
          outline: 'none',
        },
      }}
    >
      <Toolbar variant="appbar" sx={{ px: { xs: 3, md: 5 }, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>Bem vindo(a) ao Dashfisio, {user?.displayName} - {dayjs().format('DD/MM/YYYY')}</Typography>
        <ProfileMenu />
      </Toolbar>
    </MuiAppBar>
  );
};

export default AppBar;
