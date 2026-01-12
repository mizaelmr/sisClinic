import { Box, Button, Stack, Typography, paperClasses } from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import { useSettingsContext } from 'providers/SettingsProvider';
import IconifyIcon from 'components/base/IconifyIcon';
import Logo from 'components/common/Logo';
import SearchBox, { SearchBoxButton } from '../common/search-box/SearchBox';
import ProfileMenu from '../common/ProfileMenu';
import { useAuth } from 'providers/AuthProvider';

// HEADER DO SISTEMA
const AppBar = () => {
  const { user } = useAuth();
  const {
    config: { drawerWidth },
    handleDrawerToggle,
  } = useSettingsContext();

  const { up } = useBreakpoints();
  const upSm = up('sm');
  const upMd = up('md');

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
        <Typography variant="h6" sx={{ flexGrow: 1 }}>Bem vindo(a) ao Dashfisio, {user?.displayName}</Typography>
        <ProfileMenu />
      </Toolbar>
    </MuiAppBar>
  );
};

export default AppBar;
