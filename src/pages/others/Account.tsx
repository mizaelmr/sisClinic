import { SyntheticEvent, useState } from 'react';
import { TabContext } from '@mui/lab';
import { Container, Drawer, Paper, SnackbarCloseReason, Stack, Typography } from '@mui/material';
import ProSnackbar from 'layouts/main-layout/common/ProSnackbar';
import AccountsProvider from 'providers/AccountsProvider';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import SimpleBar from 'components/base/SimpleBar';
import AccountTabPanel from 'components/sections/account/common/AccountTabPanel';
import PersonalInfoTabPanel from 'components/sections/account/personal-info/PersonalInfoTabPanel';
import IconifyIcon from 'components/base/IconifyIcon';

const Account = () => {
  const [open, setOpen] = useState(false);
  const { down } = useBreakpoints();
  const [showTabList, setShowTabList] = useState(true);

  const downMd = down('md');
  const handleChange = (_event: SyntheticEvent, newValue: string): void => {
    if (newValue !== 'personal_information') {
      setOpen(true);
      return;
    }
  };

  const handleClose = (_event: SyntheticEvent, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  return (
    <AccountsProvider>
      <TabContext value="personal_information">
        <Stack>
          <Paper sx={{ flex: 1, maxWidth: 1 }}>
            <Container
              maxWidth={false}
              sx={{
                px: { xs: 3, md: 5 },
                py: 5,
                maxWidth: { xs: 628, md: 660 },
                overflowY: 'hidden',
                height: downMd ? 1 : 'auto',
              }}
            >
              <PersonalInfoTabPanel />
            </Container>
          </Paper>
          <ProSnackbar open={open} onClose={handleClose} />
        </Stack>
      </TabContext>
    </AccountsProvider>
  );
};

export default Account;
